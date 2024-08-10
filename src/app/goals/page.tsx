import Goal from '@/components/Goal';
import prisma from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { APP_NAME } from '../../../constants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Goals`,
};

export default async function GoalsPage() {
  const { userId } = auth();

  if (!userId) throw Error('userId undefined 😞');

  const allGoals = await prisma.goal.findMany({ where: { userId } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allGoals.map((goal) => (
        <Goal goal={goal} key={goal.id} />
      ))}
      {allGoals.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any goals yet. Why don't you create one?"}
        </div>
      )}
    </div>
  );
}
