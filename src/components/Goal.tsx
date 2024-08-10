'use client';

import { Goal as GoalModel } from '@prisma/client';
import { useState } from 'react';
import AddEditGoalDialog from './AddEditGoalDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface GoalProps {
  goal: GoalModel;
}

export default function Goal({ goal }: GoalProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = goal.updatedAt > goal.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? goal.updatedAt : goal.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{goal.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && ' (updated)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{goal.content}</p>
        </CardContent>
      </Card>
      <AddEditGoalDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        goalToEdit={goal}
      />
    </>
  );
}
