import { generateChatResponse } from '@/lib/ai';
import { getAnonymousChatPrompt } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const messagesTruncated = messages.slice(-6);

    const systemMessage = {
      role: 'system',
      content: getAnonymousChatPrompt('en'),
    };

    return await generateChatResponse([systemMessage, ...messagesTruncated]);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: '( ⚆ _ ⚆ ) Internal server error' }),
      { status: 500 },
    );
  }
}
