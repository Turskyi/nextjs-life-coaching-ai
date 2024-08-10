import { CreateGoalSchema, createGoalSchema } from '@/lib/validation/goal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Goal } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import LoadingButton from './ui/loading-button';
import { Textarea } from './ui/textarea';

interface AddEditGoalDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  goalToEdit?: Goal;
}

export default function AddEditGoalDialog({
  open,
  setOpen,
  goalToEdit: goalToEdit,
}: AddEditGoalDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: goalToEdit?.title || '',
      content: goalToEdit?.content || '',
    },
  });

  async function onSubmit(input: CreateGoalSchema) {
    try {
      if (goalToEdit) {
        const response = await fetch('/api/goals', {
          method: 'PUT',
          body: JSON.stringify({
            id: goalToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error('😲 Status code: ' + response.status);
      } else {
        const response = await fetch('/api/goals', {
          method: 'POST',
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error('😳 Status code: ' + response.status);
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('☹ Something went wrong. Please try again.');
    }
  }

  async function deleteGoal() {
    if (!goalToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'DELETE',
        body: JSON.stringify({
          id: goalToEdit.id,
        }),
      });
      if (!response.ok) throw Error('😬 Status code: ' + response.status);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('😕 Something went wrong. Please try again.');
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goalToEdit ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal title</FormLabel>
                  <FormControl>
                    <Input placeholder="Goal title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Goal content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {goalToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteGoal}
                  type="button"
                >
                  Delete goal
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
