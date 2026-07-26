import { downloadImage } from "#/shared/api/endpoints/media.api"
import { useMutation } from "@tanstack/react-query"

const useMutateDownload = () => {
    return useMutation({
        mutationFn: downloadImage,
        onSuccess: (blob, jobId) => {
            // 1. Create a local URL for the blob data
            const url = window.URL.createObjectURL(blob)

            // 2. Create an invisible anchor tag
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `squished-${jobId}.webp`)

            // 3. Append to body, click it, and remove it
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)

            // 4. Clean up the memory
            window.URL.revokeObjectURL(url)
        },
    })
}

export default useMutateDownload