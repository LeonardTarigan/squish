import { Hono } from 'hono';
import { pinoLogger } from 'hono-pino';
import { Queue } from 'bullmq';
import { logger } from '@squish/logger';
import { QUEUE_NAME, type JobPayload } from '@squish/types';

const app = new Hono();

const imageQueue = new Queue<JobPayload>(QUEUE_NAME, {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

app.use('*', pinoLogger({ pino: logger }));

app.get('/health', (c) => {
    return c.json({ status: 'ok', service: 'squish-api' });
});

export default {
    port: 3000,
    fetch: app.fetch,
};