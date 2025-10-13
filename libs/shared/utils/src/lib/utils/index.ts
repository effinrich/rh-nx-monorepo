/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export const cx = (...classNames: Array<any>) =>
  classNames.filter(Boolean).join(' ')

function isDev() {
  return import.meta.env.NODE_ENV !== 'production'
}

export function isObject(value: any): value is Record<string, any> {
  const type = typeof value
  return (
    value != null &&
    (type === 'object' || type === 'function') &&
    !Array.isArray(value)
  )
}

type MessageOptions = {
  condition: boolean
  message: string
}

export const warn = (options: MessageOptions) => {
  const { condition, message } = options
  if (condition && isDev()) {
    // eslint-disable-next-line no-console
    console.warn(message)
  }
}

export function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: Array<U>) => T),
  ...args: Array<U>
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn
}

const isFunction = <T extends Function = Function>(value: any): value is T =>
  typeof value === 'function'

type Booleanish = boolean | 'true' | 'false'
export const dataAttr = (condition: boolean | undefined) =>
  (condition ? '' : undefined) as Booleanish

export const ariaAttr = (condition: boolean | undefined) =>
  condition ? true : undefined

type Args<T extends Function> = T extends (...args: infer R) => any ? R : never

type AnyFunction<T = any> = (...args: Array<T>) => any

export function callAllHandlers<T extends (event: any) => void>(
  ...fns: Array<T | undefined>
) {
  return function func(event: Args<T>[0]) {
    fns.some(fn => {
      fn?.(event)
      return event?.defaultPrevented
    })
  }
}

export function callAll<T extends AnyFunction>(...fns: Array<T | undefined>) {
  return function mergedFn(arg: Args<T>[0]) {
    fns.forEach(fn => {
      fn?.(arg)
    })
  }
}

export const getInitials = (userName: string) => {
  if (userName) {
    return userName
      .split(' ')
      .map(part => (part[0] ? part[0].toUpperCase() : ''))
      .join('')
  } else {
    return userName
  }
}

export const base64urlToBase64 = (base64url: string) => {
  const replaced = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const charsInFinalQuantumNeedPadding = replaced.length % 4
  switch (charsInFinalQuantumNeedPadding) {
    case 0:
      return replaced
    case 1:
      throw new Error(
        'Invalid length of base64url string, cannot pad 1 character to make valid base64'
      )
    case 2:
      return `${replaced}==`
    case 3:
      return `${replaced}=`
    default:
      throw new Error(
        'Impossible paddingRequired value determined for a base64url string'
      )
  }
}

export const stripTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi
  const result = html.replace(regex, '')

  return result
}
