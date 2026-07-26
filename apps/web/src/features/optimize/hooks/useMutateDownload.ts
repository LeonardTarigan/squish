import { downloadImage } from "#/shared/api/endpoints/media.api"
import { useMutation } from "@tanstack/react-query"

const useMutateDownload = () => {
    return useMutation({
        mutationFn: downloadImage,
        onSuccess: (blob, jobId) => {
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `squished-${jobId}.webp`)

            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)

            window.URL.revokeObjectURL(url)
        },
    })
}

export default useMutateDownload