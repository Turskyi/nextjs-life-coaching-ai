import {
  GoogleGenerativeAIStream,
  MistralStream,
  OpenAIStream as GroqStream,
  StreamingTextResponse,
  StreamData,
} from 'ai';
import { getGroqChatStream } from './groq';
import { getMistralChatStream } from './mistral';
import { getGeminiChatStream } from './gemini';

export async function generateChatResponse(messages: any[]) {
  const data = new StreamData();

  try {
    // Primary: Groq
    console.log('Trying Groq...');
    const stream = await getValidatedStream(
      getGroqChatStream(messages),
      GroqStream,
    );
    data.append({ model: 'Groq: Qwen 32B' });
    return new StreamingTextResponse(stream, {}, data);
  } catch (groqError) {
    console.error('Groq failed or empty:', groqError);
    try {
      // Fallback 1: Mistral
      console.log('Trying Mistral...');
      const stream = await getValidatedStream(
        getMistralChatStream(messages),
        MistralStream,
      );
      data.append({ model: 'Mistral Small' });
      return new StreamingTextResponse(stream, {}, data);
    } catch (mistralError) {
      console.error('Mistral failed or empty:', mistralError);
      try {
        // Fallback 2: Gemini
        console.log('Trying Gemini...');
        const stream = await getValidatedStream(
          getGeminiChatStream(messages),
          GoogleGenerativeAIStream,
        );
        data.append({ model: 'Gemini 1.5 Flash' });
        return new StreamingTextResponse(stream, {}, data);
      } catch (geminiError) {
        console.error('Gemini failed or empty:', geminiError);
        data.close();
        return new Response(
          JSON.stringify({
            error:
              'All AI providers are currently unavailable. Please try again later. (╯°□°）╯︵ ┻━┻',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }
  }
}

async function getValidatedStream(
  providerPromise: Promise<any>,
  converter: (res: any) => ReadableStream,
): Promise<ReadableStream> {
  const response = await providerPromise;
  const originalStream = converter(response);
  const filteringStream = originalStream.pipeThrough(createFilteringStream());

  const reader = filteringStream.getReader();
  const firstChunk = await reader.read();

  if (firstChunk.done) {
    throw new Error('Provider returned an empty response after filtering.');
  }

  // Re-assemble the stream by putting the first chunk back
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(firstChunk.value);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });
}

function createFilteringStream() {
  let inThinkTag = false;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new TransformStream({
    transform(chunk, controller) {
      const text = typeof chunk === 'string' ? chunk : decoder.decode(chunk);
      let processed = text;

      if (inThinkTag) {
        const endIdx = processed.indexOf('</think>');
        if (endIdx !== -1) {
          processed = processed.substring(endIdx + 8);
          inThinkTag = false;
        } else {
          processed = '';
        }
      }

      if (!inThinkTag) {
        const startIdx = processed.indexOf('<think>');
        if (startIdx !== -1) {
          const endIdx = processed.indexOf('</think>', startIdx);
          if (endIdx !== -1) {
            processed =
              processed.substring(0, startIdx) + processed.substring(endIdx + 8);
          } else {
            processed = processed.substring(0, startIdx);
            inThinkTag = true;
          }
        }
      }

      if (processed) {
        controller.enqueue(encoder.encode(processed));
      }
    },
  });
}
