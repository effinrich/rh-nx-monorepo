import { type CardProps, Card } from '@redesignhealth/ui'

interface DetailsCardProps extends CardProps {
  children: React.ReactNode
}
const DetailsCard = ({ children, ...cardProps }: DetailsCardProps) => {
  return (
    <Card variant="unstyled" gap={6} {...cardProps}>
      {children}
    </Card>
  )
}

export default DetailsCard
