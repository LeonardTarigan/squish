export interface JobPayload {
    jobId: string
    inputPath: string
}

export type JobStatus = 'active' | 'waiting' | 'delayed' | 'completed' | 'failed'

export const QUEUE_NAME = 'image-jobs'

export const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
]

export type ApiResponse<T> =
    | { data: T; error?: never }
    | { error: string; data?: never }

export interface UploadResponse {
    jobId: string
}

export interface GetJobStatusResponse {
    jobId: string
    state: JobStatus
    result: { outputPath: string },
    failedReason: null | string
}