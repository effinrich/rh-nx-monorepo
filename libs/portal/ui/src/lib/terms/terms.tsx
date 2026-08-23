import { useNavigate } from 'react-router-dom'
import {
  useAcceptConsent,
  useGetTermsHtml
} from '@redesignhealth/portal/data-assets'
import { logout } from '@redesignhealth/portal/utils'
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from '@redesignhealth/ui'
import parse from 'html-react-parser'

interface TermsProps {
  isAskingConsent?: boolean
  open: boolean
  onClose: () => void
}

const Terms = ({ isAskingConsent = false, open, onClose }: TermsProps) => {
  const navigate = useNavigate()

  const termsHtml = useGetTermsHtml()
  const { mutate, isPending } = useAcceptConsent()

  const handleLogout = () => {
    logout(() => navigate('/sign-in'))
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) onClose()
      }}
      size={{ base: 'full', md: 'xl' }}
      scrollBehavior="inside"
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      {/* @ts-expect-error Chakra v3 children typing */}
      <DialogPositioner>
        {/* @ts-expect-error Chakra v3 children typing */}
        <DialogContent maxHeight="80vh">
          <DialogHeader>
            {/* @ts-expect-error Chakra v3 DialogTitle children typing */}
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <DialogBody id="termsModalBody">
            <Box
              css={{
                '& p, & span, & ol > li': {
                  fontFamily: "'Inter', sans-serif !important"
                }
              }}
            >
              {termsHtml && parse(termsHtml as string)}
            </Box>
          </DialogBody>

          {isAskingConsent && (
            <DialogFooter>
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
            </DialogFooter>
          )}
          {!isAskingConsent && (
            <DialogFooter>
              <Button colorPalette="primary" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}

export default Terms
