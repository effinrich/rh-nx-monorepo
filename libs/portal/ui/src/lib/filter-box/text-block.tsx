import { Heading, Text } from '@redesignhealth/ui'

interface TextBlockProps {
  title?: string
  description?: React.ReactNode
}
export const TextBlock = ({ title, description }: TextBlockProps) => {
  return (
    <>
      {title && (
        <Heading
          as="h2"
          fontSize="lg"
          lineHeight={7}
          fontWeight={700}
          color="gray.800"
        >
          {title}
        </Heading>
      )}
      {description && (
        <Text fontSize="md" lineHeight={6} color="gray.600">
          {description}
        </Text>
      )}
    </>
  )
}

export default TextBlock
