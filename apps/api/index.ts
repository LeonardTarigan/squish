import { logger } from '@squish/logger'
import { Hono } from 'hono'
import { pinoLogger } from 'hono-pino'
import { apiRouter } from './routes'
import { cors } from 'hono/cors'

const app = new Hono()

const rawOrigins = process.env.ALLOWED_ORIGINS;
if (!rawOrigins) {
    throw new Error('Environment variable ALLOWED_ORIGINS is missing');
}

const allowedOrigins = rawOrigins.split(',')

app.use('*', pinoLogger({ pino: logger }))
app.use('*', cors({
    origin: (origin) => allowedOrigins.includes(origin) ? origin : null,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
}))

app.get('/health', (c) => {
    return c.json({ status: 'ok', service: 'squish-api' })
})

app.route('/api', apiRouter)

export default {
    port: 3000,
    fetch: app.fetch,
}