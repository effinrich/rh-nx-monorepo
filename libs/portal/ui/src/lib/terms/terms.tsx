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
      open={isOpen}
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
      size={{ base: 'full', md: 'xl' }}
      scrollBehavior="inside"
      closeOnInteractOutside={false}
    >
      <ModalOverlay />
      {/* @ts-expect-error Chakra v3 DialogContent children typing */}
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
              colorPalette="primary"
              loading={isPending}
              onClick={() => mutate()}
            >
              Accept
            </Button>
          </ModalFooter>
        )}
        {!isAskingConsent && (
          <ModalFooter>
            <Button colorPalette="primary" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default Terms
