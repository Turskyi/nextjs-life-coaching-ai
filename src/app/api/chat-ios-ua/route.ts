import { goalsIndex } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import { generateChatResponse } from '@/lib/ai';
import { getEmbedding } from '@/lib/gemini';
import { getChatPrompt, getNoGoalsContent } from '@/lib/prompts';
import { Message } from 'ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: Message[] = body.messages;

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
      messagesTruncated.map((message: Message) => message.content).join('\n'),
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
      goalsContent = getNoGoalsContent('ua');
    }

    const systemMessage = {
      role: 'system',
      content: getChatPrompt('ua', 'ios', goalsContent),
    };

    return await generateChatResponse([systemMessage, ...messagesTruncated]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: '( ⚆ _ ⚆ ) Внутрішня помилка сервера.' },
      { status: 500 },
    );
  }
}
