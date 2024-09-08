import openai from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Take into consideration only last 6 messages of the conversation.
    const messagesTruncated = messages.slice(-6);

    // Since this is an anonymous chat, we won't query for user-specific goals.
    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        'You are a chatbot for an Android app "Life-Coaching AI" ' +
        'where users can record their personal goals and chat with you about them. You impersonate a professional Life-Coach. You prefer to ask questions rather than answer them, using life-coaching techniques. Since the user is not logged in, you can inform them that they can record their goals in the app for future reference or continue discussing their goals anonymously. ' +
        'If the user wants to record their goals and share them with you, they can log in to the app. Otherwise, they can continue to discuss their goals by typing them each time.',
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: '( ⚆ _ ⚆ ) Internal server error' }),
      { status: 500 },
    );
  }
}
