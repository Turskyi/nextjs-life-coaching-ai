import { goalsIndex } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import { getEmbedding } from '@/lib/openai';
import {
  createGoalSchema,
  deleteGoalSchema,
  updateGoalSchema,
} from '@/lib/validation/goal';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createGoalSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json(
        {
          error: 'Invalid input (*′☉.̫☉)',
        },
        { status: 400 },
      );
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized (Θ︹Θ)ს' }, { status: 401 });
    }

    const embedding = await getEmbeddingForGoal(title, content);

    const goal = await prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await goalsIndex.upsert([
        {
          id: goal.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return goal;
    });

    return Response.json({ goal }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Internal server error (ᵒ̤̑ ₀̑ ᵒ̤̑)wow!*✰' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateGoalSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: 'Invalid input (≖ ͜ʖ≖)' }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return Response.json(
        { error: '(☞⌐▀͡ ͜ʖ͡▀ )☞ Goal not found' },
        { status: 404 },
      );
    }

    const { userId } = auth();

    if (!userId || userId !== goal.userId) {
      return Response.json(
        { error: 'Unauthorized ✌.|•͡˘‿•͡˘|.✌' },
        { status: 401 },
      );
    }

    const embedding = await getEmbeddingForGoal(title, content);

    const updatedGoal = await prisma.$transaction(async (tx) => {
      const updatedGoal = await tx.goal.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await goalsIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedGoal;
    });

    return Response.json({ updatedGoal: updatedGoal }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Internal server error ¯_( ͠° ͟ʖ ͠°)_/¯' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteGoalSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json(
        { error: 'Invalid input ┐(ﾟ ～ﾟ )┌' },
        { status: 400 },
      );
    }

    const { id } = parseResult.data;

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return Response.json({ error: 'Goal not found 🤷‍♂️' }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== goal.userId) {
      return Response.json(
        { error: '¯_( ͡~ ͜ʖ ͡°)_/¯ Unauthorized' },
        { status: 401 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.goal.delete({ where: { id } });
      await goalsIndex.deleteOne(id);
    });

    return Response.json({ message: 'Goal deleted ᇂ_ᇂ' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Internal server error 😭' },
      { status: 500 },
    );
  }
}

async function getEmbeddingForGoal(title: string, content: string | undefined) {
  return getEmbedding(title + '\n\n' + content ?? '');
}
