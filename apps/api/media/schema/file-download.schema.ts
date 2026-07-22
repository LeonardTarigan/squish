import { z } from 'zod'

const fileDownloadSchema = z.object({
    fileId: z.uuid()
})

export default fileDownloadSchema