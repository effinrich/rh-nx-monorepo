import { ConsentType } from '../types'

import buyerTermsHtml from './buyer-tos.html?raw'
import defaultTermsHtml from './default-tos.html?raw'
import sellerTermsHtml from './seller-tos.html?raw'

export interface TermsConfig {
  html?: string
  etag?: string
}

export const config: Record<ConsentType, TermsConfig> = {
  BUYER_TERMS_OF_SERVICE: {
    html: buyerTermsHtml,
    etag: '1'
  },
  TERMS_OF_SERVICE: {
    html: defaultTermsHtml,
    etag: 'f7170faf8d48561a00ea36adc22efc76'
  },
  SELLER_TERMS_OF_SERVICE: {
    html: sellerTermsHtml,
    etag: '1'
  },
  UNKNOWN: {}
}
