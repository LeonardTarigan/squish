import { logger } from "@squish/logger"
import queueInstance from "../common/instance/queue.instance"

const jobService = {
    checkStatus: async (jobId: string) => {
        const job = await queueInstance.getJob(jobId)
        logger.info(`Request on ${jobId}`)

        if (!job) return null

        const state = await job.getState()

        return {
            jobId: job.id,
            state,
            result: job.returnvalue || null,
            failedReason: job.failedReason || null
        }
    }
}

export default jobService