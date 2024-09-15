import { goalsIndex } from '@/lib/db/pinecone';
import prisma from '@/lib/db/prisma';
import { getEmbedding } from '@/lib/openai';
import {
  createGoalSchema,
  deleteGoalSchema,
  updateGoalSchema,
} from '@/lib/validation/goal';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);

  const page = url.searchParams.get('page');

  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: '😉 userId is required' },
      { status: 400 },
    );
  }

  if (page) {
    const currentPage = parseInt(page);
    const pageSize = 8;
    const heroItemCount = 1;

    const totalItemCount = await prisma.goal.count();
    const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);
    const goals = await prisma.goal.findMany({
      orderBy: { id: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      where: { userId },
    });

    return NextResponse.json({ goals: goals, totalPages });
  } else {
    const allGoals = await prisma.goal.findMany({
      orderBy: { id: 'desc' },
      where: { userId },
    });

    return NextResponse.json({ goals: allGoals });
  }
}

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

    const userId =
      body.userId && body.userId.trim() ? body.userId : auth().userId;

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

    const userId =
      body.userId && body.userId.trim() ? body.userId : auth().userId;

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

    const userId =
      body.userId && body.userId.trim() ? body.userId : auth().userId;

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
