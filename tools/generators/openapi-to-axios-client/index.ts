import { readProjectConfiguration, Tree } from '@nx/devkit'
import axios from 'axios'
import { execSync } from 'child_process'
import { Schema, Spec } from './types'
import { apiClassTemplate, apiClassTypesTemplate } from './templates'

export default async function (tree: Tree, schema: Schema) {
  const spec = (await axios.get<Spec>(schema.url)).data
  const projectConfig = readProjectConfiguration(tree, schema.projectName)
  const outputPath = projectConfig.root + schema.location

  execSync(
    `npx openapi-typescript ${schema.url} --output ${
      outputPath + '/paths.d.ts'
    }`
  )

  tree.write(outputPath + '/types.d.ts', apiClassTypesTemplate(schema, spec))

  tree.write(outputPath + '/api.ts', apiClassTemplate(schema, spec))

  // remove instances of optional parameters (e.g. 'parameters?:')
  // it's fine since url params are set to optional always
  const openAPITSFileContents =
    tree.read(outputPath + '/paths.d.ts')?.toString() ?? ''

  tree.write(
    outputPath + '/paths.d.ts',
    openAPITSFileContents.replace(/parameters\?:/gi, 'parameters:')
  )
}
