import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccordionItem } from './accordion-item'

describe('AccordionItem', () => {
  it('renders correctly', () => {
    render(<AccordionItem>Test Content</AccordionItem>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AccordionItem className="custom-class">Content</AccordionItem>)
    
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom-class')
  })
})
