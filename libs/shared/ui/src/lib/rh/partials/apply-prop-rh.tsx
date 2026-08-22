import { rh } from '../rh'

export function ApplyPropRh() {
  return (
    <rh.p>
      This is a paragraph, but apply styles from{' '}
      <rh.code fontFamily="mono">styles.h1</rh.code>
    </rh.p>
  )
}
