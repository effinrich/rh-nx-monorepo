import { Meta } from '@storybook/react-vite'

import { ShadowBox } from '../shadow-box/shadow-box'

import { SimpleGrid } from './simple-grid'

export default {
  component: SimpleGrid,
  title: 'Components / Layout / SimpleGrid'
} as Meta<typeof SimpleGrid>

export const Default = {
  args: {
    columns: 2,
    gap: 10,
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const Responsive = {
  args: {
    columns: [2, null, 3],
    gap: '40px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const AutoResponsive = {
  args: {
    minChildWidth: '120px',
    gap: '40px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}

export const XAndYSpacing = {
  args: {
    columns: 2,
    columnGap: '40px',
    rowGap: '20px',
    children: (
      <>
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
        <ShadowBox bg="tomato" height="80px" />
      </>
    )
  }
}
