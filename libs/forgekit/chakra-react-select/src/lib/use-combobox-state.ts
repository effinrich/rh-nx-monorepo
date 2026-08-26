import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useListCollection } from '@chakra-ui/react'

import type {
  ComboboxSource,
  CommonComboboxProps,
  CreatableOptions
} from './types'

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000
const DEFAULT_MAX_CACHE_ENTRIES = 50

interface CacheEntry<Option> {
  expiresAt: number
  items: readonly Option[]
}

interface UseComboboxStateOptions<Option> {
  source: ComboboxSource<Option>
  selectedItems: readonly Option[]
  getOptionLabel: (option: Option) => string
  getOptionValue: (option: Option) => string
  isOptionDisabled?: (option: Option) => boolean
  creatable?: CreatableOptions<Option>
}

function uniqueByValue<Option>(
  items: readonly Option[],
  getOptionValue: (option: Option) => string
) {
  const seen = new Set<string>()

  return items.filter(item => {
    const value = getOptionValue(item)
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

function defaultLabel<Option>(option: Option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }

  if (option && typeof option === 'object' && 'label' in option) {
    return String((option as { label: unknown }).label)
  }

  return String(option)
}

function defaultValue<Option>(option: Option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option)
  }

  if (option && typeof option === 'object' && 'value' in option) {
    return String((option as { value: unknown }).value)
  }

  return defaultLabel(option)
}

export function getOptionAccessors<Option>(
  props: Pick<
    CommonComboboxProps<Option>,
    'getOptionLabel' | 'getOptionValue'
  >
) {
  return {
    getOptionLabel: props.getOptionLabel ?? defaultLabel<Option>,
    getOptionValue: props.getOptionValue ?? defaultValue<Option>
  }
}

