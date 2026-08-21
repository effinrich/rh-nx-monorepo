import { useState } from 'react'

import { rh } from '../../rh/rh'

import { TabView } from './tab-view'

const initialData = [
  { id: 'a', value: 1 },
  { id: 'b', value: 5 }
]

export function WithSwappedTabs() {
  const [items, setItems] = useState(initialData)
  const [selectedItemId, setSelectedItemId] = useState('a')

  const swapData = () => {
    setItems(currentItems => {
      const [a, b] = currentItems
      if (!a || !b) {
        return currentItems
      }
      return [b, a]
    })
  }

  return (
    <rh.div m={4}>
      <button type="button" onClick={swapData}>
        Swap tab order
      </button>
      <TabView
        items={items}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
    </rh.div>
  )
}
