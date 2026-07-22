import { Hono } from 'hono'
import { mediaController } from './media/media.controller'

export const apiRouter = new Hono()

apiRouter.route('/media', mediaController)