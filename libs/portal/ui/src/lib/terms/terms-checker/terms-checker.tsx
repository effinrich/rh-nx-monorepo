import { useHasUserConsented } from '@redesignhealth/portal/data-assets'
import { Loader, useDisclosure } from '@redesignhealth/ui'

import Terms from '../terms'

interface ConsentCheckerProps {
  children: React.ReactNode
}

/**
 * Validate if the current user has accepted our Terms of Service
 */
const TermsChecker = ({ children }: ConsentCheckerProps) => {
  const { data: hasUserConsented, isFetched: hasUserConsentedFetched } =
    useHasUserConsented()

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  if (!hasUserConsentedFetched) {
    return <Loader />
  } else if (!hasUserConsented) {
    return <Terms isAskingConsent isOpen={isOpen} onClose={onClose} />
  } else {
    return children
  }
}

export default TermsChecker
