import { formatDate } from '@redesignhealth/portal/utils'
import { Text } from '@redesignhealth/ui'

interface DetailsOfRequestReleaseViewProps {
  dateRequest: string
  dateRelease?: string
}

export const DetailsOfRequestReleaseView = ({
  dateRequest,
  dateRelease
}: DetailsOfRequestReleaseViewProps) => {
  return (
    <>
      <Text>Requested on: {formatDate(dateRequest)}</Text>
      <Text>
        Released on:{' '}
        {dateRelease ? formatDate(dateRelease) : 'Not released yet'}
      </Text>
    </>
  )
}
