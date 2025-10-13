import { render, screen } from '@testing-library/react'

import Pagination from './pagination'

describe('Pagination', () => {
  it('disable next button on last page', () => {
    render(
      <Pagination currentPage={9} totalPages={10} handlePageChange={() => ''} />
    )
    expect(screen.getByText('Previous')).toBeEnabled()
    expect(screen.getByText('Next')).toBeDisabled()
  })

  it('disable previous button on first page', () => {
    render(
      <Pagination currentPage={0} totalPages={10} handlePageChange={() => ''} />
    )
    expect(screen.getByText('Previous')).toBeDisabled()
    expect(screen.getByText('Next')).toBeEnabled()
  })

  it('enable previous/next buttons on middle pages', () => {
    render(
      <Pagination currentPage={3} totalPages={10} handlePageChange={() => ''} />
    )
    expect(screen.getByText('Previous')).toBeEnabled()
    expect(screen.getByText('Next')).toBeEnabled()
  })

  it('goes to next page', () => {
    const handlePageChange = jest.fn()

    render(
      <Pagination
        currentPage={0}
        totalPages={10}
        handlePageChange={handlePageChange}
      />
    )
    screen.getByText('Next').click()
    expect(handlePageChange.mock.calls[0][0]).toBe(1)
  })

  it('goes to previous page', () => {
    const handlePageChange = jest.fn()
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        handlePageChange={handlePageChange}
      />
    )
    screen.getByText('Previous').click()
    expect(handlePageChange.mock.calls[0][0]).toBe(0)
  })
  
  it('hides the component when there is a single page', () => {
    const handlePageChange = jest.fn()
    render(<Pagination totalPages={2} handlePageChange={handlePageChange} />)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    render(<Pagination totalPages={1} handlePageChange={handlePageChange} />)
    expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument()
  })
})
