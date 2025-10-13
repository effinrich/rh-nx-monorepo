---
id: stat
title: Stat
category: 'data-display'
package: '@redesignhealth/ui'
description: As the name implies, the `Stat` component is used to display some statistics.
---

# Stat

Use the `Stat` component to display statistics.

## Import

```js
import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber
} from '@redesignhealth/ui'
```

<div style="display:none">## Example

<iframe src="https://dev-design.redesignhealth.com/storybook/shared-ui/iframe.html?args=&id=components-data-display-stat--default&viewMode=story" width="100%" style="border:1px solid black;"></iframe></div>

## Basic Usage

```jsx
<Stat>
  <StatLabel>Collected Fees</StatLabel>
  <StatNumber>£0.00</StatNumber>
  <StatHelpText>Feb 12 - Feb 28</StatHelpText>
</Stat>
```

## Stat with Indicator

```jsx
<StatGroup>
  <Stat>
    <StatLabel>Sent</StatLabel>
    <StatNumber>345,670</StatNumber>
    <StatHelpText>
      <StatArrow type="increase" />
      23.36%
    </StatHelpText>
  </Stat>

  <Stat>
    <StatLabel>Clicked</StatLabel>
    <StatNumber>45</StatNumber>
    <StatHelpText>
      <StatArrow type="decrease" />
      9.05%
    </StatHelpText>
  </Stat>
</StatGroup>
```
