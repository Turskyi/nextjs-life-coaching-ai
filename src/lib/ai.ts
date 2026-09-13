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
      data,
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
        data,
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
          data,
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
  data: StreamData,
): Promise<ReadableStream> {
  const response = await providerPromise;
  const originalStream = converter(response);
  const filteringStream = originalStream.pipeThrough(createFilteringStream());

  const reader = filteringStream.getReader();
  let firstChunk = await reader.read();

  // If the first chunk is empty (e.g., all leading whitespace was trimmed),
  // reader.read() will return the next non-empty chunk or done: true.
  if (firstChunk.done) {
    throw new Error('Provider returned an empty response after filtering.');
  }

  return new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(firstChunk.value);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
        data.close();
      }
    },
    async cancel(reason) {
      await reader.cancel(reason);
      data.close();
    },
  });
}

function createFilteringStream() {
  let inThinkTag = false;
  let isLeadingWhitespace = true;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new TransformStream({
    transform(chunk, controller) {
      const text = typeof chunk === 'string' ? chunk : decoder.decode(chunk);

      // The AI SDK protocol uses prefixes: 0 for text, 1 for function calls, 2 for data, etc.
      // We only want to filter and trim text chunks (type 0).
      if (!text.startsWith('0:')) {
        controller.enqueue(encoder.encode(text));
        return;
      }

      // Extract content from protocol format: 0:"content"\n
      let content = '';
      try {
        // Find the start and end of the quoted string
        const firstQuote = text.indexOf('"');
        const lastQuote = text.lastIndexOf('"');
        if (firstQuote !== -1 && lastQuote !== -1 && firstQuote !== lastQuote) {
          content = JSON.parse(text.substring(firstQuote, lastQuote + 1));
        } else if (firstQuote !== -1) {
          // Partial chunk, just take everything after the quote
          content = text.substring(firstQuote + 1);
        }
      } catch (e) {
        // Fallback if parsing fails
        content = text.substring(3).replace(/"\n?$/, '');
      }

      // 1. Handle <think> tags within the text content
      if (inThinkTag) {
        const endIdx = content.indexOf('</think>');
        if (endIdx !== -1) {
          content = content.substring(endIdx + 8);
          inThinkTag = false;
        } else {
          content = '';
        }
      }

      if (!inThinkTag) {
        const startIdx = content.indexOf('<think>');
        if (startIdx !== -1) {
          const endIdx = content.indexOf('</think>', startIdx);
          if (endIdx !== -1) {
            content =
              content.substring(0, startIdx) + content.substring(endIdx + 8);
          } else {
            content = content.substring(0, startIdx);
            inThinkTag = true;
          }
        }
      }

      // 2. Handle leading whitespace from the beginning of the entire stream
      if (isLeadingWhitespace && content) {
        const trimmed = content.trimStart();
        if (trimmed !== content) {
          console.log(
            `[AI Stream] Trimming leading whitespace from content: ${JSON.stringify(content)}`,
          );
        }
        content = trimmed;
        if (content) {
          isLeadingWhitespace = false;
          console.log(
            `[AI Stream] First non-whitespace content identified: ${JSON.stringify(content)}`,
          );
        }
      }

      // Re-wrap the filtered content back into the protocol format
      if (content || !isLeadingWhitespace) {
        // Note: We only skip enqueuing if the chunk was entirely filtered out (e.g. whitespace or think tag)
        // AND we haven't seen any actual content yet.
        controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
      }
    },
  });
}
