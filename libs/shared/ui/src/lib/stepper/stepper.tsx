// Chakra UI v3: Stepper renamed to Steps
// See: https://chakra-ui.com/docs/get-started/migration

export { Steps } from '@chakra-ui/react'

// Export Steps compound components (v3 recommended pattern)
export {
  StepsRoot,
  StepsList,
  StepsItem,
  StepsIndicator,
  StepsTitle,
  StepsDescription,
  StepsSeparator,
  StepsStatus,
  StepsContent,
  StepsCompletedContent,
  StepsNextTrigger,
  StepsPrevTrigger
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  StepsRoot as Stepper,
  StepsItem as Step,
  StepsTitle as StepTitle,
  StepsDescription as StepDescription,
  StepsIndicator as StepIndicator,
  StepsSeparator as StepSeparator,
  StepsStatus as StepStatus
} from '@chakra-ui/react'

export { useSteps } from '@chakra-ui/react'
