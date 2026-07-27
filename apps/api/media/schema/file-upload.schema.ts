import { z } from 'zod'
import { MAX_UPLOAD_FILE_SIZE } from '../../common/constants/media.constant'
import { ACCEPTED_IMAGE_TYPES } from '@squish/types'

export const fileUploadSchema = z.object({
    image: z
        .instanceof(File, { message: 'An image file is required' })
        .refine((file) => file.size <= MAX_UPLOAD_FILE_SIZE, {
            message: 'File exceeds the 20MB limit',
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: 'Invalid file type. Only JPG, PNG, and WebP are supported',
        })
})