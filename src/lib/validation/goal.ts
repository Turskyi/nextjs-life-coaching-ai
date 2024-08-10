import { z } from 'zod';

export const createGoalSchema = z.object({
  title: z.string().min(1, { message: 'Title is required 😬' }),
  content: z.string().optional(),
});

export type CreateGoalSchema = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = createGoalSchema.extend({
  id: z.string().min(1),
});

export const deleteGoalSchema = z.object({
  id: z.string().min(1),
});
