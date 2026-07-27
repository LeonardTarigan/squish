import { describe, expect, it, spyOn, beforeEach } from 'bun:test'
import { logger } from '@squish/logger'
import { mediaController } from '../media.controller'
import mediaService from '../media.service'
import type { BunFile } from 'bun'

spyOn(logger, 'error').mockImplementation(() => { })

describe('Media Controller API', () => {
    beforeEach(() => {
        spyOn(mediaService, 'uploadImageFile').mockClear()
        spyOn(mediaService, 'getProcessedImage').mockClear()
    })

    describe('POST /upload', () => {
        it('should return 200 and a jobId on successful upload (Happy Path)', async () => {
            const mockJobId = 'test-job-123'
            spyOn(mediaService, 'uploadImageFile').mockResolvedValue(mockJobId)

            const formData = new FormData()
            const fakeImage = new File(['fake-image-bytes'], 'test.png', { type: 'image/png' })
            formData.append('image', fakeImage)

            const req = new Request('http://localhost/upload', {
                method: 'POST',
                body: formData,
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json).toEqual({ data: { jobId: mockJobId } })
            expect(mediaService.uploadImageFile).toHaveBeenCalledTimes(1)
        })

        it('should return 400 if the image field is missing', async () => {
            const formData = new FormData()

            const req = new Request('http://localhost/upload', {
                method: 'POST',
                body: formData,
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(400)
            expect(json).toEqual({ error: 'An image file is required' })
            expect(mediaService.uploadImageFile).not.toHaveBeenCalled()
        })

        it('should return 400 if the uploaded file is not an image', async () => {
            const formData = new FormData()
            const fakeTextFile = new File(['just some text data'], 'document.txt', {
                type: 'text/plain'
            })
            formData.append('image', fakeTextFile)

            const req = new Request('http://localhost/upload', {
                method: 'POST',
                body: formData,
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(400)
            expect(json).toEqual({ error: 'Invalid file type. Only JPG, PNG, and WebP are supported' })
            expect(mediaService.uploadImageFile).not.toHaveBeenCalled()
        })

        it('should return 500 if the service layer throws an error', async () => {
            spyOn(mediaService, 'uploadImageFile').mockRejectedValue(new Error('Redis connection lost'))

            const formData = new FormData()
            const fakeImage = new File(['fake-image-bytes'], 'test.png', { type: 'image/png' })
            formData.append('image', fakeImage)

            const req = new Request('http://localhost/upload', {
                method: 'POST',
                body: formData,
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(500)
            expect(json).toEqual({ error: 'Internal server error during upload' })
            expect(logger.error).toHaveBeenCalled()
        })
    })

    describe('GET /download/:fileId', () => {
        it('should return 200 and stream the file with correct headers', async () => {
            const mockFileId = 'a98b1014-3fc4-434f-8f48-83744f777f37'
            const mockWebpBytes = new Uint8Array([1, 2, 3])
            const mockFile = new File([mockWebpBytes], 'test.webp', { type: 'image/webp' }) as BunFile

            spyOn(mediaService, 'getProcessedImage').mockResolvedValue(mockFile)

            const req = new Request(`http://localhost/download/${mockFileId}`, {
                method: 'GET',
            })

            const res = await mediaController.request(req)

            expect(res.status).toBe(200)
            expect(res.headers.get('Content-Type')).toBe('image/webp')
            expect(res.headers.get('Content-Disposition')).toBe(`attachment; filename="${mockFileId}.webp"`)
            expect(mediaService.getProcessedImage).toHaveBeenCalledWith(mockFileId)
        })

        it('should return 404 if the requested file does not exist', async () => {
            const mockFileId = 'a98b1014-3fc4-434f-8f48-83744f777f37'
            spyOn(mediaService, 'getProcessedImage').mockResolvedValue(null)

            const req = new Request(`http://localhost/download/${mockFileId}`, {
                method: 'GET',
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(404)
            expect(json).toEqual({ error: 'File not found' })
            expect(mediaService.getProcessedImage).toHaveBeenCalledWith(mockFileId)
        })

        it('should return 400 if the fileId is not a valid UUID', async () => {
            const invalidFileId = 'invalid-uuid'

            const req = new Request(`http://localhost/download/${invalidFileId}`, {
                method: 'GET',
            })

            const res = await mediaController.request(req)
            const json = await res.json()

            expect(res.status).toBe(400)
            expect(json).toEqual({ error: 'Invalid UUID' })
            expect(mediaService.getProcessedImage).not.toHaveBeenCalled()
        })
    })
})