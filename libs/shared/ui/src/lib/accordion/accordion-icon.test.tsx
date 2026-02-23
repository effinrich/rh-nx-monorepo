import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccordionIcon } from './accordion-icon'

describe('AccordionIcon', () => {
  it('renders correctly', () => {
    render(<AccordionIcon>Test Content</AccordionIcon>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AccordionIcon className="custom-class">Content</AccordionIcon>)
    
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom-class')
  })
})
