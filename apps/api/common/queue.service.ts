import { Queue } from 'bullmq'
import { QUEUE_NAME, type JobPayload } from '@squish/types'

const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined

if (!redisHost) {
    throw new Error('Environment variable REDIS_HOST is missing or empty.')
}

if (!redisPort || Number.isNaN(redisPort)) {
    throw new Error('Environment variable REDIS_PORT is missing or invalid.')
}

export const queueService = new Queue<JobPayload>(QUEUE_NAME, {
    connection: { host: 'localhost', port: 6379 },
})