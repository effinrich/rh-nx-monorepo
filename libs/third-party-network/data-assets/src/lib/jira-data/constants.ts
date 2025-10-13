import { z } from 'zod'

const optionalStringSchema = z.string().optional()

export const dataSheetSchema = z.array(
  z
    .object({
      'Issue Type': z.enum(['Epic', 'Introduction', 'Contract']).optional(),
      Key: optionalStringSchema,
      parent: optionalStringSchema,
      'Epic Name': optionalStringSchema,
      Created: optionalStringSchema,
      Bio: optionalStringSchema,
      'RH Advise - Category': optionalStringSchema,
      'RH Advise-Tags': optionalStringSchema,
      'RH Advise - Contract Status': optionalStringSchema,
      'RH Advise - Advisor Tier': optionalStringSchema,
      'RH Advise - Current Organization': optionalStringSchema,
      'RH Advise - Current Role': optionalStringSchema,
      'RH Advise - Link to CV': optionalStringSchema,
      Website: optionalStringSchema,
      'Profile Link': optionalStringSchema,
      'Referred Party': optionalStringSchema,
      'Created Date': optionalStringSchema,
      'RH Employee Name': optionalStringSchema,
      'RH Employee Email': optionalStringSchema,
      'Additional Emails': optionalStringSchema,
      'OpCo/NewCo Name': optionalStringSchema,
      'RH Advise - OpCo/Concept Description': optionalStringSchema,
      Rating: z.coerce.number().optional(),
      'Area of Expertise - form': optionalStringSchema,
      'T1 Taxonomy Tag': optionalStringSchema,
      'T2 Taxonomy Tag': optionalStringSchema,
      'T3 Taxonomy Tag': optionalStringSchema,
      'Contract End Date': optionalStringSchema,
      'Contract Start Date': optionalStringSchema,
      'Previous Organization and Role': optionalStringSchema,
      'OpCo Conflicts': optionalStringSchema,
      'Number of OpCo Calls': optionalStringSchema,
      'Introduction date': optionalStringSchema
    })
    .transform(data => {
      const splitter = (value?: string) =>
        value
          ?.split(';')
          ?.filter(v => Boolean(v))
          ?.map(v => v.split('_').join(' '))

      return {
        ...data,
        'RH Advise - Category': splitter(data['RH Advise - Category']),
        'RH Advise-Tags': splitter(data['RH Advise-Tags']),
        'T1 Taxonomy Tag': data['T1 Taxonomy Tag']?.split('_').join(' '),
        'T2 Taxonomy Tag': data['T2 Taxonomy Tag']?.split('_').join(' '),
        'T3 Taxonomy Tag': data['T3 Taxonomy Tag']?.split('_').join(' ')
      }
    })
)
