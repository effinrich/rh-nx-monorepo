import { Schema } from './types'

export const ENDPOINTS_DOC_COMMENT = (schema: Schema) => `\
/**
 * @description
 * Type based on the following OpenAPI spec: ${schema.url}
 *
 * It's used to define the inputs and outputs for each function in {@link ${schema.clientName}}.
 *
 * Each function in {@link ${schema.clientName}} is representative of the HTTP method (\`get\`, \`post\`, etc...) associated with a given endpoint (e.g. \`/random\`).
 *
 * @description
 * {@link Endpoints} has a shape of
 * \`\`\`
 * {
 *  [endpoint]: {
 *    [method]: {
 *      responseData: output
 *      args: inputs
 *    }
 *  }
 * }
 * \`\`\`
 *
 * \`args\` and \`responseData\` are both used to define the inputs and outputs of the associated function in {@link ${schema.clientName}}:
 * - \`responseData\`: the expected shape of the method's response
 * - \`args\`: the expected shape of the method's inputs
 *
 * Both of their types are determined by {@link paths}, which acts as the source of truth for the api's types.
 *
 * @description
 * \`responseData\` is typically the shape associated with a \`200\` response code.
 *
 * @description
 * The \`args\` property contains the same shape as {@link AxiosRequestConfig} except with the following properties overridden:
 * - \`url\`: used to provide values for generating a dynamic endpoint.
 * - \`params\`: used to create search params in the url.
 * - \`data\`: used to provide data to the \`body\` in an HTTP message (typically for mutation methods like \`post\`, \`put\`, etc...).
 *
 * At a minimum, the \`args\` property contains {@link FilteredAxiosRequestConfig}.
 *
 * @description
 * Say we had a dynamic endpoint like \`/random/{randomId}\`. Then we could expect the \`url\` shape to be:
 * \`\`\`
 * {
 *  url: {
 *    randomId: string
 *  }
 * }
 * \`\`\`
 *
 * Say we wanted to pass search params like \`?sort=asc&page=0&size=0&name=John&name=Alex\`. Then we could expect the \`params\` shape to be:
 * \`\`\`
 * {
 *  params: {
 *    sort: 'asc' | 'desc'
 *    page: number
 *    name: Array<string>
 *  }
 * }
 * \`\`\`
 *
 * Say we wanted to mutate the email and/or password of a user. Then we could expect the \`data\` shape to be:
 * \`\`\`
 * {
 *  data: {
 *    email?: string
 *    password?: string
 *  }
 * }
 * \`\`\`
 */`

export const FILTERED_AXIOS_REQUEST_CONFIG_DOC = `\
/**
 * @description
 * {@link AxiosRequestConfig} object type without the following properites:
 * - \`url\`
 * - \`params\`
 * - \`data\`
 * - \`method\`
 */`

export const CLIENT_DOCS = (schema: Schema) => `\
 /**
 * @description
 * Generated client based on the following OpenAPI spec: ${schema.url}
 *
 * {@link ${schema.clientName}} exposes the endpoints and their respective methods as simple functions with typesafe inputs and outputs.
 *
 * Each function is representative of the HTTP method (\`get\`, \`post\`, etc...) associated with a given endpoint (e.g. \`/random\`) from the api.
 *
 * Each function contains the following: (check out {@link Endpoints})
 * - \`args\`: inputs
 * - \`ResponseData\`: output
 *
 * Each function returns \`AxiosResponse<ResponseData>\` (check out {@link AxiosResponse}).
 *
 * Highly recommend using the 'Go to definition\` feature in VSCode with the client.
 *
 * If you use this functionality on anything in the client, you will learn quickly about
 * - how the client is structured
 * - what the arguments should look like for a given function
 * - what the response should look like for a given function
 *
 * @example
 * // create AxiosInstance
 * const apiAxiosInstance = axios.create({
 *  baseURL: 'https://my-fake-api.com',
 *  ... // other axios options you'd like to enter as defaults
 * })
 *
 * // create instance of client
 * const api = new ${schema.clientName}(apiAxiosInstance)
 *
 * // use the client
 * async function example() {
 *  const response = await api['/random'].get({
 *    ... // args associated with \`/random\` + \`get\`
 *  })
 *
 *  console.log(response.data)
 * }
 */
 `
