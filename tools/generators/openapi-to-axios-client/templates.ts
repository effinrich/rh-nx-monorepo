import {
  CLIENT_DOCS,
  ENDPOINTS_DOC_COMMENT,
  FILTERED_AXIOS_REQUEST_CONFIG_DOC
} from './constants'
import {
  Endpoint,
  EndpointMethod,
  EndpointMethodMetaData,
  Schema,
  Spec
} from './types'
import {
  getEndpointMethodMetaData,
  getEndpointMethods,
  getEndpoints
} from './utils'

export const apiClassTypesTemplate = (schema: Schema, spec: Spec) => {
  const parseEndpoint = (endpoint: Endpoint) => {
    const endpointMethods = getEndpointMethods(spec, endpoint)
      .map(endpointMethod => parseEndpointMethod(endpoint, endpointMethod))
      .join('\n')

    return `\
      '${endpoint}': {
        ${endpointMethods}
      }
    `
  }

  const parseEndpointMethod = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod
  ) => {
    return `\
      ${endpointMethod}: {
        responseData: ${parseResponseDataType(endpoint, endpointMethod)},
        args: ${parseArgsType(endpoint, endpointMethod)}
      }
    `
  }

  const parseResponseDataType = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod
  ) => {
    const { responses } = getEndpointMethodMetaData(
      spec,
      endpoint,
      endpointMethod
    )

    if (!responses) throw new Error('Schema has no responses')

    const successCodes = Object.keys(responses)
      .filter(c => parseInt(c) < 300)
      .sort()

    const successCode = successCodes?.[0] ?? '200'

    if (!(successCode in responses))
      throw new Error('Schema has no success code')

    const contentTypes = Object.keys(responses[successCode].content ?? {})
    const contentType = contentTypes?.[0]

    if (!contentType) return 'undefined'

    return `paths['${endpoint}']['${endpointMethod}']['responses'][${successCode}]['content']['${contentType}']`
  }

  const parseArgsType = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod
  ) => {
    const { parameters, requestBody } = getEndpointMethodMetaData(
      spec,
      endpoint,
      endpointMethod
    )

    const urlArgs = parseURLArgs(endpoint, endpointMethod, parameters)
    const paramsArgs = parseParamsArgs(endpoint, endpointMethod, parameters)
    const dataArgs = parseDataArgs(requestBody)

    if (!urlArgs && !paramsArgs && !dataArgs)
      return `FilteredAxiosRequestConfig`

    return `FilteredAxiosRequestConfig & {
      ${urlArgs} ${paramsArgs} ${dataArgs}
    }`
  }

  const parseURLArgs = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod,
    parameters?: EndpointMethodMetaData['parameters']
  ) => {
    const pathParams = Object.values(parameters ?? {}).filter(
      p => p.in === 'path'
    )

    return pathParams.length > 0
      ? `url: paths['${endpoint}']['${endpointMethod}']['parameters']['path'];`
      : ''
  }

  const parseParamsArgs = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod,
    parameters?: EndpointMethodMetaData['parameters']
  ) => {
    const queryParams = Object.values(parameters ?? {}).filter(
      p => p.in === 'query'
    )

    return queryParams.length > 0
      ? `params?: paths['${endpoint}']['${endpointMethod}']['parameters']['query'];`
      : ''
  }

  const parseDataArgs = (
    requestBody?: EndpointMethodMetaData['requestBody']
  ) => {
    if (!requestBody) return ''

    const ref = requestBody.content['application/json'].schema.$ref
    const componentSchemaName = ref.replace('#', '').split('/').at(-1)

    return `data: components['schemas']['${componentSchemaName}'];`
  }

  const endpoints = getEndpoints(spec).map(parseEndpoint).join('\n')

  return `\
    /**
    * This file was auto-generated.
    * Do not make direct changes to the file.
    */
    import { AxiosRequestConfig } from 'axios'

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import { CompanyAPI } from './api'
    import { components, paths } from './paths'

    ${ENDPOINTS_DOC_COMMENT(schema)}
    type Endpoints = {
      ${endpoints}
    }

    ${FILTERED_AXIOS_REQUEST_CONFIG_DOC}
    type FilteredAxiosRequestConfig = Omit<AxiosRequestConfig, 'url' | 'params' | 'data' | 'method'>
  `
}

export const apiClassTemplate = (schema: Schema, spec: Spec) => {
  const parseEndpoint = (endpoint: Endpoint) => {
    const endpointMethods = getEndpointMethods(spec, endpoint)
      .map(endpointMethod => parseEndpointMethod(endpoint, endpointMethod))
      .join('\n\n')

    return `\
      '${endpoint}' = {
        ${endpointMethods}
      }
    `
  }

  const parseEndpointMethod = (
    endpoint: Endpoint,
    endpointMethod: EndpointMethod
  ) => {
    return `\
      '${endpointMethod}': (args: Endpoints['${endpoint}']['${endpointMethod}']['args']) => {
        type ResponseData = Endpoints['${endpoint}']['${endpointMethod}']['responseData']

        return this.#axiosInstance<ResponseData>({
          ...(args as any),
          url: \`${parseURL(endpoint)}\`,
          method: '${endpointMethod}'
        })
      },
    `
  }

  const parseURL = (endpoint: Endpoint) => {
    if (!endpoint.includes('{')) return endpoint

    return endpoint
      .split('/')
      .map(path => {
        if (!path.startsWith('{')) return path

        return `\${args.url.${path.replace('{', '').replace('}', '')}}`
      })
      .join('/')
  }

  const endpoints = getEndpoints(spec).map(parseEndpoint).join('\n')

  return `\
    /**
    * This file was auto-generated.
    * Do not make direct changes to the file.
    */
    import { AxiosInstance, AxiosResponse } from 'axios'

    import { Endpoints } from './types'

    ${CLIENT_DOCS(schema)}
    export class ${schema.clientName} {
      #axiosInstance: AxiosInstance

      constructor(axiosInstance: AxiosInstance) {
        this.#axiosInstance = axiosInstance
      }

      ${endpoints}
    }
  `
}
