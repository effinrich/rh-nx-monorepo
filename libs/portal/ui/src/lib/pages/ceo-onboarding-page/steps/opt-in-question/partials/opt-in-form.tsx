import { CardBody, RadioGroup, Stack, Text } from '@redesignhealth/ui'

import ButtonRadio from '../../../button-radio/button-radio'

interface OptInFormProps {
  isOptIn?: string
  setIsOptIn(newValue: string): void
}
const OptInForm = ({ isOptIn, setIsOptIn }: OptInFormProps) => (
  <CardBody>
    <RadioGroup colorScheme="primary" value={isOptIn} onChange={setIsOptIn}>
      <Stack spacing={4}>
        <ButtonRadio
          value="OPT_IN"
          isChecked={isOptIn === 'OPT_IN'}
          title="Yes, I want to opt-in"
          subtitle="By opting in to the CEO Directory, you acknowledge your participation is completely optional. You should be mindful of the information you choose to share and we recommend that you do not share any OpCo-specific private or proprietary information. Redesign Health makes no representation or warranty, express or implied, concerning the information and content shared by members of the CEO Directory."
        />
        <ButtonRadio
          value="OPT_OUT"
          isChecked={isOptIn === 'OPT_OUT'}
          title="No, I want to opt-out"
          subtitle={
            <>
              Your profile will not be shown in the CEO Directory and your
              account will have <Text as="b">restricted access</Text> to viewing
              the full details of other CEOs. You can opt-in at any point in the
              future if you change your mind.
            </>
          }
        />
      </Stack>
    </RadioGroup>
  </CardBody>
)

export default OptInForm
