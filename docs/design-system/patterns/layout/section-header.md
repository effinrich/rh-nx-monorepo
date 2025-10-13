---
id: section-header
category: layout
title: Section Header
package: '@redesignhealth/ui'
description: Section Header is a pattern component for rendering page/view title headers and accepts props for title, givenName, helpText and rightElement.
---

# Section Header

Section Header is a pattern component for rendering page/view title headers and accepts props for title, givenName, helpText and rightElement.

## Import

```js
import { SectionHeader } from '@redesignhealth/ui'
```

## Usage

This is a basic usage example.

```jsx
<SectionHeader title="Welcome to Dashboard" />
```

### With User Name

This is an example with `title` and `givenName` props. When `givenName` is passed, which in this example is "Charlie Bronson", the resulting heading is comma delimited like so:

```
Welcome to Dashboard, Charlie Bronson
```

```jsx
<SectionHeader title="Welcome to Dashboard" givenName="Charlie Bronson" />
```

### With Missing givenName

This is an example in which `givenName` prop is passed, but undefined or null. The assumption is, if passed, the intent is something like "Welcome, `givenName`". So in the case of an undefined `givenName` and a `title` prop of "Welcome", the heading will result in the following output:

```
Welcome to {App Name or Page Name}
```

```jsx
<SectionHeader title="Welcome" givenName={undefined} />
```

### With Help Text

The `helpText` prop will render a small caption under the title with extra detail for the user.

```jsx
<SectionHeader title="Users" helpText="Manage all users here" />
```

### With Right Addon

The `rightElement` prop should be used for rendering other components, which will appear on the far right of the heading. The following example illustrates the use of a `Button` component in the `rightElement` prop.

```jsx
<SectionHeader
  title="Users"
  rightElement={
    <Button as={Link} to="/users/add-user" colorScheme="primary">
      Add User
    </Button>
  }
/>
```
