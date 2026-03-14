import { CloseButton } from './close-button'

export default {
  title: 'Components / Data Display / CloseButton',
  component: CloseButton
}

export const Default = () => <CloseButton />

export const State = () => <CloseButton disabled />

export const Sizes = () => (
  <>
    <CloseButton size="sm" />
    <CloseButton size="md" />
    <CloseButton size="lg" />
  </>
)
