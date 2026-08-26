import { StreamingContent } from './streaming-renderer'

const Story = {
  component: StreamingContent,
  title: 'Shared / Markdown Renderer / StreamingContent',
  args: {
    children: '## Streaming Content\n\nRendering accumulated markdown safely.'
  }
}

export default Story

export const Basic = {
  render: () => (
    <StreamingContent>
      {'## Streaming Content\n\nRendering accumulated markdown safely.'}
    </StreamingContent>
  )
}
