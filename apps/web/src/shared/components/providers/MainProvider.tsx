import mainTheme from '#/shared/theme/main.theme'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GooeyToaster } from 'goey-toast'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()

const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GooeyToaster position="top-right" />
      <MantineProvider theme={mainTheme}>{children}</MantineProvider>
    </QueryClientProvider>
  )
}

export default MainProvider
