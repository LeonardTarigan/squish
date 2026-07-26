import type { FileWithPath } from '@mantine/dropzone'
import api from '../client'
import type { ApiResponse, UploadResponse, } from '#/shared/types/api.types'

export const uploadImage = async (file: FileWithPath) => {
    const formData = new FormData()
    formData.append('image', file)

    const { data: response } = await api.post<ApiResponse<UploadResponse>>(
        '/media/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}

export const downloadImage = async (jobId: string) => {
    const response = await api.get(`/media/download/${jobId}`, {
        responseType: 'blob',
    })

    return response.data
}