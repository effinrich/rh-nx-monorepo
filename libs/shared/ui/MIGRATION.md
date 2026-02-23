# Chakra UI v3 Migration Guide

This library is being migrated from Chakra UI v2 to v3.

## Key Changes

### Prop Renaming

- `colorScheme` is now `colorPalette`
- `isDisabled` is now `disabled`
- `isOpen` is now `open`
- `defaultIsOpen` is now `defaultOpen`
- `isInvalid` is now `invalid`
- `isRequired` is now `required`
- `isReadOnly` is now `readOnly`
- `isLoading` is now `loading`
- `isChecked` is now `checked`

### Component Changes

- **Modal** is now **Dialog** (re-exported as Modal for backwards compatibility)
- **Drawer** uses new parts (Root, Backdrop, Positioner, Content, etc.)
- **Tooltip** uses new positioning props (`positioning={{ placement: 'top' }}`) instead of `placement="top"`
- **Stack** uses `gap` instead of `spacing`

### Theming

- Theming now uses `createSystem` and `defineConfig` instead of `extendTheme`.
- New token system with semantic tokens.

## Resources

- [Official Migration Guide](https://chakra-ui.com/docs/get-started/migration)
