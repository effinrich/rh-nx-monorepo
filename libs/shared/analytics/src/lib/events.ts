import ReactGA from 'react-ga4'
/**
 * TODO: Refactor this to only be for custom events, simplify in general
 * Use ReactGA4 per the docs aside from custom events, which should follow
 * a standard exported const pattern.  No value in obscuring or overcomplicating such a simple
 * library. Any further abstractions of 3rd party libs needs to be discussed with tech lead
 * and other FE engnineers to determine pros, cons, etc.  Rarely is this necessary. If custom
 * events are needed, simply make a an events file for those custom events.
 */
//Recommended Events
// =====================

/**
 * More details: https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag
 */
export const sendPageView = () => {
  ReactGA.event('page_view', {})
}

export const sendSearchEvent = (options: {
  query?: string
  filters: { field: string; value?: string }[]
  sort?: string
}) => {
  /**
   * Map filter fields to prepend a "q_". This mimics the default
   * enhanced "search" event here:
   * https://support.google.com/analytics/answer/9216061
   */
  const filterAttributes = options.filters.reduce<
    Record<string, string | undefined>
  >((filters, filter) => {
    return {
      ...filters,
      [`q_${filter.field}`]: filter.value
    }
  }, {})

  ReactGA.event('search', {
    search_term: options.query,
    q_sort: options.sort,
    ...filterAttributes
  })
}

export const sendSelectContentEvent = (options: {
  content_type: string
  content_id: string
}) => {
  ReactGA.event('select_content', options)
}

/**
 * More info: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=8540918959265818689-NA&client_type=gtag#view_item_list
 */
export const sendViewItemListEvent = (options: {
  items: {
    item_id: string
    item_name: string
    index: number
    affiliation: string
  }[]
}) => {
  ReactGA.event('view_item_list', options)
}

// Custom Events
// ========================

export const sendDisclaimerAccept = (options: { type: 'BUYER' | 'SELLER' }) => {
  ReactGA.event('disclaimer_accept', options)
}
