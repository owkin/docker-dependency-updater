import fs from 'fs' // eslint-disable-line import/no-nodejs-modules
import {z} from 'zod'
import {sanitizePath} from './path-utils.js'

const PackageSchema = z
  .object({
    name: z.string(),
    version: z.string(),
    extra: z.string().optional()
  })
  .passthrough()

const PackagesSchema = z.array(PackageSchema)

export type Package = z.infer<typeof PackageSchema>

export function load(dependenciesPath: string): Package[] {
  const content = fs.readFileSync(sanitizePath(dependenciesPath), 'utf-8')
  return PackagesSchema.parse(JSON.parse(content))
}

export function save(dependenciesPath: string, dependencies: Package[]): void {
  const jsonContent = JSON.stringify(dependencies, null, 2)
  fs.writeFileSync(sanitizePath(dependenciesPath), jsonContent)
}
