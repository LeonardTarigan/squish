export interface JobPayload {
    jobId: string
    inputPath: string
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export const QUEUE_NAME = 'image-jobs'