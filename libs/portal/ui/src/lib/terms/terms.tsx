import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import {
  useAcceptConsent,
  useGetTermsHtml
} from '@redesignhealth/portal/data-assets'
import { logout } from '@redesignhealth/portal/utils'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@redesignhealth/ui'
import parse from 'html-react-parser'

const StyledTerms = styled.div`
  p,
  span,
  ol > li {
    font-family: 'Inter', sans-serif !important;
  }
`

interface TermsProps {
  isAskingConsent?: boolean
  isOpen: boolean
  onClose: () => void
}

const Terms = ({ isAskingConsent = false, isOpen, onClose }: TermsProps) => {
  const navigate = useNavigate()

  const termsHtml = useGetTermsHtml()
  const { mutate, isPending } = useAcceptConsent()

  const handleLogout = () => {
    logout(() => navigate('/sign-in'))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={['full', '2xl', '2xl']}
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent maxHeight="80vh">
        <ModalHeader>Terms of Service</ModalHeader>
        <ModalBody id="termsModalBody">
          <StyledTerms>{termsHtml && parse(termsHtml as string)}</StyledTerms>
        </ModalBody>

        {isAskingConsent && (
          <ModalFooter>
            <Button mr={3} onClick={handleLogout} variant="outline">
              Decline
            </Button>
            <Button
              colorScheme="primary"
              isLoading={isPending}
              onClick={() => mutate()}
            >
              Accept
            </Button>
          </ModalFooter>
        )}
        {!isAskingConsent && (
          <ModalFooter>
            <Button colorScheme="primary" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default Terms
