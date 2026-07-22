import { logger } from "@squish/logger"
import { queueService } from "../common/queue.service"
import { randomUUID } from 'node:crypto'
import path from 'node:path'

const uploadService = {
    process: async (file: File): Promise<string> => {
        if (file.size > 20971520) {
            throw new Error('File exceeds the 20MB limit')
        }

        const jobId = randomUUID()
        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${jobId}.${extension}`

        const inputPath = path.join(process.cwd(), '../../uploads/raw', filename)

        await Bun.write(inputPath, file)
        logger.info({ jobId, inputPath }, 'File saved to disk successfully')

        await queueService.add('compress-image', { jobId, inputPath })
        logger.info({ jobId }, 'Job dispatched to BullMQ')

        return jobId
    }
}

export default uploadService