import { type ImageProps, Image } from '../../image/image'

import RhLogo from './logo-wrap.svg'

export const RedesignLogo = (props: ImageProps) => {
  return <Image src={RhLogo} {...props} fit="contain" />
}

export default RedesignLogo
