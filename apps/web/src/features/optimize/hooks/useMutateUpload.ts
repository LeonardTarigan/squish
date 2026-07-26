import { uploadImage } from "#/shared/api/endpoints/media.api"
import { useMutation } from "@tanstack/react-query"

const useMutateUpload = (onSuccess: (jobId: string) => void) => {
    return useMutation({
        mutationFn: uploadImage,
        onSuccess: (data) => onSuccess(data.jobId),
    })
}

export default useMutateUpload