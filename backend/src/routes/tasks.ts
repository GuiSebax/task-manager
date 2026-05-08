import type { FastifyInstance } from "fastify";
import { verifyAuth } from "../middlewares/auth";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import prisma from "../lib/prisma";

export async function taskRoutes(app: FastifyInstance) {

    // GET /tasks - List all tasks
    app.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const tasks = await prisma.task.findMany({
            where: { userId: request.user.clerkId },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        return reply.send(tasks);
    });

    // GET /tasks/:id - Get single task
    app.get('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.clerkId },
            include: { category: true }
        });

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        return reply.send(task);
    });

    // POST /tasks - Create task
    app.post('/', { preHandler: verifyAuth }, async (request, reply) => {
        const body = createTaskSchema.parse(request.body);

        const task = await prisma.task.create({
            data: {
                ...body,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                userId: request.user.clerkId,
            }
        });

        return reply.status(201).send(task);
    });

    // PUT - /tasks/:id - Update task
    app.put('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = updateTaskSchema.parse(request.body);

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.clerkId },
        });

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        const updated = await prisma.task.update({
            where: { id },
            data: {
                ...body,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            }
        });

        return reply.send(updated);
    });

    app.delete('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const task = await prisma.task.findFirst({
            where: { id, userId: request.user.clerkId }
        });

        if (!task) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        await prisma.task.delete({ where: { id } });

        return reply.status(204).send();
    });
}