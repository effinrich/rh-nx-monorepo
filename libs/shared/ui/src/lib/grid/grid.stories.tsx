import { Meta } from '@storybook/react-vite'

import { Grid, GridItem } from './grid'

export default {
  component: Grid,
  title: 'Components / Layout / Grid'
} as Meta<typeof Grid>

export const TemplateColumns = {
  args: {
    templateColumns: 'repeat(5, 1fr)',
    gap: 6,
    children: (
      <>
        <GridItem w="100%" h="10" bg="blue.500" />
        <GridItem w="100%" h="10" bg="blue.500" />
        <GridItem w="100%" h="10" bg="blue.500" />
        <GridItem w="100%" h="10" bg="blue.500" />
        <GridItem w="100%" h="10" bg="blue.500" />
      </>
    )
  }
}

export const SpanningColumns = {
  args: {
    h: '200px',
    templateRows: 'repeat(2, 1fr)',
    templateColumns: 'repeat(5, 1fr)',
    gap: 4,
    children: (
      <>
        <GridItem rowSpan={2} colSpan={1} bg="tomato" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={4} bg="tomato" />
      </>
    )
  }
}

export const StartingAndEndingLines = {
  args: {
    templateColumns: 'repeat(5, 1fr)',
    gap: 4,
    children: (
      <>
        <GridItem colSpan={2} h="10" bg="tomato" />
        <GridItem colStart={4} colEnd={6} h="10" bg="papayawhip" />
      </>
    )
  }
}

export const TemplateAreas = {
  args: {
    h: '200px',
    templateAreas: `"header header"
                    "nav main"
                    "nav footer"`,
    gridTemplateRows: '50px 1fr 30px',
    gridTemplateColumns: '150px 1fr',
    gap: 1,
    color: 'blackAlpha.700',
    fontWeight: 'bold',
    children: (
      <>
        <GridItem pl="2" bg="orange.300" area="header">
          Header
        </GridItem>
        <GridItem pl="2" bg="pink.300" area="nav">
          Nav
        </GridItem>
        <GridItem pl="2" bg="green.300" area="main">
          Main
        </GridItem>
        <GridItem pl="2" bg="blue.300" area="footer">
          Footer
        </GridItem>
      </>
    )
  }
}
