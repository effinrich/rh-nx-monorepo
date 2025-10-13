import { Endpoint, EndpointMethod, Spec } from './types'

export const getEndpoints = (spec: Spec): Endpoint[] => {
  return Object.keys(spec.paths).sort()
}

export const getEndpointMethods = (
  spec: Spec,
  endpoint: Endpoint
): EndpointMethod[] => {
  return Object.keys(spec.paths[endpoint]) as EndpointMethod[]
}

export const getEndpointMethodMetaData = (
  spec: Spec,
  endpoint: Endpoint,
  endpointMethod: EndpointMethod
) => {
  return spec.paths[endpoint][endpointMethod]
}
