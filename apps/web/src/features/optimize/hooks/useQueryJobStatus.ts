import { getJobStatus } from "#/shared/api/endpoints/job.api"
import { useQuery } from "@tanstack/react-query"

const useQueryJobStatus = (jobId: string | null) => {
    return useQuery({
        queryKey: ['job', jobId],
        queryFn: () => getJobStatus(jobId!),
        enabled: !!jobId,
        refetchInterval: (query) => {
            if (query.state.error) return false

            const state = query.state.data?.state
            return state === 'completed' || state === 'failed' ? false : 1000
        },
    })
}

export default useQueryJobStatus