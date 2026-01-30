---
description: Chakra UI v3 Development Rules
globs: "*.tsx"
alwaysApply: false
---

### Package Changes

# Removed Packages

- Remove @emotion/styled and framer-motion dependencies
- Icons: Use lucide-react or react-icons instead of @chakra-ui/icons
- Hooks: Use react-use or usehooks-ts instead of @chakra-ui/hooks
- Next.js: Use asChild prop instead of @chakra-ui/next-js package

### Import Sources

Always use correct import sources:

# From @chakra-ui/react:

Alert, Avatar, Button, Card, Field, Table, Input, NativeSelect, Tabs, Textarea,
Separator, useDisclosure, Box, Flex, Stack, HStack, VStack, Text, Heading, Icon

# From components/ui (relative imports):

Provider, Toaster, ColorModeProvider, Tooltip, PasswordInput

## Prop Name Rules

### Boolean Props

- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isInvalid` → `invalid`
- `isRequired` → `required`
- `isActive` → `data-active`
- `isLoading` → `loading`
- `isChecked` → `checked`
- `isIndeterminate` → `indeterminate`

### Style Props

- `colorScheme` → `colorPalette`
- `spacing` → `gap`
- `noOfLines` → `lineClamp`
- `truncated` → `truncate`
- `thickness` → `borderWidth`
- `speed` → `animationDuration`

### Component-Specific

- Divider → Separator
- Modal → Dialog
- Collapse → Collapsible
- Tags → Badge
- useToast → toaster.create()

## Style System Rules

### Nested Styles

```tsx
// ❌ Old v2
<Box sx={{ svg: { color: "red.500" } }} />

// ✅ New v3 (the & is required)
<Box css={{ "& svg": { color: "red.500" } }} />
```

### Gradients

```tsx
// ❌ Old v2
<Box bgGradient="linear(to-r, red.200, pink.500)" />

// ✅ New v3
<Box bgGradient="to-r" gradientFrom="red.200" gradientTo="pink.500" />
```

### Theme Access

```tsx
// ❌ Old v2
const theme = useTheme()
const gray400 = theme.colors.gray["400"]

// ✅ New v3
const system = useChakra()
const gray400 = system.token("colors.gray.400")
```
