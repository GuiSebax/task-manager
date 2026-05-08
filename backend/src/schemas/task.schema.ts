import { z } from 'zod';

/*
z.string().min(1) - must be a string with at least 1 character
z.enum([...]) - must be one of those exact values
.optional() - field is not required
z.infer<typeof schema> - this is the magic! It automatically generates
the Typescript type from the Zod schema, so you don't write types twice
*/

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    dueDate: z.string().optional(),
    categoryId: z.string().uuid().optional()
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().optional(),
    categoryId: z.string().uuid().optional()
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type updateTaskInput = z.infer<typeof updateTaskSchema>;