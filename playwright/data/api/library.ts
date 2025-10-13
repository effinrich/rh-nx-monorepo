export function expectedResponsePostLibrary(
  id: string,
  displayName: string,
  baseURL?: string
): Partial<LibrarySummary> {
  return {
    displayName: displayName,
    links: [
      {
        rel: 'self',
        href: `${baseURL}/library/${id}`
      }
    ]
  }
}
