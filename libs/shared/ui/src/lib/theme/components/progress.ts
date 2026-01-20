const baseStyle = {
  track: {
    borderRadius: 'base'
  }
}

const variants = {
  solid: {
    track: {
      bg: 'bg-muted'
    }
  },
  'on-accent': {
    track: {
      bg: 'transparent'
    },
    filledTrack: {
      bg: 'primary.50'
    }
  }
}

const defaultProps = {
  colorPalette: 'primary',
  variant: 'solid'
}

export default {
  variants,
  baseStyle,
  defaultProps
}
