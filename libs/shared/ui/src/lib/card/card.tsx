export {
  CardRoot as Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@chakra-ui/react'

export type {
  CardBodyProps,
  CardHeaderProps,
} from '@chakra-ui/react'

// CardRootProps is not exported by @chakra-ui/react - derive it from the component
import type { CardRoot } from '@chakra-ui/react'
import type { ComponentProps } from 'react'
export type CardProps = ComponentProps<typeof CardRoot>
