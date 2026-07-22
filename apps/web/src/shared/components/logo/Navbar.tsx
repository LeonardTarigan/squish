import { Button, Flex, Paper, Text, Title } from '@mantine/core'
import BrandLogo from './BrandLogo'

const Navbar = () => {
  return (
    <Paper
      my={20}
      mx={120}
      p={20}
      bd="1px solid var(--mantine-color-gray-8)"
      bdrs="40px"
      style={{
        cornerShape: 'squircle',
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={10}>
          <BrandLogo className="size-14" />
          <Title ff="Matemasie, sans-serif" fw={100}>
            Squish!
          </Title>
        </Flex>

        <Flex gap={20}>
          <Text size="lg">Tools</Text>
          <Text size="lg">Solutions</Text>
          <Text size="lg">Resources</Text>
        </Flex>

        <Button size="md">Get Started</Button>
      </Flex>
    </Paper>
  )
}

export default Navbar
