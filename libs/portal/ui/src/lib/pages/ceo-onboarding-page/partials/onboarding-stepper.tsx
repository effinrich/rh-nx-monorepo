import { MdCheck, MdCircle } from 'react-icons/md'
import {
  StepsRoot,
  StepsItem,
  StepsIndicator,
  StepsSeparator,
  StepsStatus
} from '@redesignhealth/ui'

interface OnboardingStepperProps {
  activeStep: number
}

const CompleteIcon = () => <MdCheck color="white" />
const IncompleteIcon = () => <MdCircle color="var(--chakra-colors-gray-200)" />
const ActiveIcon = () => <MdCircle color="var(--chakra-colors-brand-600, var(--chakra-colors-primary-600))" />

const OnboardingStepper = ({ activeStep }: OnboardingStepperProps) => (
  <StepsRoot colorPalette="brand" step={activeStep} count={2} width="150px" mb={6}>
    {/* @ts-expect-error Chakra v3 compound component typing */}
    <StepsItem index={0}>
      {/* @ts-expect-error Chakra v3 compound component typing */}
      <StepsIndicator>
        <StepsStatus
          complete={<CompleteIcon />}
          incomplete={<IncompleteIcon />}
          current={<ActiveIcon />}
        />
      </StepsIndicator>
      <StepsSeparator />
    </StepsItem>
    {/* @ts-expect-error Chakra v3 compound component typing */}
    <StepsItem index={1}>
      {/* @ts-expect-error Chakra v3 compound component typing */}
      <StepsIndicator>
        <StepsStatus
          complete={<CompleteIcon />}
          incomplete={<IncompleteIcon />}
          current={<ActiveIcon />}
        />
      </StepsIndicator>
    </StepsItem>
  </StepsRoot>
)

export default OnboardingStepper
