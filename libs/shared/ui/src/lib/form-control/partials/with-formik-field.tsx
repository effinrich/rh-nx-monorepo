import { Field, Form, Formik } from 'formik'

import { Button, Input } from '../../../index'

import { FieldErrorText, FieldLabel, FieldRoot } from '../form-control'

export function WithFormikField() {
  function validateName(value: string) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (
    <Formik
      initialValues={{ name: 'Sasuke' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
    >
      {props => (
        <Form>
          <Field name="name" validate={validateName}>
            {({
              field,
              form
            }: {
              field: Record<string, unknown>
              form: {
                errors: { name?: string }
                touched: { name?: boolean }
              }
            }) => (
              <FieldRoot invalid={!!form.errors.name && !!form.touched.name}>
                {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
                <FieldLabel>First name</FieldLabel>
                <Input {...field} placeholder="name" />
                {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
                <FieldErrorText>{form.errors.name}</FieldErrorText>
              </FieldRoot>
            )}
          </Field>
          <Button
            mt={4}
            colorPalette="primary"
            loading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}
