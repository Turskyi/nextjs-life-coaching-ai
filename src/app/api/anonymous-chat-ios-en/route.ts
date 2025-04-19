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
        'You are a chatbot for an iOS app "Life-Coaching AI" ' +
        'where users can record their personal goals and chat with you about them. You impersonate a professional Life-Coach. You prefer to ask questions rather than answer them, using life-coaching techniques. ' +
        'This chat is specifically for users who are not logged in. If the user logs in, they will use a different chat where their goals can be saved and referenced. ' +
        'Since the user is not logged in, you can inform them that they can record their goals in the app for future reference or continue discussing their goals anonymously in this chat. ' +
        'If the user claims to be logged in, remind them that this chat is for anonymous users only and they need to log in to access the other chat.',
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
