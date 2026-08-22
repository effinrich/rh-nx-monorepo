import { SubmitHandler, useForm } from 'react-hook-form'

import { Switch } from '../switch'

export function WithReactHookFormSwitch() {
  const defaultValues = {
    name: 'Hello',
    boolean: true,
    test: true
  }

  const { handleSubmit, register } = useForm({
    defaultValues
  })

  const onSubmit: SubmitHandler<{
    name: string
    boolean: boolean
    test: boolean
  }> = values => {
    alert(JSON.stringify(values, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="name" {...register('name')} />
      <Switch {...register('boolean')} />
      <button type="submit">Submit</button>
    </form>
  )
}
