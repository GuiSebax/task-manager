import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    color: z.string().min(1, 'Color is required')
})

export const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    color: z.string().optional()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>