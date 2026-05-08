import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { taskRoutes } from './src/routes/tasks'
import { categoryRoutes } from './src/routes/categories'

const app = Fastify({ logger: true })

await app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})

app.get('/health', async () => {
    return { status: 'ok' }
})

app.register(taskRoutes, { prefix: '/tasks' })
app.register(categoryRoutes, { prefix: '/categories' })

const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' })
        console.log('Server running on http://localhost:3001')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()