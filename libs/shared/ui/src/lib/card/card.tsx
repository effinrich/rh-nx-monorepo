export {
  type CardBodyProps,
  type CardHeaderProps,
  type CardRootProps as CardProps,
  Card,
  CardRoot,
  CardBody,
  CardFooter,
  CardHeader
} from '@chakra-ui/react'
<<<<<<< HEAD

export type { CardBodyProps, CardHeaderProps } from '@chakra-ui/react'

// CardRootProps is not exported by @chakra-ui/react - derive it from the component
import { CardRoot } from '@chakra-ui/react'
import type { ComponentProps } from 'react'
export type CardProps = ComponentProps<typeof CardRoot>
=======
>>>>>>> origin/main
