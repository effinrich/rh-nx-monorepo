import { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '../box/box'

import { Prose } from './prose'

export default {
  component: Prose,
  title: 'Components / Typography / Prose',
  decorators: [
    (Story: React.ElementType) => (
      <Box mx="auto" maxW="2xl" mt="40px">
        <Story />
      </Box>
    )
  ]
} as Meta<typeof Prose>

export const Default: StoryObj<typeof Prose> = {
  render: () => (
    <Prose>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <p>
        This is a paragraph with a <a href="#">link</a> and some <strong>bold</strong> and{' '}
        <em>italic</em> text.
      </p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
      <ol>
        <li>Ordered item one</li>
        <li>Ordered item two</li>
      </ol>
      <blockquote>A blockquote with some text inside.</blockquote>
      <pre>
        <code>const example = true</code>
      </pre>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Column A</th>
            <th>Column B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Value 1</td>
            <td>Value 2</td>
          </tr>
        </tbody>
      </table>
    </Prose>
  )
}

export const WithWideImage: StoryObj<typeof Prose> = {
  render: () => (
    <Prose>
      <p>The image below uses the wide-image utility class to span full width.</p>
      <img
        className="wide-image"
        src="https://via.placeholder.com/800x200"
        alt="Wide placeholder"
      />
    </Prose>
  )
}
