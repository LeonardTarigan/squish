import { Hono } from "hono"
import requestValidator from "../common/validator/request.validator"
import getJobSchema from "./schema/get-job.schema"
import jobService from "./job.service"
import { logger } from "@squish/logger"
import type { ApiResponse, GetJobStatusResponse } from "@squish/types"

export const jobController = new Hono()

jobController.get(
    ':id',
    requestValidator('param', getJobSchema),
    async (c) => {
        try {
            const { id } = c.req.valid('param')

            const status = await jobService.checkStatus(id)

            if (!status) return c.json({ error: 'Job not found' }, 404)

            return c.json<ApiResponse<GetJobStatusResponse>>({ data: status })
        } catch (error) {
            logger.error({ err: error }, 'Failed to fetch job status')

            return c.json<ApiResponse<GetJobStatusResponse>>({ error: 'Internal server error while fetching status' }, 500)
        }
    }
)