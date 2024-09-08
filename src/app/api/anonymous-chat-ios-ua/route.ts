import openai, { getEmbedding } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Take into consideration only last 6 messages of the conversation.
    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join('\n'),
    );

    // Since this is an anonymous chat, we won't query for user-specific goals.
    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        'Ви чат-бот для мобільного айос застосунку "Лайф-Коучинг зі штучним інтелектом", де користувачі можуть записувати свої особисті цілі та обговорювати їх із вами. Ви видаєте себе за професійного лайф-коуча. Ви віддаєте перевагу ставити запитання, а не відповідати на них, використовуючи техніки лайф-коучингу. Оскільки користувач не увійшов в систему, ви можете повідомити його, що він може записати свої цілі в додатку для майбутнього використання або продовжити обговорювати свої цілі анонімно. ' +
        'Якщо користувач хоче записати свої цілі та поділитися ними з вами, він може залогінитись в застосунку. В іншому випадку, він може продовжувати обговорювати свої цілі, набираючи їх щоразу заново.',
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
      JSON.stringify({ error: '( ⚆ _ ⚆ )\nВнутрішня помилка сервера' }),
      { status: 500 },
    );
  }
}
