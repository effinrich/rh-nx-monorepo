import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccordionButton } from './accordion-button'

describe('AccordionButton', () => {
  it('renders correctly', () => {
    render(<AccordionButton>Test Content</AccordionButton>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AccordionButton className="custom-class">Content</AccordionButton>)
    
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom-class')
  })
})
