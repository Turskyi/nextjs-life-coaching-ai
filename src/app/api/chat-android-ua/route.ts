import { goalsIndex } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import openai, { getEmbedding } from '@/lib/openai';
import { auth } from '@clerk/nextjs/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: ChatCompletionMessage[] = body.messages;

    // Extract the userId from the request body.
    const userId: string = body.userId;

    if (!userId) {
      return new Response('(｡•̀ᴗ-)✧ Неавторизовано: відсутній userId.', {
        status: 401,
      });
    }

    // Take into consideration only last 6 messages of the conversation.
    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join('\n'),
    );

    const vectorQueryResponse = await goalsIndex.query({
      vector: embedding,
      // How many goals to return.
      topK: 4,
      filter: { userId },
    });

    const relevantGoals = await prisma.goal.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    let goalsContent = relevantGoals
      .map((goal) => {
        let goalText = `Заголовок: ${goal.title}`;
        if (goal.content) {
          goalText += `\n\nЗміст:\n${goal.content}`;
        }
        return goalText;
      })
      .join('\n\n');

    if (!goalsContent) {
      goalsContent =
        'Цілей не знайдено. Допоможіть користувачеві визначити ціль за методом S.M.A.R.T. (Конкретна (Specific), Вимірювана (Measurable), Досяжна (Achievable), Актуальна (Relevant), Обмежена в часі (Time-bound)) та навчіть його, як її встановити.';
    }

    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        'Ви – чат-бот для мобільного Андроїд застосунку "Лайф-Коучинг зі штучним інтелектом", де користувач може записувати свої особисті цілі та спілкуватися з вами про них. Ви граєте роль професійного лайф-коуча. Ви віддаєте перевагу задавати питання, а не давати відповіді, використовуючи техніки лайф-коучингу. Якщо у користувача немає цілей, ви допомагаєте йому визначити одну. Якщо у користувача є цілі, ви відповідаєте на запити користувача на основі його існуючих цілей. ' +
        'Відповідні цілі для цього запиту:\n' +
        goalsContent,
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
    return Response.json(
      { error: '( ⚆ _ ⚆ ) Внутрішня помилка сервера.' },
      { status: 500 },
    );
  }
}
