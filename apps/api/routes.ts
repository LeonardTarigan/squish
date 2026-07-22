import { Hono } from 'hono'
import { mediaController } from './media/media.controller'
import { jobController } from './job/job.controller'

export const apiRouter = new Hono()

apiRouter.route('/media', mediaController)
apiRouter.route('/jobs', jobController)