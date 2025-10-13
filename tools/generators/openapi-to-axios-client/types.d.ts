import { Method } from 'axios'

export type Schema = {
  clientName: string
  location: string
  projectName: string
  url: string
}

export type Spec = {
  paths: {
    [endpoint: Endpoint]: {
      [method in EndpointMethod]: EndpointMethodMetaData
    }
  }
}

export type Endpoint = string
export type EndpointMethod = Lowercase<Method>
export type EndpointMethodMetaData = {
  parameters?: Parameters
  requestBody?: RequestBody
  responses?: Responses
}

export type Parameters = {
  [index: number]: {
    name: string
    in: 'path' | 'query'
    required: boolean
    schema: any
  }
}

export type RequestBody = {
  content: {
    'application/json': {
      schema: { $ref: string }
    }
  }
}

export type Responses = {
  [HTTPStatusCode: string]: {
    description: string
    content?: { [contentType: string]: { schema: { $ref: string } } }
  }
}