export function useComboboxState<Option>({
  source,
  selectedItems,
  getOptionLabel,
  getOptionValue,
  isOptionDisabled,
  creatable
}: UseComboboxStateOptions<Option>) {
  const [query, setQuery] = useState('')
  const [asyncItems, setAsyncItems] = useState<readonly Option[]>(
    source.kind === 'async' ? source.initialItems ?? [] : []
  )
  const [createdItems, setCreatedItems] = useState<readonly Option[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [retryToken, setRetryToken] = useState(0)
  const requestToken = useRef(0)
  const cache = useRef(new Map<string, CacheEntry<Option>>())
  const loadRef = useRef(source.kind === 'async' ? source.load : null)
  const initialItemsRef = useRef<readonly Option[]>(
    source.kind === 'async' ? source.initialItems ?? [] : []
  )
  const onErrorRef = useRef(source.kind === 'async' ? source.onError : undefined)

  const isAsync = source.kind === 'async'
  const debounceMs = source.kind === 'async' ? source.debounceMs ?? 250 : 0
  const minQueryLength =
    source.kind === 'async' ? source.minQueryLength ?? 0 : 0
  const cacheOptions = source.kind === 'async' ? source.cache : false
  const cacheEnabled = cacheOptions !== false
  const cacheTtlMs =
    typeof cacheOptions === 'object'
      ? cacheOptions.ttlMs ?? DEFAULT_CACHE_TTL_MS
      : DEFAULT_CACHE_TTL_MS
  const maxCacheEntries =
    typeof cacheOptions === 'object'
      ? cacheOptions.maxEntries ?? DEFAULT_MAX_CACHE_ENTRIES
      : DEFAULT_MAX_CACHE_ENTRIES

  useEffect(() => {
    loadRef.current = source.kind === 'async' ? source.load : null
    initialItemsRef.current =
      source.kind === 'async' ? source.initialItems ?? [] : []
    onErrorRef.current = source.kind === 'async' ? source.onError : undefined
  }, [source])

  useEffect(() => {
    if (!isAsync) return

    if (query.trim().length < minQueryLength) {
      requestToken.current += 1
      setLoading(false)
      setError(null)
      setAsyncItems(initialItemsRef.current)
      return
    }

    const normalizedQuery = query.trim()
    const cached = cache.current.get(normalizedQuery)

    if (cacheEnabled && cached && cached.expiresAt > Date.now()) {
      cache.current.delete(normalizedQuery)
      cache.current.set(normalizedQuery, cached)
      setAsyncItems(cached.items)
      setLoading(false)
      setError(null)
      return
    }

    if (cached) cache.current.delete(normalizedQuery)

    const controller = new AbortController()
    const token = ++requestToken.current
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const items = await loadRef.current?.(normalizedQuery, {
          signal: controller.signal
        })

        if (controller.signal.aborted || token !== requestToken.current) return

        const successfulItems = items ?? []
        setAsyncItems(successfulItems)

        if (cacheEnabled) {
          cache.current.set(normalizedQuery, {
            expiresAt: Date.now() + cacheTtlMs,
            items: successfulItems
          })

          while (cache.current.size > maxCacheEntries) {
            const oldestKey = cache.current.keys().next().value
            if (oldestKey === undefined) break
            cache.current.delete(oldestKey)
          }
        }
      } catch (requestError) {
        if (controller.signal.aborted || token !== requestToken.current) return
        setError(requestError)
        onErrorRef.current?.(requestError, normalizedQuery)
      } finally {
        if (!controller.signal.aborted && token === requestToken.current) {
          setLoading(false)
        }
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [
    cacheEnabled,
    cacheTtlMs,
    debounceMs,
    isAsync,
    maxCacheEntries,
    minQueryLength,
    query,
    retryToken
  ])

  const localItems = source.kind === 'local' ? source.items : null
  const localFilter = source.kind === 'local' ? source.filter : undefined
  const sourceItems = localItems ?? asyncItems

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!localItems || normalizedQuery.length === 0) {
      return [...sourceItems]
    }

    return sourceItems.filter(option =>
      localFilter
        ? localFilter(option, query)
        : getOptionLabel(option).toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [getOptionLabel, localFilter, localItems, query, sourceItems])

  const visibleCreatedItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return [...createdItems]

    return createdItems.filter(option =>
      getOptionLabel(option).toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [createdItems, getOptionLabel, query])

  const knownItems = useMemo(
    () =>
      uniqueByValue(
        [...sourceItems, ...createdItems, ...selectedItems],
        getOptionValue
      ),
    [createdItems, getOptionValue, selectedItems, sourceItems]
  )

  const createCandidate = useMemo(() => {
    const inputValue = query.trim()
    if (!creatable || inputValue.length === 0) return null

    const hasExactMatch = knownItems.some(
      item =>
        getOptionLabel(item).toLocaleLowerCase() ===
          inputValue.toLocaleLowerCase() || getOptionValue(item) === inputValue
    )

    if (hasExactMatch) return null
    if (creatable.isValidInput?.(inputValue, knownItems) === false) return null

    return creatable.createOption(inputValue)
  }, [creatable, getOptionLabel, getOptionValue, knownItems, query])

  const visibleItems = useMemo(
    () =>
      uniqueByValue(
        [
          ...filteredItems,
          ...visibleCreatedItems,
          ...(createCandidate ? [createCandidate] : [])
        ],
        getOptionValue
      ),
    [
      createCandidate,
      filteredItems,
      getOptionValue,
      visibleCreatedItems
    ]
  )

  const collectionItems = useMemo(
    () =>
      uniqueByValue([...visibleItems, ...selectedItems], getOptionValue),
    [getOptionValue, selectedItems, visibleItems]
  )

  const { collection, set: setCollectionItems } = useListCollection({
    initialItems: collectionItems,
    itemToString: getOptionLabel,
    itemToValue: getOptionValue,
    isItemDisabled: isOptionDisabled
  })

  useEffect(() => {
    setCollectionItems(collectionItems)
  }, [collectionItems, setCollectionItems])

  const itemByValue = useMemo(
    () =>
      new Map(collectionItems.map(item => [getOptionValue(item), item] as const)),
    [collectionItems, getOptionValue]
  )

  const resolveValues = useCallback(
    (values: readonly string[]) =>
      values.flatMap(value => {
        const option = itemByValue.get(value)
        return option === undefined ? [] : [option]
      }),
    [itemByValue]
  )

  const commitCreatedOption = useCallback(
    (option: Option | null) => {
      if (!option || option !== createCandidate) return
      setCreatedItems(items =>
        uniqueByValue([...items, option], getOptionValue)
      )
    },
    [createCandidate, getOptionValue]
  )

  return {
    collection,
    createCandidate,
    error,
    loading,
    query,
    resolveValues,
    retry: () => setRetryToken(token => token + 1),
    selectedValues: selectedItems.map(getOptionValue),
    setQuery,
    visibleItems,
    commitCreatedOption
  }
}
