import { logger } from "@squish/logger"
import queueInstance from "../common/instance/queue.instance"
import type { GetJobStatusResponse, JobStatus } from "@squish/types"

const jobService = {
    checkStatus: async (jobId: string): Promise<GetJobStatusResponse | null> => {
        const job = await queueInstance.getJob(jobId)
        logger.info(`Request on ${jobId}`)

        if (!job) return null

        const state = await job.getState() as JobStatus

        return {
            jobId: job.id!,
            state,
            result: job.returnvalue || null,
            failedReason: job.failedReason || null
        }
    }
}

export default jobService