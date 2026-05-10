import {
  GoogleGenerativeAIStream,
  MistralStream,
  OpenAIStream as GroqStream,
  StreamingTextResponse,
} from 'ai';
import { getGroqChatStream } from './groq';
import { getMistralChatStream } from './mistral';
import { getGeminiChatStream } from './gemini';

export async function generateChatResponse(messages: any[]) {
  try {
    // Primary: Groq
    console.log('Trying Groq...');
    const response = await getGroqChatStream(messages);
    const stream = GroqStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (groqError) {
    console.error('Groq failed:', groqError);
    try {
      // Fallback 1: Mistral
      console.log('Trying Mistral...');
      const response = await getMistralChatStream(messages);
      const stream = MistralStream(response as any);
      return new StreamingTextResponse(stream);
    } catch (mistralError) {
      console.error('Mistral failed:', mistralError);
      try {
        // Fallback 2: Gemini
        console.log('Trying Gemini...');
        const response = await getGeminiChatStream(messages);
        const stream = GoogleGenerativeAIStream(response as any);
        return new StreamingTextResponse(stream);
        return new StreamingTextResponse(stream);
      } catch (geminiError) {
        console.error('Gemini failed:', geminiError);
        return new Response(
          JSON.stringify({
            error: 'All AI providers are currently unavailable. Please try again later. (╯°□°）╯︵ ┻━┻',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }
  }
}
