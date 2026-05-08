import type { FastifyRequest, FastifyReply } from 'fastify'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || ''
})

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization?.split(' ')[1]

        if (!token) {
            return reply.status(401).send({ error: 'Unauthorized - No token provided' })
        }

        const requestState = await clerk.authenticateRequest(request as any, {
            jwtKey: process.env.CLERK_JWT_KEY || '',
            secretKey: process.env.CLERK_SECRET_KEY || ''
        })

        if (!requestState.isSignedIn) {
            return reply.status(401).send({ error: 'Unauthorized - Invalid token' })
        }

        request.user = {
            clerkId: requestState.toAuth().userId!
        }

    } catch (err) {
        return reply.status(401).send({ error: 'Unauthorized - Invalid token' })
    }
}