import {Docker, Options} from 'docker-cli-js'
import {Package} from './dependencies'

export class Image {
  name: string
  docker: Docker

  constructor(name: string) {
    this.name = name
    const options = new Options(
      undefined,
      undefined,
      false,
      undefined,
      undefined
    )
    this.docker = new Docker(options)
  }

  async get_latest_version(installed_package: Package): Promise<Package> {
    throw Error(
      `Not implemented can't get latest version of ${installed_package}`
    )
  }
}

export class AlpineImage extends Image {
  async get_latest_version(installed_package: Package): Promise<Package> {
    const response = await this.docker.command(
      `run ${this.name} sh -c "apk update > /dev/null && apk info ${installed_package.name}"`
    )
    const updated_version = remove_prefix(
      response.raw.split(' ')[0],
      `${installed_package.name}-`
    )
    return {...installed_package, version: updated_version}
  }
}

export class DebImage extends Image {
  async get_latest_version(installed_package: Package): Promise<Package> {
    const response = await this.docker.command(
      `run ${this.name} sh -c "apt-get update > /dev/null && apt-cache policy ${installed_package.name}"`
    )
    let updated_version = undefined
    for (const info of response.raw.split('\n')) {
      if (info.includes('Candidate')) {
        updated_version = info.split(':')[1].trim()
        break
      }
    }
    if (updated_version !== undefined) {
      return {...installed_package, version: updated_version}
    }
    throw Error('Unable to extract new version from package infos')
  }
}

export function factory(name: string): Image {
  if (name.includes('alpine')) {
    return new AlpineImage(name)
  }
  if (
    name.includes('debian') ||
    name.includes('bulleye') ||
    name.includes('buster')
  ) {
    return new DebImage(name)
  }
  throw Error('Unsupported image type')
}

function remove_prefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text.substring(prefix.length)
  }
  return text
}
