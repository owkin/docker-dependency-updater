import fs from 'fs'

export function load(dependencies_path: string): Package[] {
  const content = fs.readFileSync(dependencies_path).toString('utf-8')
  return JSON.parse(content)
}

export function save(dependencies_path: string, dependencies: Package[]): void {
  const jsonContent = JSON.stringify(dependencies, null, 2)
  fs.writeFileSync(dependencies_path, jsonContent)
}

export interface Package {
  name: string
  version: string
}
