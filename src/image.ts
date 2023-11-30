import {Docker, Options} from 'docker-cli-js'
import {Package} from './dependencies'

export type PackageManager = 'apk' | 'apt-get'

export class Image {
  name: string
  pkgManager: PackageManager | null
  docker: Docker

  constructor(name: string) {
    this.name = name
    this.pkgManager = null
    const options = new Options(
      undefined,
      undefined,
      false,
      undefined,
      undefined
    )
    this.docker = new Docker(options)
  }

  async init_package_manager(): Promise<void> {
    try {
      await this.docker.command(`run ${this.name} sh -c "apk --version > /dev/null"`)
      this.pkgManager = "apk"
    } catch (error) {
      this.pkgManager = "apt-get"
    }
  }

  async get_latest_version(installed_package: Package): Promise<Package> {
    switch (this.pkgManager) {
      case "apk":
        return this.get_latest_version_apk(installed_package)
      case "apt-get":
        return this.get_latest_version_apt(installed_package)
      default:
        throw Error('Unable to get package manager')
    }
  }

  async get_latest_version_apk(installed_package: Package): Promise<Package> {
      const response = await this.docker.command(
        `run ${this.name} sh -c "apk update > /dev/null && apk info ${installed_package.name}"`
      )
      const updated_version = remove_prefix(
        response.raw.split(' ')[0],
        `${installed_package.name}-`
      )
      return {...installed_package, version: updated_version}
  }

  async get_latest_version_apt(installed_package: Package): Promise<Package> {
    const response = await this.docker.command(
      `run ${this.name} sh -c "apt-get update > /dev/null && apt-cache policy ${installed_package.name}"`
    )
    let updated_version = undefined
    for (const info of response.raw.split('\n')) {
      if (info.includes('Candidate')) {
        // must handle case of multiple : in the line i.e. Candidate: 1:8.9p1-3ubuntu0.4
        updated_version = info.split(':').slice(1).join(':').trim()
        break
      }
    }
    if (updated_version !== undefined) {
      return {...installed_package, version: updated_version}
    }
    throw Error('Unable to extract new version from package infos')
  }
}


function remove_prefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text.substring(prefix.length)
  }
  return text
}
