import {readFileSync, writeFileSync} from 'fs'
import {parse, unparse} from 'papaparse'

export class Package {
  name: string
  version: string
  reason?: string

  constructor(name: string, version: string, reason: string = '') {
    this.name = name
    this.version = version
    this.reason = reason
  }
}

export function load(manifestPath: string): Package[] {
  const content = readFileSync(manifestPath, 'utf-8')
  const parsed = parse(content, {
    header: true,
    skipEmptyLines: true
  })
  return parsed.data.map(
    (row: any) => new Package(row.package, row.version, row.reason)
  )
}

export function save(manifestPath: string, dependencies: Package[]): void {
  const csvContent = unparse(
    dependencies.map(pkg => ({
      package: pkg.name,
      version: pkg.version,
      reason: pkg.reason
    })),
    {
      header: true
    }
  )
  writeFileSync(manifestPath, csvContent)
}
