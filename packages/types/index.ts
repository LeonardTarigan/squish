export interface JobPayload {
    jobId: string
    inputPath: string
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export const QUEUE_NAME = 'image-jobs'

export interface ApiResponse<T> {
    message?: string
    data: T
    error?: string | null
}

export interface UploadResponse {
    jobId: string
}

export interface GetJobStatusResponse {
    jobId: string
    state: JobStatus
    result: { outputPath: string },
    failedReason: null | string
}