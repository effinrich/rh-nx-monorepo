import {
  FieldRoot,
  Input,
  NativeSelectField,
  styled,
  Text
} from '@redesignhealth/ui'

export const DrawerFormHeader = styled(Text, {
  base: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 'medium',
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

export const DrawerFormSelect = styled(NativeSelectField, {
  base: { _placeholder: { color: 'gray.500' } }
})

export const DrawerFormControl = styled(FieldRoot, {
  base: {
    display: 'flex',
    flexDir: 'column',
    gap: '3px'
  }
})
