const variants = {
  menu: () => ({
    borderRadius: 'lg',
    _hover: {
      textDecoration: 'none',
      bg: 'bg-subtle'
    }
  })
}

export default {
  baseStyle: {
    color: 'primary.600',
    textDecoration: 'underline'
  },
  variants
}
