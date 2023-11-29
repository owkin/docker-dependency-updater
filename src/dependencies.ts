import fs from 'fs'
import {factory, Image} from './image'

export function load(dependencies_path: string): [Image, Package[]] {
  const content = fs.readFileSync(dependencies_path).toString('utf-8')
  const jsonContent = JSON.parse(content)
  return [factory(jsonContent.image), packages_from_dict(jsonContent.dependencies)]
}

export function save(dependencies_path: string, image: string, dependencies: Package[]): void {
  const jsonData = {
    image: image,
    dependencies: dependencies
  };
  const jsonContent = JSON.stringify(jsonData, null, 2)
  fs.writeFileSync(dependencies_path, jsonContent)
}

interface StoredJSON {
  name: string
  version: string
  [key: string]: string
}

export class Package {
  name: string
  version: string
  [key: string]: string

  constructor(name: string, version: string, extraFields?: {[key: string]: string}) {
    this.name = name
    this.version = version
    Object.assign(this, extraFields)
  }
}

function packages_from_dict(dict: StoredJSON[]): Package[] {
  const packages: Package[] = []
  for (const storedPackage of dict) {
    packages.push(new Package(storedPackage.name, storedPackage.version, {...storedPackage}))
  }
  return packages
}
