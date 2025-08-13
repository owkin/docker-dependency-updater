import fs from 'fs' // eslint-disable-line import/no-nodejs-modules
import { z } from 'zod'

const PackageSchema = z.object({
  name: z.string(),
  version: z.string()
})

const PackagesSchema = z.array(PackageSchema)

export type Package = z.infer<typeof PackageSchema>

export function load(dependencies_path: string): Package[] {
  const content = fs.readFileSync(dependencies_path).toString('utf-8')
  return PackagesSchema.parse(JSON.parse(content))
}

export function save(dependencies_path: string, dependencies: Package[]): void {
  const jsonContent = JSON.stringify(dependencies, null, 2)
  fs.writeFileSync(dependencies_path, jsonContent)
}
