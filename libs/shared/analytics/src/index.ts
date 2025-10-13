import * as config from './lib/config'
import * as events from './lib/events'
import * as hooks from './lib/hooks'
export default {
  ...config,
  ...events,
  ...hooks
}
