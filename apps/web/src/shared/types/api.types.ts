import type { JobStatus } from '@squish/types'


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