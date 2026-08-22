import { rh } from '../rh'

export function WithColorModeRh() {
  return (
    <>
      <rh.span>Not forced</rh.span>
      <div data-theme="dark">
        <rh.div bg="gray.800" padding="40px">
          <rh.p color="fg">Forced dark mode</rh.p>
        </rh.div>
      </div>
    </>
  )
}
