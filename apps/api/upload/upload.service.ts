import { logger } from "@squish/logger"
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import queueInstance from "../common/instance/queue.instance"

const uploadService = {
    process: async (file: File): Promise<string> => {
        const jobId = randomUUID()
        const jobName = 'compress-image'

        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${jobId}.${extension}`
        const inputPath = path.join(process.cwd(), '../../uploads/raw', filename)

        await Bun.write(inputPath, file)
        logger.info({ jobId, inputPath }, 'File saved successfully')

        await queueInstance.add(jobName, { jobId, inputPath })
        logger.info({ jobId }, 'Job dispatched to queue')

        return jobId
    }
}

export default uploadService