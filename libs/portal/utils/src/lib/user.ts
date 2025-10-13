/**
 * Print full name of person
 */
export const printPersonName = (person: {
  givenName?: string
  familyName?: string
}) => {
  return `${person.givenName} ${person.familyName}`
}
