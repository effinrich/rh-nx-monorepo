# forgekit-chakra-react-select

Typed select components built on Chakra UI v3 `Combobox`. The package provides distinct single- and multiple-selection APIs, preserves original option objects at the public boundary, and supports local, async, and creatable data sources.

## Install

```sh
npm install forgekit-chakra-react-select @chakra-ui/react @emotion/react react react-dom
```

Peer requirements:

- `@chakra-ui/react >=3.31.0 <4`
- `@emotion/react >=11`
- React and React DOM 18 or 19

The application must already render a Chakra v3 provider. For a default setup:

```tsx
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function AppProvider({ children }: React.PropsWithChildren) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
```

## Local options

```tsx
import { Combobox } from 'forgekit-chakra-react-select'

const frameworks = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' }
]

<Combobox.Single
  aria-label="Framework"
  source={{ kind: 'local', items: frameworks }}
  getOptionLabel={option => option.name}
  getOptionValue={option => option.id}
  value={framework}
  onChange={setFramework}
/>
```

`onChange` receives the same option object, not Chakra's internal string value. Standard `{ label, value }` options do not need accessors.

## Multiple options

```tsx
<Combobox.Multiple
  source={{ kind: 'local', items: frameworks }}
  getOptionLabel={option => option.name}
  getOptionValue={option => option.id}
  value={selectedFrameworks}
  onChange={setSelectedFrameworks}
  closeOnSelect={false}
/>
```

Selected values render as removable Chakra tags. `Combobox.Multiple` defaults `closeOnSelect` to `false`; `Combobox.Single` defaults it to `true`.

## Async options

```tsx
<Combobox.Single
  source={{
    kind: 'async',
    minQueryLength: 2,
    debounceMs: 250,
    cache: { ttlMs: 300_000, maxEntries: 50 },
    load: async (query, { signal }) => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        {
          signal
        }
      )
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    onError: (error, query) => reportSearchError(error, query)
  }}
  getOptionLabel={option => option.title}
  getOptionValue={option => option.id}
  onChange={setResult}
/>
```

Async behavior is built in:

- requests are debounced;
- superseded requests and unmounted components are aborted;
- monotonically increasing request tokens suppress stale responses;
- only successful responses enter the bounded TTL cache;
- failures preserve the last successful results and render a retry action.

Set `cache: false` to disable caching. `initialItems` supplies options before the minimum query length is reached.

## Creatable options

Creation is explicit so arbitrary domain objects remain type-safe:

```tsx
<Combobox.Multiple
  source={{ kind: 'local', items: tags }}
  creatable={{
    createOption: inputValue => ({ label: inputValue, value: inputValue }),
    isValidInput: inputValue => inputValue.length <= 40,
    formatCreateLabel: inputValue => `Add “${inputValue}”`
  }}
  value={selectedTags}
  onChange={setSelectedTags}
/>
```

## React Hook Form

Pass `value`, `onChange`, `name`, `ref`, and `onBlur` from `Controller`. Keep the form's scalar/domain conversion at the form boundary:

```tsx
<Controller
  control={control}
  name="frameworkId"
  render={({ field, fieldState }) => (
    <Combobox.Single
      ref={field.ref}
      name={field.name}
      source={{ kind: 'local', items: frameworks }}
      getOptionLabel={option => option.name}
      getOptionValue={option => option.id}
      value={frameworks.find(option => option.id === field.value) ?? null}
      onChange={option => field.onChange(option?.id ?? '')}
      onBlur={field.onBlur}
      invalid={fieldState.invalid}
    />
  )}
/>
```

## API

Both components accept:

- `source`: `{ kind: 'local', items, filter? }` or `{ kind: 'async', load, ... }`
- `getOptionLabel`, `getOptionValue`, `isOptionDisabled`
- `creatable`, `renderOption`
- `placeholder`, `noOptionsMessage`, `loadingMessage`, `errorMessage`
- form props: `name`, `ref`, `onBlur`, `required`, `invalid`, `disabled`, `readOnly`
- Chakra presentation props: `size`, `variant`, `colorPalette`, `positioning`
- behavior props: `clearable`, `closeOnSelect`, `openOnClick`, `withinPortal`

`Combobox.Single<Option>` uses `Option | null`. `Combobox.Multiple<Option>` uses `readonly Option[]` for input and emits `Option[]`.

## Migrating from chakra-react-select

| `chakra-react-select`              | ForgeKit replacement                              |
| ---------------------------------- | ------------------------------------------------- |
| `Select`                           | `Combobox.Single`                                 |
| `Select isMulti`                   | `Combobox.Multiple`                               |
| `AsyncSelect loadOptions`          | `source={{ kind: 'async', load }}`                |
| `CreatableSelect`                  | `creatable={{ createOption }}`                    |
| `options`                          | `source={{ kind: 'local', items: options }}`      |
| `isDisabled`                       | `disabled`                                        |
| `isInvalid` / `invalid`            | `invalid`                                         |
| `isLoading`                        | `loading`                                         |
| `isClearable`                      | `clearable`                                       |
| `menuPlacement="top"`              | `positioning={{ placement: 'top' }}`              |
| `onChange(option)`                 | unchanged: receives original option object        |
| `onChange(options)` with `isMulti` | `Combobox.Multiple` emits original option objects |

Replace react-select's generic `isMulti` wrappers with explicit single or multiple components. Grouped options and react-select-specific `styles`, `chakraStyles`, and `components` overrides are intentionally not compatibility APIs; use `renderOption` and Chakra theme recipes instead.

## Accessibility

The package delegates keyboard navigation, ARIA state, focus management, disabled-item behavior, and listbox semantics to Chakra UI/Ark UI. Supply an accessible label using an external `<label>`, `aria-label`, or `aria-labelledby`.

## Workspace commands

```sh
npm exec -- nx run forgekit-chakra-react-select:check-types
npm exec -- nx run forgekit-chakra-react-select:test
npm exec -- nx run forgekit-chakra-react-select:lint
npm exec -- nx run forgekit-chakra-react-select:build
npm exec -- nx run forgekit-chakra-react-select:build-storybook
```

Nx release metadata is configured in `project.json`; publishing uses the built manifest under `dist/libs/forgekit/chakra-react-select`.
