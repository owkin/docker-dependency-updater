import fs from 'fs'

export function load(dependencies_path: string): Package[] {
  const content = fs.readFileSync(dependencies_path).toString('utf-8')
  const jsonContent = JSON.parse(content)
  return packages_from_dict(jsonContent)
}

export function save(dependencies_path: string, dependencies: Package[]): void {
  const jsonContent = JSON.stringify(dependencies, null, 2)
  fs.writeFileSync(dependencies_path, jsonContent)
}

interface StoredJSON {
  name: string
  version: string
}

export class Package {
  name: string
  version: string

  constructor(
    name: string,
    version: string,
    extraFields?: {[key: string]: string}
  ) {
    this.name = name
    this.version = version
    // omit name and version from extra fields to avoid overriding
    delete extraFields?.name
    delete extraFields?.version
    Object.assign(this, extraFields)
  }
}

function packages_from_dict(dict: StoredJSON[]): Package[] {
  const packages: Package[] = []
  for (const storedPackage of dict) {
    packages.push(
      new Package(storedPackage.name, storedPackage.version, {...storedPackage})
    )
  }
  return packages
}
