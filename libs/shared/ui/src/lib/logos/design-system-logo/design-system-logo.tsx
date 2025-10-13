import { type ImageProps, Image } from '../../image/image'

import DsLogo from './design-system-logo.png'

export const DesignSystemLogo = (props: ImageProps) => {
  return <Image src={DsLogo} {...props} />
}

export default DesignSystemLogo
