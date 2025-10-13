import {
  DEFAULT_CONTENT_TYPE,
  Option,
  useLibraryStore,
  VIEW_ALL_OPTION
} from '@redesignhealth/portal/data-assets'

import { Filter } from '../../../filter-box'

const options: Option[] = [
  VIEW_ALL_OPTION,
  {
    label: 'Article',
    value: 'ARTICLE'
  },
  DEFAULT_CONTENT_TYPE,
  { label: 'Template', value: 'TEMPLATE' },
  { label: 'Third Party', value: 'THIRD_PARTY' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'Tool', value: 'TOOL' }
]
export const ContentTypeFilter = () => {
  const setModuleTypeValue = useLibraryStore(state => state.setModuleTypeValue)
  const moduleTypeValue = useLibraryStore(state => state.moduleTypeValue)

  return (
    <Filter
      value={moduleTypeValue}
      placeholder="Content type"
      options={options}
      onChange={setModuleTypeValue}
    />
  )
}

export default ContentTypeFilter
