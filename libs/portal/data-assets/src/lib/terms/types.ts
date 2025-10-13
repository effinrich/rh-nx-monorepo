import { Link } from '../types'

export type ConsentType =
  | 'UNKNOWN'
  | 'TERMS_OF_SERVICE'
  | 'BUYER_TERMS_OF_SERVICE'
  | 'SELLER_TERMS_OF_SERVICE'

export interface ConsentSummary {
  version: string
  accepted: string
  type: {
    displayName: string
    value: ConsentType
  }
  links: Link[]
}
