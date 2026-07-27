import { Queue } from 'bullmq'
import { QUEUE_NAME, type JobPayload } from '@squish/types'

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined

const queueInstance = new Queue<JobPayload>(QUEUE_NAME, {
    connection: { host, port },
})

export default queueInstance