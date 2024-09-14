import { goalsIndex } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import openai, { getEmbedding } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionMessage } from 'openai/resources/index.mjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: ChatCompletionMessage[] = body.messages;

    // Extract the userId from the request body.
    const userId: string = body.userId;

    if (!userId || userId.trim() === '') {
      return new Response('(｡•̀ᴗ-)✧ Unauthorized: userId is missing', {
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
        let goalText = `Title: ${goal.title}`;
        if (goal.content) {
          goalText += `\n\nContent:\n${goal.content}`;
        }
        return goalText;
      })
      .join('\n\n');

    if (!goalsContent) {
      goalsContent =
        'No relevant goals found. Help the user define a S.M.A.R.T. goal (Specific, Measurable, Achievable, Relevant, Time-bound) and teach them how to set it.';
    }

    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        "You are a chatbot for an  website https://lifecoach.turskyi.com where user can record their personal goals and chat with you about them. You impersonate a professional Life-Coach. You prefer ask questions rather than answer them, using life-coaching techniques. If user does not have goals you help him define one, if user has goals you respond to the user's request based on their existing goals. " +
        'The relevant goals for this query are:\n' +
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
      { error: '( ⚆ _ ⚆ ) Internal server error' },
      { status: 500 },
    );
  }
}
