import Navbar from '#/shared/components/logo/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
