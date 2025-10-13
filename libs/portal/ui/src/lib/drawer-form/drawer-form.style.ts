import { FormControl, Input, Select, styled, Text } from '@redesignhealth/ui'

export const DrawerFormHeader = styled(Text, {
  baseStyle: {
    fontsize: '14px',
    lineheight: '20px',
    fontweight: 'medium',
    margin: '0px',
    color: 'gray.700'
  }
})

export const DrawerFormDescription = styled(Text, {
  baseStyle: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 'normal',
    color: 'gray.500'
  }
})

export const DrawerFormInput = styled(Input, {
  baseStyle: { _placeholder: { color: 'gray.500' } }
})

export const DrawerFormSelect = styled(Select, {
  baseStyle: { _placeholder: { color: 'gray.500' } }
})

export const DrawerFormControl = styled(FormControl, {
  baseStyle: {
    display: 'flex',
    flexDir: 'column',
    gap: '3px'
  }
})
