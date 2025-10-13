/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import { Box } from '@redesignhealth/ui'

import type { Meta, StoryObj } from '@storybook/react'

import Pagination from './pagination'

const Story: Meta<typeof Pagination> = {
  component: Pagination,
  title: 'Components / Pagination'
}
export default Story

export const Default: StoryObj<typeof Pagination> = {
  render: () => {
    const [currentPage, setCurrentPage] = useState<number>(0)
    return (
      <Pagination
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
        totalPages={20}
      />
    )
  }
}

export const ScrollToTop: StoryObj<typeof Pagination> = {
  render: () => {
    const [currentPage, setCurrentPage] = useState<number>(0)
    return (
      <Box>
        <Box height="100vh" bgColor="primary.100">
          Scroll to the bottom to see pagination
        </Box>
        <Pagination
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
          totalPages={20}
        />
      </Box>
    )
  }
}
