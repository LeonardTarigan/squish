import type { ApiResponse, GetJobStatusResponse } from "#/shared/types/api.types"
import api from "../client"

export const getJobStatus = async (jobId: string) => {
    const { data: response } = await api.get<ApiResponse<GetJobStatusResponse>>(`/jobs/${jobId}`)

    if (response.error) {
        throw new Error(response.error)
    }

    return response.data
}