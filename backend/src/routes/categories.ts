import type { FastifyInstance } from 'fastify'
import { verifyAuth } from '../middlewares/auth'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'
import prisma from '../lib/prisma'

export async function categoryRoutes(app: FastifyInstance) {

    // GET /categories
    app.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const categories = await prisma.category.findMany({
            where: { userId: request.user.dbId }
        })
        return reply.send(categories)
    })

    app.post('/', { preHandler: verifyAuth }, async (request, reply) => {
        const body = createCategorySchema.parse(request.body)

        const category = await prisma.category.create({
            data: {
                name: body.name,
                color: body.color,
                userId: request.user.dbId,
            }
        })

        return reply.status(201).send(category)
    })

    // PUT /categories/:id
    app.put('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const body = updateCategorySchema.parse(request.body)

        const category = await prisma.category.findFirst({
            where: { id, userId: request.user.dbId }
        })

        if (!category) {
            return reply.status(404).send({ error: 'Category not found' })
        }

        const updated = await prisma.category.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.color && { color: body.color }),
            }
        })

        return reply.send(updated)
    })

    // DELETE /categories/:id
    app.delete('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }

        const category = await prisma.category.findFirst({
            where: { id, userId: request.user.dbId }
        })

        if (!category) {
            return reply.status(404).send({ error: 'Category not found' })
        }

        await prisma.category.delete({ where: { id } })

        return reply.status(204).send()
    })
}