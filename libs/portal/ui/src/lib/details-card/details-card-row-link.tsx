import { Link } from '@redesignhealth/ui'

export interface DetailsCardRowLinkProps {
  href?: string
  name?: string
}

const DetailsCardRowLink = ({ href, name }: DetailsCardRowLinkProps) => {
  return (
    <Link href={href} fontWeight="500" isExternal>
      {name || href}
    </Link>
  )
}

export default DetailsCardRowLink
