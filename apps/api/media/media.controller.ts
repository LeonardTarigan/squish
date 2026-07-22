import { logger } from '@squish/logger'
import { Hono } from 'hono'
import requestValidator from '../common/validator/request.validator'
import { fileUploadSchema } from '../media/schema/file-upload.schema'
import mediaService from './media.service'

export const mediaController = new Hono()

mediaController.post(
    '/upload',
    requestValidator('form', fileUploadSchema),
    async (c) => {
        try {
            const { image } = c.req.valid('form')

            const jobId = await mediaService.uploadImageFile(image)

            return c.json({
                message: 'Upload successful, processing started',
                data: { jobId }
            })
        } catch (error) {
            logger.error({ err: error }, 'Upload failed')

            return c.json({ error: 'Internal server error during upload' }, 500)
        }
    }
)