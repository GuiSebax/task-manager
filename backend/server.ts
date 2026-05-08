import fastify from "fastify";
import { taskRoutes } from "./src/routes/tasks";
import { categoryRoutes } from "./src/routes/categories";

const app = fastify({
    logger: true
});

app.get('/health', async () => {
    return { status: 'ok' }
});

app.register(taskRoutes, { prefix: '/tasks' });
app.register(categoryRoutes, { prefix: '/categories' });

const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Server runnig on http://localhost:3001');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();