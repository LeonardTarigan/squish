import { useCompressor } from '#/features/optimize/hooks/useCompressor'
import BrandLogo from '#/shared/components/logo/BrandLogo'
import { MAX_UPLOAD_FILE_SIZE } from '#/shared/constants/upload.constant'
import {
  Flex,
  Group,
  Text,
  Title,
  Button,
  Image,
  Stack,
  Paper,
  ActionIcon,
  Box,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import type { FileRejection } from '@mantine/dropzone'
import {
  ImageIcon,
  UploadSimpleIcon,
  XIcon,
  DownloadSimpleIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { gooeyToast } from 'goey-toast'

function OptimizePage() {
  const {
    file,
    previewUrl,
    isCompressing,
    isCompleted,
    isFailed,
    errorMessage,
    handleDrop,
    clearFile,
    handleDownload,
    compressImage,
  } = useCompressor()

  const handleReject = (fileRejections: FileRejection[]) => {
    const error = fileRejections[0]?.errors[0]

    if (error.code === 'file-too-large') {
      gooeyToast.error('File is too large', {
        description: 'Maximum size is 20MB',
      })
    } else if (error.code === 'file-invalid-type') {
      gooeyToast.error('Invalid file format', {
        description: 'Please upload an image',
      })
    } else {
      gooeyToast.error(error.message || 'File was rejected.')
    }
  }

  return (
    <Stack gap="xl" maw={800} mx="auto" p="md">
      <Flex align="center" justify="center" my={25} gap={10}>
        <BrandLogo className="size-14" />
        <Title ff="Matemasie, sans-serif" fw={100}>
          Squish!
        </Title>
      </Flex>

      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={MAX_UPLOAD_FILE_SIZE}
        accept={IMAGE_MIME_TYPE}
        maxFiles={1}
        bdrs="xl"
        disabled={isCompressing}
        className="border-2 border-dashed border-(--mantine-color-gray-4) hover:border-(--mantine-color-primary-4) hover:bg-(--mantine-color-primary-1)/10 data-accept:border-(--mantine-color-primary-4) data-accept:bg-(--mantine-color-primary-1)/10 data-reject:border-(--mantine-color-red-4) data-reject:bg-(--mantine-color-red-1)/10 transition-all duration-200"
        style={{
          cornerShape: 'squircle',
          cursor: isCompressing ? 'not-allowed' : 'pointer',
          opacity: isCompressing ? 0.6 : 1,
        }}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <UploadSimpleIcon
              size={52}
              weight="fill"
              color="var(--mantine-color-primary-4)"
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XIcon size={52} color="var(--mantine-color-red-6)" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <ImageIcon
              size={52}
              weight="fill"
              color="var(--mantine-color-gray-4)"
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline ta="center">
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={10} ta="center">
              Attach one file at a time. Files should not exceed 20MB.
            </Text>
          </div>
        </Group>
      </Dropzone>

      <Paper withBorder p="md" radius="xl">
        <Stack gap="md">
          <Flex justify="space-between" align="center">
            <Text fw={500} size="lg">
              Preview & Actions
            </Text>
            {previewUrl && !isCompressing && (
              <ActionIcon variant="filled" color="red" onClick={clearFile}>
                <XIcon weight="bold" />
              </ActionIcon>
            )}
          </Flex>

          {previewUrl ? (
            <Box style={{ position: 'relative' }}>
              <Image
                src={previewUrl}
                alt="Upload preview"
                radius="md"
                h={300}
                fit="contain"
                fallbackSrc="https://placehold.co/600x400?text=Preview+Unavailable"
              />
              {isCompressing && (
                <Box
                  pos="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(255, 255, 255, 0.5)"
                  style={{ borderRadius: 'var(--mantine-radius-md)' }}
                />
              )}
            </Box>
          ) : (
            <Flex
              h={300}
              bg="var(--mantine-color-gray-2)"
              style={{ borderRadius: 'var(--mantine-radius-md)' }}
              align="center"
              justify="center"
            >
              <Text c="dimmed">No image selected</Text>
            </Flex>
          )}

          {isFailed && (
            <Text c="red" size="sm" ta="center">
              Compression failed: {errorMessage}
            </Text>
          )}

          <Group grow gap={10}>
            <Button
              disabled={!file || isCompleted || isFailed}
              loading={isCompressing}
              onClick={compressImage}
              leftSection={!isCompressing && <SparkleIcon weight="fill" />}
              color="primary"
            >
              {isCompressing ? 'Compressing...' : 'Compress Image'}
            </Button>

            <Button
              disabled={!isCompleted}
              onClick={handleDownload}
              variant={isCompleted ? 'filled' : 'light'}
              leftSection={<DownloadSimpleIcon weight="bold" />}
            >
              Download WebP
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default OptimizePage
