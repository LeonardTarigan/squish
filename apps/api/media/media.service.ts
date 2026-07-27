import { logger } from "@squish/logger"
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import queueInstance from "../common/instance/queue.instance"

const mediaService = {
    uploadImageFile: async (file: File): Promise<string> => {
        const jobId = randomUUID()
        const jobName = 'compress-image'

        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${jobId}.${extension}`
        const inputPath = path.join(process.cwd(), '../../uploads/raw', filename)

        await Bun.write(inputPath, file)
        logger.info({ jobId, inputPath }, 'File saved successfully')

        await queueInstance.add(
            jobName,
            { jobId, inputPath },
            {
                jobId,
                removeOnComplete: {
                    age: 3600,
                    count: 100
                },
                removeOnFail: {
                    age: 24 * 3600
                }
            }
        )
        logger.info({ jobId }, 'Job dispatched to queue')

        return jobId
    },
    getProcessedImage: async (jobId: string) => {
        const filePath = path.join(process.cwd(), '../../uploads/processed', `${jobId}.webp`);
        const file = Bun.file(filePath);

        return (await file.exists()) ? file : null;
    }
}

export default mediaService