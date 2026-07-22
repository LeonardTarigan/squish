import { Hono } from 'hono'
import { uploadController } from './upload/upload.controller'

export const apiRouter = new Hono()

apiRouter.route('/upload', uploadController)