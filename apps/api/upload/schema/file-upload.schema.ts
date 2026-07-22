import { z } from 'zod'

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024

export const fileUploadSchema = z.object({
    image: z
        .instanceof(File, { message: 'An image file is required' })
        .refine((file) => file.size <= MAX_UPLOAD_SIZE, {
            message: 'File exceeds the 20MB limit',
        }),
})