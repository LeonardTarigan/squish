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
            if (state === 'completed' || state === 'failed') return false

            const attempt = Math.max(0, query.state.dataUpdateCount - 1)

            const baseDelay = 1000
            const maxDelay = 10000

            const delay = Math.min(baseDelay * (1.5 ** attempt), maxDelay)

            return delay
        },
    })
}

export default useQueryJobStatus