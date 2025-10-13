import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { FieldValues, UseFormWatch } from 'react-hook-form'

import { sendSearchEvent } from './events'

/**
 * Use to establish connection to analytics server
 */

/**
 * TODO: Remove ReactGA4 hook from custom library
 * Please refer to ReactGA4 documentation: https://github.com/codler/react-ga4.
 * In react, paricularly when documented as such, initializations
 * are implemented in the main.tsx file and very simply unless
 * the libs docs suggest otherwise.  Putting this in a hook limits it
 * to stateless functions, which negates the ease of initialzation
 * and adds complexity.
 */
export const useInitialize = (
  analyticsId?: string,
  options?: {
    enableAutomaticPageViews: boolean
  }
) => {
  if (!analyticsId) {
    throw new Error('Analytics ID must be provided')
  }

  useEffect(() => {
    ReactGA.initialize(analyticsId, {
      gtagOptions: {
        send_page_view: options?.enableAutomaticPageViews
      }
    })
  }, [analyticsId, options])
}

/**
 * Helper for watching react-hook-forms in <FilterBox />'s and sending search
 * analytics
 */
export function useWatchSearchEvent<T extends FieldValues>(
  watch: UseFormWatch<T>,
  filterNames: string[]
) {
  useEffect(() => {
    const subscription = watch(allFields => {
      sendSearchEvent({
        query: allFields.query,
        sort: allFields.sort,
        filters: filterNames.map(filterName => ({
          field: filterName,
          value: allFields[filterName]?.join(',')
        }))
      })
    })
    return () => subscription.unsubscribe()
  }, [filterNames, watch])
}
