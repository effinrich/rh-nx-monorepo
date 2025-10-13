---
id: stat-card
title: StatCard
category: 'data-display'
package: '@redesignhealth/ui'
description: The `StatCard` component is used to display Stat components in a variety of conigurations and styles per use-case.
---

# Stat Card

The `StatCard` component is used to display Stat components in a variety of conigurations and styles per use-case.

## Import

```js
import { StatCard } from '@redesignhealth/ui'
```

### Basic Usage

```jsx
<StatCard title="Total OpCos" stat="228" onClick={handleOnClick} />
```

### With Help Text

```jsx
<StatCard
  title="Total OpCos"
  stat="228"
  onClick={handleOnClick}
  helpText="23.36%"
  arrowType="increase" // increase | decrease
/>
```

### With No Footer

```jsx
<StatCard title="Total OpCos" stat="228" noFooter="true" />
```
