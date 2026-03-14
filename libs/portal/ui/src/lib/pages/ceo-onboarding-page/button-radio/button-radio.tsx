import {
  Box,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  Text,
  rh
} from '@redesignhealth/ui'

interface ButtonRadioProps {
  value: string
  isChecked: boolean
  title: string
  subtitle?: React.ReactNode
}

const ButtonRadio = ({
  value,
  isChecked,
  title,
  subtitle
}: ButtonRadioProps) => {
  return (
    <RadioGroupItem value={value} asChild>
      <rh.label
        display="flex"
        alignItems="baseline"
        gap={4}
        border="1px solid"
        borderColor={isChecked ? 'brand.600' : 'gray.200'}
        background={isChecked ? 'brand.100' : undefined}
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
