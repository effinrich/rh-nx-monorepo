import {
  Box,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  rh,
  Text
} from '@redesignhealth/ui'

interface ButtonRadioProps {
  value: string
  checked: boolean
  title: string
  subtitle?: React.ReactNode
}

const ButtonRadio = ({ value, checked, title, subtitle }: ButtonRadioProps) => {
  return (
    <RadioGroupItem value={value} asChild>
      <rh.label
        display="flex"
        alignItems="baseline"
        gap={4}
        border="1px solid"
        borderColor={checked ? 'brand.600' : 'gray.200'}
        background={checked ? 'brand.100' : undefined}
        rounded="md"
        py={4}
        px={6}
        cursor="pointer"
      >
        <RadioGroupItemHiddenInput />
        <RadioGroupItemControl />
        <Box>
          <Text as="b" fontSize="md">
            {title}
          </Text>
          {subtitle && <Text fontWeight="normal">{subtitle}</Text>}
        </Box>
      </rh.label>
    </RadioGroupItem>
  )
}

export default ButtonRadio
