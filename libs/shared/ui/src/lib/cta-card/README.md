---
id: ctacard
title: CtaCard
category: 'data-display'
package: '@redesignhealth/ui'
description: The `CtaCard` component is used to display a CTA and associated content to inform the user of each CTA's purpose.
---

# CTA Card

## Import

```js
import { CtaCard } from '@redesignhealth/ui'
```

### Basic Usage

```jsx
<CtaCard
  body="Set up services, answer questionnaires, and assign users."
  icon={OpCoIcon}
  onClick={handleOnClick}
  to="/new-path"
/>
```

### With Help Text

```jsx
<CtaCard
  body="Set up services, answer questionnaires, and assign users."
  icon={OpCoIcon}
  onClick={handleOnClick}
  to="/new-path"
  helpText="Text below the CTA to further help the user"
/>
```
