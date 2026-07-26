import BrandLogo from '#/shared/components/logo/BrandLogo'
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
import type { FileWithPath } from '@mantine/dropzone'
import {
  ImageIcon,
  UploadSimpleIcon,
  XIcon,
  DownloadSimpleIcon,
  Sparkle,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [file, setFile] = useState<FileWithPath | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrop = (files: FileWithPath[]) => {
    const selectedFile = files[0]
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const clearFile = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Stack gap="xl" maw={800} mx="auto" p="md">
      {/* Header */}
      <Flex align="center" justify="center" my={25} gap={10}>
        <BrandLogo className="size-14" />
        <Title ff="Matemasie, sans-serif" fw={100}>
          Squish!
        </Title>
      </Flex>

      {/* Upload Zone */}
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2} // Aligned with the 5MB text below
        accept={IMAGE_MIME_TYPE}
        maxFiles={1}
        bd="1px dashed var(--mantine-color-gray-4)"
        bdrs="xl"
        style={{
          cornerShape: 'squircle',
          cursor: 'pointer',
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
              color="var(--mantine-color-primary-6)"
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XIcon size={52} weight="fill" color="var(--mantine-color-red-6)" />
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
              Attach one file at a time. Files should not exceed 5MB.
            </Text>
          </div>
        </Group>
      </Dropzone>

      {/* Preview & Actions Area */}
      <Paper withBorder p="md" radius="xl">
        <Stack gap="md">
          <Flex justify="space-between" align="center">
            <Text fw={500} size="lg">
              Preview & Actions
            </Text>

            {previewUrl && (
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

          <Group grow>
            <Button
              disabled={!file}
              leftSection={<Sparkle weight="fill" />}
              color="primary"
              size="md"
            >
              Compress Image
            </Button>
            <Button
              disabled={!file} // In real logic, you might also disable this until compression is done
              variant="light"
              leftSection={<DownloadSimpleIcon weight="bold" />}
              size="md"
            >
              Download WebP
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}
