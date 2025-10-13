import { Box, Text } from '@redesignhealth/ui'

export const DisclaimerText = () => {
  return (
    <Box>
      <Text pb={4}>
        The information provided on this website does not, and is not intended
        to, constitute legal, financial or other advice; instead, all
        information, content, and materials available on this site are for
        general informational purposes only. Information on this website may not
        constitute the most up-to-date legal, financial, or other information.
      </Text>
      <Text pb={4}>
        Readers of this website should contact their attorney or adviser to
        obtain advice with respect to any particular matter. No reader, user, or
        browser of this site should act or refrain from acting on the basis of
        information on this site without first seeking advice from the proper
        counsel or adviser. All liability with respect to actions taken or not
        taken based on the contents of this site are hereby expressly
        disclaimed. The content on these postings is provided "as is;" no
        representations are made that the content is error-free.
      </Text>
    </Box>
  )
}

export default DisclaimerText
