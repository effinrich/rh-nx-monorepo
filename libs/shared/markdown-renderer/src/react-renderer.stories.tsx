import { TechnicalContent } from './react-renderer'

const Story = {
  component: TechnicalContent,
  title: 'Shared / Markdown Renderer / TechnicalContent',
  args: {
    children: '# Technical Content\n\n- Supports markdown\n- Uses story args'
  }
}

export default Story

export const Basic = {
  render: () => (
    <TechnicalContent>
      {'# Technical Content\n\n- Supports markdown\n- Uses story args'}
    </TechnicalContent>
  )
}
