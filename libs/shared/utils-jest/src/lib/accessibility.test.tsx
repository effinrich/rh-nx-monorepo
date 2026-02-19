import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accessibility } from './accessibility'

describe('Accessibility', () => {
  it('renders correctly', () => {
    render(<Accessibility>Test Content</Accessibility>)
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Accessibility className="custom-class">Content</Accessibility>)
    
    const element = screen.getByText('Content')
    expect(element).toHaveClass('custom-class')
  })
})
