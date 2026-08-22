import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'

import {
  StepsDescription,
  StepsIndicator,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
  StepsSeparator,
  StepsTitle
} from '../stepper'

import { STEPPER_STEPS } from './stepper-steps'

export function HorizontalStepper() {
  return (
    <StepsRoot defaultStep={1} count={STEPPER_STEPS.length}>
      <StepsList>
        {STEPPER_STEPS.map((step, index) => (
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
