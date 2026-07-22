import { z } from 'zod'

const getJobSchema = z.object({
    id: z.uuid(),
})

export default getJobSchema