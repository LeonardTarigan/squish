import { useState, useEffect, useRef } from 'react'
import type { FileWithPath } from '@mantine/dropzone'
import { gooeyToast } from 'goey-toast'
import useMutateUpload from './useMutateUpload'
import useQueryJobStatus from './useQueryJobStatus'
import useMutateDownload from './useMutateDownload'

export const useCompressor = () => {
  const [file, setFile] = useState<FileWithPath | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const resolveRef = useRef<(() => void) | null>(null)
  const rejectRef = useRef<((reason?: string) => void) | null>(null)

  const downloadMutation = useMutateDownload()

  const uploadMutation = useMutateUpload((id) => setJobId(id))

  const { data: jobStatus, error: jobError } = useQueryJobStatus(jobId)

  const cleanupRefs = () => {
    resolveRef.current = null
    rejectRef.current = null
  }

  useEffect(() => {
    if (jobStatus?.state === 'completed') {
      resolveRef.current?.()
      cleanupRefs()
    } else if (jobStatus?.state === 'failed' || jobError) {
      rejectRef.current?.(jobStatus?.failedReason || jobError?.message)
      cleanupRefs()
    }
  }, [jobStatus?.state, jobError])

  const handleDrop = (files: FileWithPath[]) => {
    const selectedFile = files[0]
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setJobId(null)
    uploadMutation.reset()
  }

  const clearFile = () => {
    setFile(null)
    setJobId(null)
    uploadMutation.reset()
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleDownload = () => {
    if (!jobId) return
    downloadMutation.mutate(jobId)
  }

  const compressImage = () => {
    if (!file) return

    const compressionFlow = new Promise<void>((resolve, reject) => {
      resolveRef.current = resolve
      rejectRef.current = reject
    })

    gooeyToast.promise(compressionFlow, {
      loading: 'Uploading and compressing...',
      success: 'Compression complete!',
      error: 'Compression failed',
    })

    uploadMutation.mutate(file, {
      onError: (error) => {
        rejectRef.current?.(error.message)
        cleanupRefs()
      }
    })
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const isCompleted = jobStatus?.state === 'completed'
  const isFailed = jobStatus?.state === 'failed' || !!jobError
  const isCompressing = uploadMutation.isPending
  const errorMessage = jobStatus?.failedReason

  return {
    file,
    previewUrl,
    isCompressing,
    isCompleted,
    isDownloading: downloadMutation.isPending,
    isFailed,
    errorMessage,
    handleDrop,
    clearFile,
    handleDownload,
    compressImage,
    jobStatus: jobStatus?.state,
    jobId: jobStatus?.jobId
  }
}