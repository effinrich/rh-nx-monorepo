---
id: alert
category: feedback
title: Alert
package: '@redesignhealth/ui'
description: Alerts are used to communicate a state that affects a system, feature or page.
---

# Alert

Use the `Alert` component to communicate a state that affects a system, feature or page.

## Import

Redesign UI exports 4 alert related components.

- `Alert`: The wrapper for alert components.
- `AlertIcon`: The visual icon for the alert that changes based on the `status`
  prop.
- `AlertTitle`: The title of the alert to be announced by screen readers.
- `AlertDescription`: The description of the alert to be announced by screen
  readers.

```js
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-feedback-alert--basic&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Usage

```jsx
<Alert status="error">
  <AlertIcon />
  <AlertTitle>Your browser is outdated!</AlertTitle>
  <AlertDescription>Your Redesign experience may be degraded.</AlertDescription>
</Alert>
```

### Status

Change the status of the alerts by passing the `status` prop. This affects the
color scheme and icon used. Alert supports `error`, `success`, `warning`, and
`info` statuses.

```jsx
<Stack spacing={3}>
  <Alert status="error">
    <AlertIcon />
    There was an error processing your request
  </Alert>

  <Alert status="success">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status="warning">
    <AlertIcon />
    Seems your account is about expire, upgrade now
  </Alert>

  <Alert status="info">
    <AlertIcon />
    Platform Portal going live on...soon? Get ready!
  </Alert>
</Stack>
```

### Variant

`Alert` has 4 variant styles you can use. Pass the `variant` prop and use either
`subtle`, `solid`, `left-accent` or `top-accent`.

```jsx
<Stack spacing={3}>
  <Alert status="success" variant="subtle">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status="success" variant="solid">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status="success" variant="left-accent">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>

  <Alert status="success" variant="top-accent">
    <AlertIcon />
    Data uploaded to the server. Fire on!
  </Alert>
</Stack>
```

### Composition

`Alert` ships with smaller components to allow for flexibility in creating all
kinds of layouts. Here's an example of a custom alert style and layout:

```jsx
<Alert
  status="success"
  variant="subtle"
  flexDirection="column"
  alignItems="center"
  justifyContent="center"
  textAlign="center"
  height="200px"
>
  <AlertIcon boxSize="40px" mr={0} />
  <AlertTitle mt={4} mb={1} fontSize="lg">
    Application submitted!
  </AlertTitle>
  <AlertDescription maxWidth="sm">
    Thanks for submitting your application. Our team will get back to you soon.
  </AlertDescription>
</Alert>
```

`Alert` can also incorporate other Redesign components. Here's an example of an
alert with wrapping description text and the `CloseButton` component with simple
close functionality:

```jsx
function CompExample() {
  const {
    isOpen: isVisible,
    onClose,
    onOpen
  } = useDisclosure({ defaultIsOpen: true })

  return isVisible ? (
    <Alert status="success">
      <AlertIcon />
      <Box>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your application has been received. We will review your application
          and respond within the next 48 hours.
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  ) : (
    <Button onClick={onOpen}>Show Alert</Button>
  )
}
```
