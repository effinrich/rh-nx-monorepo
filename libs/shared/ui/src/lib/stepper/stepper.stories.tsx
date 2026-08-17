import { Box } from '../box/box'
import { HStack } from '../h-stack/h-stack'

import {
  StepsRoot,
  StepsItem,
  StepsIndicator,
  StepsSeparator,
  StepsTitle,
  StepsDescription,
  StepsStatus,
  StepsList,
  StepsContent,
  StepsCompletedContent,
  StepsNextTrigger,
  StepsPrevTrigger
} from './stepper'

export default {
  title: 'Components / Navigation / Stepper'
}

const steps = [
  { title: 'First', description: 'Contact Info' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' }
]

export const Horizontal = () => {
  return (
    <StepsRoot defaultStep={1} count={steps.length}>
      <StepsList>
        {steps.map((step, index) => (
          // @ts-expect-error Chakra v3 compound component typing
          <StepsItem key={index} index={index}>
            {/* @ts-expect-error Chakra v3 compound component typing */}
            <StepsIndicator />
            <Box flexShrink="0">
              <StepsTitle>{step.title}</StepsTitle>
              <StepsDescription>{step.description}</StepsDescription>
            </Box>
            <StepsSeparator />
          </StepsItem>
        ))}
      </StepsList>

      <HStack mt="5">
        <StepsPrevTrigger asChild>
          <button>Prev</button>
        </StepsPrevTrigger>
        <StepsNextTrigger asChild>
          <button>Next</button>
        </StepsNextTrigger>
      </HStack>
    </StepsRoot>
  )
}

export const Vertical = () => {
  return (
    <StepsRoot defaultStep={1} count={steps.length} orientation="vertical">
      <StepsList height="400px">
        {steps.map((step, index) => (
          // @ts-expect-error Chakra v3 compound component typing
          <StepsItem key={index} index={index}>
            {/* @ts-expect-error Chakra v3 compound component typing */}
            <StepsIndicator />
            <Box flexShrink="0">
              <StepsTitle>{step.title}</StepsTitle>
              <StepsDescription>{step.description}</StepsDescription>
            </Box>
            <StepsSeparator />
          </StepsItem>
        ))}
      </StepsList>

      <HStack mt="5">
        <StepsPrevTrigger asChild>
          <button>Prev</button>
        </StepsPrevTrigger>
        <StepsNextTrigger asChild>
          <button>Next</button>
        </StepsNextTrigger>
      </HStack>
    </StepsRoot>
  )
}
