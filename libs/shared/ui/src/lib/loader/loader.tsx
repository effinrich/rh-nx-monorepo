import { type BoxProps } from '../box/box'
import { Flex } from '../flex/flex'
import { Spinner } from '../spinner/spinner'

export interface LoaderProps extends BoxProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  thickness?: string
  speed?: string
  minH?: string
}

export const Loader = ({
  size = 'lg',
  color = 'primary.600',
  thickness = '4px',
  speed = '0.65s',
  minH = '25vh',
  ...props
}: LoaderProps) => {
  return (
    <Flex align="center" justify="center" flex="1" minH={minH} {...props}>
      <Spinner
        thickness={thickness}
        speed={speed}
        size={size}
        color={color}
        label="Loading..."
      />
    </Flex>
  )
}

export default Loader
