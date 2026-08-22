import { useForm } from 'react-hook-form'

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputRoot
} from '../number-input'

export function WithReactHookFormNumberInput() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      sales: 12
    }
  })

  const onSubmit = (data: { sales: number }) => {
    // eslint-disable-next-line no-console
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <NumberInputRoot
        name="sales"
        onBlur={() => {
          // eslint-disable-next-line no-console
          console.log('blurred')
        }}
      >
        <NumberInputInput {...register('sales')} />
        <NumberInputControl>
          <NumberInputIncrementTrigger />
          <NumberInputDecrementTrigger />
        </NumberInputControl>
      </NumberInputRoot>
    </form>
  )
}
