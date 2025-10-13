import React, { useState } from 'react'
import { Box, SectionHeader, useSteps } from '@redesignhealth/ui'

import OnboardingStepper from './partials/onboarding-stepper'
import OptInConfirmation from './steps/opt-in-confirmation/opt-in-confirmation'
import OptInQuestion from './steps/opt-in-question/opt-in-question'
import OptOutConfirmation from './steps/opt-out-confirmation/opt-out-confirmation'

export interface CeoDirectoryOnboardingPageProps {
  title: string
  helpText: string
  stepperChildren?: React.ReactNode
}

export const CeoDirectoryOnboardingPage = () => {
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: 2
  })

  const [isOptIn, setIsOptIn] = useState<string | undefined>(undefined)

  const userPrompedToChoose = activeStep === 0
  const userChoseOptIn = activeStep === 1 && isOptIn === 'OPT_IN'
  const userChoseOptOut = activeStep === 1 && isOptIn === 'OPT_OUT'

  const assignProps = (): CeoDirectoryOnboardingPageProps => {
    if (userPrompedToChoose) {
      return {
        title: 'Welcome to the CEO Directory',
        helpText: 'Please complete this short 2min onboarding',
        stepperChildren: (
          <OptInQuestion
            isOptIn={isOptIn}
            setIsOptIn={setIsOptIn}
            handleConfirm={goToNext}
          />
        )
      }
    } else if (userChoseOptIn) {
      return {
        title: 'Thanks for opting-in!',
        helpText: 'Please complete this short 2min onboarding',
        stepperChildren: <OptInConfirmation handleCancel={goToPrevious} />
      }
    } else if (userChoseOptOut) {
      return {
        title: "You're opting out",
        helpText:
          "No worries, you'll still have limited access to the directory",
        stepperChildren: (
          <OptOutConfirmation handleCancel={() => setIsOptIn('OPT_IN')} />
        )
      }
    } else {
      return {
        title: '',
        helpText: ''
      }
    }
  }

  return (
    <>
      <SectionHeader
        title={assignProps().title}
        helpText={assignProps().helpText}
        isDivider={false}
      />
      <Box py={6}>
        <OnboardingStepper activeStep={activeStep} />
        {assignProps().stepperChildren}
      </Box>
    </>
  )
}

export default CeoDirectoryOnboardingPage
