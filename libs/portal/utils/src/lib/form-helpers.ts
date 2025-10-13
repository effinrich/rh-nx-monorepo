/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

type UnknownObject = Record<string, any>
type UnknownArrayOrObject = Array<unknown> | UnknownObject

// https://github.com/react-hook-form/react-hook-form/discussions/1991#discussioncomment-351784
export const dirtyValuesOnly = (
  dirtyFields: UnknownArrayOrObject | boolean | any,
  allValues: UnknownArrayOrObject | any
): UnknownArrayOrObject | any => {
  // NOTE: Recursive function.

  // If *any* item in an array was modified, the entire array must be submitted, because there's no
  // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues
  }

  const dirtyFieldsObject = dirtyFields as UnknownObject
  const allValuesObject = allValues as UnknownObject

  // Here, we have an object.
  return Object.fromEntries(
    Object.keys(dirtyFieldsObject).map(key => [
      key,
      dirtyValuesOnly(dirtyFieldsObject[key], allValuesObject[key])
    ])
  )
}

/**
 * Common error messages used for yup/form validation
 */
export const FORM_ERROR_MESSAGES = {
  SELECT_ONE: 'Must choose one option.',
  SELECT_AT_LEAST_ONE: 'Must choose at least one option.',
  REQUIRED: 'Required',
  INVALID_URL: 'must be a valid URL (ex. https://example.com)'
}

export const TEXTAREA_CHARACTER_LIMIT = 500

/**
 * This hook leverages "clearInterval" to ensure only the most
 * recent value change is immitted after the timeout.
 */
export function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  timeout = 500
) {
  useEffect(() => {
    const callbackTimeout = setTimeout(() => callback(value), timeout)
    return () => clearInterval(callbackTimeout)
  }, [value, callback, timeout])
}
