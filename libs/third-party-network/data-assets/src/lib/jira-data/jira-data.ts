import { GoogleSpreadsheet } from 'google-spreadsheet'

import { companyAPI } from '../company-api/company-api'

import { dataSheetSchema } from './constants'

export * from './utils'

export const getSource = async () => {
  const exchangeResponse = await companyAPI.post<{ accessToken?: string }>(
    '/advise/token-exchange'
  )

  const env = import.meta.env
  const source = new GoogleSpreadsheet(env.VITE_GOOGLE_SHEET_ID)
  source.useRawAccessToken(exchangeResponse.data.accessToken ?? '')

  await source.loadInfo()
  return source
}

export const getData = async () => {
  const source = await getSource()
  const dataSheet = source.sheetsByTitle['Data']
  const rows = await dataSheet.getRows()

  const validation = dataSheetSchema.safeParse(rows)
  if (validation.success !== true) throw validation.error

  return validation.data
}

export const createRequest = async (request: {
  parent: string
  summary: string
  requesterName: string
  requesterEmail: string
  additionalEmails?: string
  opcoName: string
  opcoDescription: string
}) => {
  const source = await getSource()
  const requestsSheet = source.sheetsByTitle['Requests']
  await requestsSheet.addRow({
    parent: request.parent,
    Type: 'Introduction',
    Summary: request.summary,
    'Requestor Name': request.requesterName,
    'Requestor Email': request.requesterEmail,
    'Additional Emails': request.additionalEmails ?? '',
    'OpCo/Concept Name': request.opcoName,
    Description: request.opcoDescription
  })
}
