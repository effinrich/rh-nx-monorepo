import { useState } from 'react'

import { Image } from '../image'

export function BugImage() {
  const [src, setSrc] = useState('')

  const onClick = () => {
    setSrc(
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    )
  }

  return (
    <div>
      <Image src={src} />
      <button onClick={onClick}>set image</button>
      <p>src set to Avatar: {src}</p>
    </div>
  )
}
