---
id: visually-hidden
category: disclosure
title: Visually Hidden
package: '@redesignhealth/ui'
description: The visually hidden component styles itself so that it’s content is not visible,
but it is available to assistive technologies like screen readers and other text
to speech programs.
---

# Visually Hidden

The visually hidden component styles itself so that it’s content is not visible,
but it is available to assistive technologies like screen readers and other text
to speech programs.

## Installation

```sh
yarn add @redesignhealth/ui

# or

npm i @redesignhealth/ui
```

## Import component

````jsx
import { VisuallyHidden } from '@redesignhealth/ui'

## Basic usage

```jsx
// it renders a `span` by default
<VisuallyHidden>This content will be hidden on screen</VisuallyHidden>

// for visually hidden input fields
<VisuallyHiddenInput type="checkbox" defaultChecked/>
````

## References

- <https://snook.ca/archives/html_and_css/hiding-content-for-accessibility>
- <https://a11yproject.com/posts/how-to-hide-content/>
