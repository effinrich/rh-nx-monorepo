import { getData } from './jira-data'

type Data = Awaited<ReturnType<typeof getData>>

export const getAdvisors = (data: Data) => {
  return data.filter(row => row['Issue Type'] === 'Epic')
}

export const getOpcoEngagements = (advisor: Data[number], data: Data) => {
  const engagements = data.filter(
    row =>
      row.parent === advisor.Key &&
      (row['Issue Type'] === 'Introduction' || row['Issue Type'] === 'Contract')
  )

  return engagements
}

export const getOpcoEngagementNames = (advisor: Data[number], data: Data) => {
  const enagements = getOpcoEngagements(advisor, data)

  const opcoNames = enagements
    .filter(request => Boolean(request['OpCo/NewCo Name']))
    .flatMap(request => request['OpCo/NewCo Name'] as string)

  const uniqueNames = Array.from(new Set(opcoNames))

  return uniqueNames
}

export const getFirstOpcoEngagementDate = (
  advisor: Data[number],
  data: Data
) => {
  const engagements = getOpcoEngagements(advisor, data)

  const dates = engagements.map(engagement => {
    const date =
      engagement['Issue Type'] === 'Contract'
        ? engagement['Contract Start Date']
        : engagement['Introduction date']

    return new Date(date ?? '')
  })

  const validDates = dates.filter(date => !isNaN(date.getTime()))
  const sortedDates = validDates.sort((a, b) => b.getTime() - a.getTime())
  const firstDate = sortedDates.at(0)

  return firstDate
}

export const getTaxonomyTagsText = (advisor: Data[number]) => {
  const tags = [
    advisor['T1 Taxonomy Tag'],
    advisor['T2 Taxonomy Tag'],
    advisor['T3 Taxonomy Tag']
  ]

  const tagText = tags.filter(tag => Boolean(tag)).join(', ')

  return tagText
}
