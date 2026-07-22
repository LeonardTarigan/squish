import { logger } from '@squish/logger'
import { Hono } from 'hono'
import requestValidator from '../common/validator/request.validator'
import { fileUploadSchema } from './schema/file-upload.schema'
import uploadService from './upload.service'

export const uploadController = new Hono()

uploadController.post(
    '/',
    requestValidator('form', fileUploadSchema),
    async (c) => {
        try {
            const { image } = c.req.valid('form')

            const jobId = await uploadService.process(image)

            return c.json({
                message: 'Upload successful, processing started',
                jobId
            })
        } catch (error) {
            logger.error({ err: error }, 'Upload failed')

            return c.json({ error: 'Internal server error during upload' }, 500)
        }
    }
)