import { Fragment, type FC } from 'react'

import { Grid } from '../../grid/grid'
import type { IconProps } from '../../icon/icon'
import { Text } from '../../text/text'
import { VStack } from '../../v-stack/v-stack'

import * as AllIcons from '../icons'

export function IconsGallery() {
  return (
    <Grid gap="8" gridTemplateColumns="repeat(auto-fill, minmax(8rem, 1fr))">
      {Object.entries(AllIcons).map(([key, value]) => {
        if (key === 'createIcon') {
          return null
        }

        const IconComponent = value as FC<IconProps>

        return (
          <Fragment key={key}>
            <VStack gap="3">
              <IconComponent boxSize="40px" />
              <Text>{key}</Text>
            </VStack>
          </Fragment>
        )
      })}
    </Grid>
  )
}
