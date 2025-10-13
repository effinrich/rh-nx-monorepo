import { Link, Text } from '@redesignhealth/ui'

interface SellerInfoProps {
  name?: string
  email?: string
  company: string
}

const SellerInfo = ({ name, email, company }: SellerInfoProps) => {
  if (name) {
    return (
      <>
        <Text>{name}</Text>
        <Link href={`mailto:${email}`}>{email}</Link>
      </>
    )
  }

  return <Text>Someone at {company}</Text>
}

export default SellerInfo
