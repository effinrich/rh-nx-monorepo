import { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom'

declare module 'react-router-dom' {
  export declare function useLoaderData<
    TFunction extends (args: LoaderFunctionArgs) => unknown
  >(): Exclude<Awaited<ReturnType<TFunction>>, Response>

  export declare function useActionData<
    TFunction extends (args: ActionFunctionArgs) => unknown
  >(): Exclude<Awaited<ReturnType<TFunction>>, Response>

  export declare function useRouteLoaderData<
    TFunction extends (args: LoaderFunctionArgs) => unknown
  >(routeId: string): Exclude<Awaited<ReturnType<TFunction>>, Response>

  export declare function useFetcher<
    TFunction extends (args: ActionFunctionArgs) => unknown
  >(): FetcherWithComponents<Exclude<Awaited<ReturnType<TFunction>>, Response>>
}
