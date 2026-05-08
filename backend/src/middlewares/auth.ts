import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization?.split(' ')[1]

        if (!token) {
            return reply.status(401).send({ error: 'Unauthorized - No token provided' })
        }

        const decoded = jwt.decode(token) as {
            sub: string
            email_address?: string
            first_name?: string
        } | null

        if (!decoded || !decoded.sub) {
            return reply.status(401).send({ error: 'Unauthorized - Invalid token' })
        }

        // Create user in DB if they don't exist yet
        const user = await prisma.user.upsert({
            where: { clerkId: decoded.sub },
            update: {},
            create: {
                clerkId: decoded.sub,
                email: decoded.email_address ?? 'no-email@placeholder.com',
                name: decoded.first_name ?? 'User'
            }
        })

        request.user = {
            clerkId: decoded.sub,
            dbId: user.id
        }

    } catch (err) {
        console.error('Auth error:', err)
        return reply.status(401).send({ error: 'Unauthorized - Invalid token' })
    }
}