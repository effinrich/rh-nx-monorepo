import { Option, useGetUsersByRole } from '@redesignhealth/portal/data-assets'
import { printPersonName } from '@redesignhealth/portal/utils'
import { Select } from 'chakra-react-select'

interface UserSelectProps {
  onChange(newValue: Option): void
  name: string
  value?: Option
  onBlur(): void
}

const UserSelect = ({ onChange, name, value, onBlur }: UserSelectProps) => {
  const { data, isPending: isLoadingOptions } = useGetUsersByRole(
    'ROLE_OP_CO_USER',
    true,
    2000
  )

  return (
    <Select
      onChange={newValue => onChange(newValue as Option)}
      name={name}
      value={value}
      onBlur={onBlur}
      placeholder="Select a user"
      options={data?.map(p => ({
        value: p.email,
        label: `${printPersonName(p)} (${p.email}) ${
          p.ceoInfo.ceo ? 'already has a profile' : ''
        }`,
        isDisabled: p.ceoInfo.ceo
      }))}
      isLoading={isLoadingOptions}
    />
  )
}

export default UserSelect
