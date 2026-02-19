// Chakra UI v3: Stepper was renamed to Steps
// See: https://chakra-ui.com/docs/get-started/migration

// In Chakra v3, `Steps` is a namespace object (not a component).
// Export StepsRoot as Steps for backward compat.
export { StepsRoot as Steps } from '@chakra-ui/react'

// Export Steps compound components (v3 recommended pattern)
export {
  StepsRoot,
  StepsItem,
  StepsList,
  StepsTitle,
  StepsDescription,
  StepsIndicator,
  StepsNumber,
  StepsSeparator,
  StepsStatus,
  StepsContent,
  StepsCompletedContent,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsTrigger
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  StepsRoot as Stepper,
  StepsItem as Step,
  StepsTitle as StepTitle,
  StepsDescription as StepDescription,
  StepsIndicator as StepIndicator,
  StepsIndicator as StepIcon,
  StepsContent as StepIndicatorContent,
  StepsSeparator as StepSeparator,
  StepsStatus as StepStatus,
  useSteps
} from '@chakra-ui/react'
