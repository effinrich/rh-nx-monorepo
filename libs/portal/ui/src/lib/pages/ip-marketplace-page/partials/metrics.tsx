import { HStack, Text } from '@redesignhealth/ui'

interface MetricsProps {
  viewCount?: number
  requestCount?: number
}

const Metrics = ({ viewCount, requestCount }: MetricsProps) => (
  <HStack>
    {viewCount !== undefined && (
      <Text data-testid="ip-metric-view-count">
        <Text as="b">Views:</Text> {viewCount}
      </Text>
    )}
    {requestCount !== undefined && (
      <Text data-testid="ip-metric-request-count">
        <Text as="b">Requests:</Text> {requestCount}
      </Text>
    )}
  </HStack>
)
export default Metrics
