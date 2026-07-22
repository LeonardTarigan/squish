import { Worker } from 'bullmq';
import { logger } from '@squish/logger';
import { QUEUE_NAME, type JobPayload } from '@squish/types';
import compressImage from './src/compress-image';

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined

const worker = new Worker<JobPayload>(
    QUEUE_NAME,
    async (job) => {
        logger.info({ jobId: job.data.jobId }, `Picked up job from ${QUEUE_NAME} queue`);

        const outputPath = await compressImage(job.data.jobId, job.data.inputPath);

        return { outputPath };
    },
    { connection: { host, port } }
);

worker.on('completed', (job, returnvalue) => {
    logger.info({ jobId: job.id, result: returnvalue }, 'Job completed successfully');
});

worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Job failed');
});

logger.info(`Worker listening on queue: ${QUEUE_NAME}`);