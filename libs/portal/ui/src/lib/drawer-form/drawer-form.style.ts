import { FormControl, Input, Select, styled, Text } from '@redesignhealth/ui'

export const DrawerFormHeader = styled(Text, {
  base: {
    fontsize: '14px',
    lineheight: '20px',
    fontweight: 'medium',
    margin: '0px',
    color: 'gray.700'
  }
})

export const DrawerFormDescription = styled(Text, {
  base: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 'normal',
    color: 'gray.500'
  }
})

export const DrawerFormInput = styled(Input, {
  base: { _placeholder: { color: 'gray.500' } }
})

export const DrawerFormSelect = styled(Select, {
  base: { _placeholder: { color: 'gray.500' } }
})

export const DrawerFormControl = styled(FormControl, {
  base: {
    display: 'flex',
    flexDir: 'column',
    gap: '3px'
  }
})
