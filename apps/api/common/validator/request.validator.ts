import { zValidator } from "@hono/zod-validator"
import { logger } from "@squish/logger"
import type { ValidationTargets } from "hono"
import type { ZodError, ZodObject } from "zod"

const requestValidator = <
    TTarget extends keyof ValidationTargets,
    TSchema extends ZodObject
>(
    target: TTarget,
    schema: TSchema
) => zValidator(target, schema, (result, c) => {
    if (result.success) return

    const errors: ZodError[] = JSON.parse(result.error.message)
    const errorMessages = errors.map((e) => e.message)
    const mergedErrorMessage = errorMessages.join(', ')

    logger.warn({ err: mergedErrorMessage }, 'Validation failed for file upload')

    return c.json({ error: mergedErrorMessage }, 400)
})

export default requestValidator