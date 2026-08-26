import { forwardRef } from 'react'
import { Option, useGetUsersByRole } from '@redesignhealth/portal/data-assets'
import { printPersonName } from '@redesignhealth/portal/utils'
import { Combobox } from 'forgekit-chakra-react-select'

interface UserOption extends Option {
  isDisabled: boolean
}

interface UserSelectProps {
  onChange(newValue: Option | null): void
  name: string
  value?: Option | null
  onBlur(): void
  invalid?: boolean
}

const UserSelect = forwardRef<HTMLInputElement, UserSelectProps>(
  ({ onChange, name, value, onBlur, invalid }, ref) => {
    const { data, isPending: isLoadingOptions } = useGetUsersByRole(
      'ROLE_OP_CO_USER',
      true,
      2000
    )

    const options: UserOption[] =
      data?.map(p => ({
        value: p.email,
        label: `${printPersonName(p)} (${p.email}) ${
          p.ceoInfo.ceo ? 'already has a profile' : ''
        }`,
        isDisabled: p.ceoInfo.ceo
      })) ?? []

    return (
      <Combobox.Single<UserOption>
        ref={ref}
        onChange={onChange}
        name={name}
        value={value ?? null}
        onBlur={onBlur}
        invalid={invalid}
        clearable={false}
        placeholder="Select a user"
        source={{ kind: 'local', items: options }}
        getOptionValue={option => option.value}
        isOptionDisabled={option => option.isDisabled}
        loading={isLoadingOptions}
      />
    )
  }
)

UserSelect.displayName = 'UserSelect'

export default UserSelect
