import { Hono } from 'hono';
import { logger } from '@squish/logger';
import uploadService from './upload.service';

export const uploadController = new Hono();

uploadController.post('/', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['image'];

        if (!file || !(file instanceof File)) {
            logger.warn('Upload attempt with missing or invalid file');
            return c.json({ error: 'An image file is required' }, 400);
        }

        const jobId = await uploadService.process(file);

        return c.json({
            message: 'Upload successful, processing started',
            jobId
        });

    } catch (error) {
        logger.error({ err: error }, 'Upload route failed');

        if (error instanceof Error && error.message.includes('20MB')) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ error: 'Internal server error during upload' }, 500);
    }
});