import { type CardProps, CardRoot } from '@redesignhealth/ui'

interface DetailsCardProps extends CardProps {
  children: React.ReactNode
}
const DetailsCard = ({ children, ...cardProps }: DetailsCardProps) => {
  return (
    <CardRoot variant={"unstyled" as any} gap={6} {...cardProps}>
      {children}
    </CardRoot>
  )
}

export default DetailsCard
