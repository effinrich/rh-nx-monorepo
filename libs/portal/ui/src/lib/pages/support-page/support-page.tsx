import { MdFeed, MdFeedback, MdHelp } from 'react-icons/md'
import { useGetMeConsent } from '@redesignhealth/portal/data-assets'
import { formatDate } from '@redesignhealth/portal/utils'
import {
  Box,
  Circle,
  CtaCard,
  Icon,
  SectionHeader,
  SimpleGrid,
  useDisclosure
} from '@redesignhealth/ui'

import Terms from '../../terms/terms'

const SupportPage = () => {
  const FEEDBACK_FORM_LINK =
    'https://docs.google.com/forms/d/e/1FAIpQLSfvVGv18OYYthjB6Z5BCRuxbESpC4YwAQvDviE42MzYQ-YYWQ/viewform'
  const { data: consent } = useGetMeConsent()

  const { onOpen, isOpen, onClose } = useDisclosure({ defaultIsOpen: false })

  return (
    <Box as="section" w="full">
      <SectionHeader title="Support Center" isDivider={false} pb={6} />
      <SimpleGrid columns={[1, 1, 2, 2]} spacing={6}>
        <CtaCard
          topVisual={
            <Circle size={14} bg="primary.600" color="white">
              <Icon as={MdHelp} boxSize={6} />
            </Circle>
          }
          title="Need help? Send us an email!"
          ctaVariant="link"
          ctaText="platform-support@redesignhealth.com"
          href="mailto:platform-support@redesignhealth.com"
          variant="filled"
        />
        <CtaCard
          topVisual={
            <Circle size={14} bg="primary.600" color="white">
              <Icon as={MdFeedback} boxSize={6} />
            </Circle>
          }
          title="Have feedback or new feature ideas? Share them with us!"
          ctaVariant="link"
          ctaText="Give feedback"
          href={FEEDBACK_FORM_LINK}
          variant="filled"
        />
        {consent?.accepted && (
          <CtaCard
            topVisual={
              <Circle size={14} bg="primary.600" color="white">
                <Icon as={MdFeed} boxSize={6} />
              </Circle>
            }
            title={
              'You accepted the Terms of Service on ' +
              formatDate(consent?.accepted)
            }
            ctaVariant="link"
            ctaText="Read terms of service"
            onClick={onOpen}
            variant="filled"
          />
        )}
        <Terms isOpen={isOpen} onClose={onClose} />
      </SimpleGrid>
    </Box>
  )
}

export default SupportPage
