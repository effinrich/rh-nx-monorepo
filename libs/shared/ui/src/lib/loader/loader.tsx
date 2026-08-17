import { Flex } from '../flex/flex'
import { Spinner } from '../spinner/spinner'

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  minH?: string
}

export const Loader = ({
  size = 'lg',
  color = 'primary.600',
  minH = '25vh',
  ...props
}: LoaderProps) => {
  return (
    <Flex align="center" justify="center" flex="1" minH={minH} {...props}>
      <Spinner
        size={size}
        color={color}
      />
    </Flex>
  )
}

export default Loader
