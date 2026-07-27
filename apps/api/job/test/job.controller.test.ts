import { describe, expect, it, spyOn, beforeEach } from 'bun:test'
import { logger } from '@squish/logger'
import { jobController } from '../job.controller'
import jobService from '../job.service'

spyOn(logger, 'error').mockImplementation(() => { })

describe('Job Controller API', () => {
    beforeEach(() => {
        spyOn(jobService, 'checkStatus').mockClear()
    })

    describe('GET /:id', () => {
        it('should return 200 and the job status', async () => {
            const mockJobId = '550e8400-e29b-41d4-a716-446655440000'
            const mockStatus = {
                jobId: mockJobId,
                state: 'completed' as const,
                result: { outputPath: '/path/to/file' },
                failedReason: null,
            }

            spyOn(jobService, 'checkStatus').mockResolvedValue(mockStatus)

            const req = new Request(`http://localhost/${mockJobId}`, {
                method: 'GET',
            })

            const res = await jobController.request(req)
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json).toEqual({ data: mockStatus })
            expect(jobService.checkStatus).toHaveBeenCalledWith(mockJobId)
        })

        it('should return 400 if the job ID is an invalid UUID', async () => {
            const req = new Request('http://localhost/not-a-valid-uuid', {
                method: 'GET',
            })

            const res = await jobController.request(req)
            const json = await res.json()

            expect(res.status).toBe(400)
            expect(json).toEqual({ error: 'Invalid UUID' })
            expect(jobService.checkStatus).not.toHaveBeenCalled()
        })

        it('should return 404 if the job does not exist in Redis', async () => {
            const mockJobId = '550e8400-e29b-41d4-a716-446655440000'
            spyOn(jobService, 'checkStatus').mockResolvedValue(null)

            const req = new Request(`http://localhost/${mockJobId}`, {
                method: 'GET',
            })

            const res = await jobController.request(req)
            const json = await res.json()

            expect(res.status).toBe(404)
            expect(json).toEqual({ error: 'Job not found' })
        })

        it('should return 500 if the queue connection crashes', async () => {
            const mockJobId = '550e8400-e29b-41d4-a716-446655440000'
            spyOn(jobService, 'checkStatus').mockRejectedValue(new Error('Redis disconnected'))

            const req = new Request(`http://localhost/${mockJobId}`, {
                method: 'GET',
            })

            const res = await jobController.request(req)
            const json = await res.json()

            expect(res.status).toBe(500)
            expect(json).toEqual({ error: 'Internal server error while fetching status' })
            expect(logger.error).toHaveBeenCalled()
        })
    })
})