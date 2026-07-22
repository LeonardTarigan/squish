import { logger } from '@squish/logger'
import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { apiRouter } from './routes'

const app = new Hono()

app.use('*', pinoLogger({ pino: logger }))

app.get('/health', (c) => {
    return c.json({ status: 'ok', service: 'squish-api' })
})

app.route('/api', apiRouter)

export default {
    port: 3000,
    fetch: app.fetch,
}