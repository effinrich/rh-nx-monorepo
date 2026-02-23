import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './accordion'

describe('Accordion', () => {
  it('renders correctly', () => {
    render(<Accordion>Test Content</Accordion>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Accordion className="custom-class">Content</Accordion>)
    
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom-class')
  })
})
