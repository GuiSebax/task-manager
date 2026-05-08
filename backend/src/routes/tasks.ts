import type { FastifyInstance } from "fastify";
import { verifyAuth } from "../middlewares/auth";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import prisma from "../lib/prisma";

export async function taskRoutes(app: FastifyInstance) {

    // GET /tasks - List all tasks
    app.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const tasks = await prisma.task.findMany({
            where: { userId: request.user.dbId },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        return reply.send(tasks);
    });

    // GET /tasks/:id - Get single task
    app.get('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.dbId },
            include: { category: true }
        });

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        return reply.send(task);
    });

    // POST /tasks - Create task
    app.post('/', { preHandler: verifyAuth }, async (request, reply) => {
        const body = createTaskSchema.parse(request.body)

        const task = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description ?? null,
                priority: body.priority,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                status: 'todo',
                userId: request.user.dbId,
                ...(body.categoryId && { categoryId: body.categoryId }),
            }
        })

        return reply.status(201).send(task)
    })

    // PUT - /tasks/:id - Update task
    app.put('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const body = updateTaskSchema.parse(request.body)

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.dbId }
        })

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' })
        }

        const updated = await prisma.task.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.description && { description: body.description }),
                ...(body.status && { status: body.status }),
                ...(body.priority && { priority: body.priority }),
                ...(body.categoryId && { categoryId: body.categoryId }),
                ...(body.dueDate ? { dueDate: new Date(body.dueDate) } : {}),
            }
        })

        return reply.send(updated)
    })

    app.delete('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.dbId }
        });

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        await prisma.task.delete({ where: { id } });

        return reply.status(204).send();
    });
}