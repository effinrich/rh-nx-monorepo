import { MdCircle } from 'react-icons/md'
import {
  Icon,
  Step,
  StepIcon,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus
} from '@redesignhealth/ui'

interface OnboardingStepperProps {
  activeStep: number
}

const IncompleteIcon = () => <Icon as={MdCircle} color="gray.200" />
const ActiveIcon = () => <Icon as={MdCircle} color="brand.600" />

const OnboardingStepper = ({ activeStep }: OnboardingStepperProps) => (
  <Stepper colorScheme="brand" index={activeStep} width="150px" mb={6}>
    <Step>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<IncompleteIcon />}
          active={<ActiveIcon />}
        />
      </StepIndicator>
      <StepSeparator />
    </Step>
    <Step>
      <StepIndicator>
        <StepStatus
          complete={<StepIcon />}
          incomplete={<IncompleteIcon />}
          active={<ActiveIcon />}
        />
      </StepIndicator>
    </Step>
  </Stepper>
)

export default OnboardingStepper
