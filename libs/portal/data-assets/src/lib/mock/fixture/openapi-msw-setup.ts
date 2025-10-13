import { fullFormats } from 'ajv-formats/dist/formats'
import { OpenAPIBackend } from 'openapi-backend'

// eslint-disable-next-line @nx/enforce-module-boundaries
import companyApiContractDefinition from '../../../../../../../contracts/company-api/v1/company-api.json?raw'
export const api = new OpenAPIBackend({
  definition: companyApiContractDefinition,
  ajvOpts: {
    formats: fullFormats
  },
  quick: true
})

api.init()
