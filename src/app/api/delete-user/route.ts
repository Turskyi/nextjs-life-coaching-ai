import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { goalsIndex } from '@/lib/db/pinecone';

export async function DELETE(req: Request) {
  const body = await req.json();
  const userId =
    body.userId && body.userId.trim() ? body.userId : auth().userId;

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required 😈' },
      { status: 400 },
    );
  }

  try {
    // Step 1: Fetch all goals associated with the user.
    const goals = await prisma.goal.findMany({
      where: { userId },
    });

    // Step 2: Delete all goals from the database
    await prisma.$transaction(async (tx) => {
      // Delete all goals in Prisma.
      await tx.goal.deleteMany({
        where: { userId },
      });

      // Delete embeddings from Pinecone.
      const goalIds = goals.map((goal) => goal.id.toString());
      if (goalIds.length > 0) {
        // Use deleteMany to delete multiple records by ID.
        await goalsIndex.deleteMany(goalIds);
      }
    });

    // Step 3: Delete the user
    await clerkClient.users.deleteUser(userId);
    return NextResponse.json({ message: 'User deleted 😎' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error deleting user 😢' });
  }
}
