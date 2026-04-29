import {Docker, Options} from 'docker-cli-js'
import {Package} from './dependencies.js'
import {z} from 'zod'

export type PackageManagerName = 'apk' | 'apt'

interface PackageManager {
  name: PackageManagerName
  command: string
}

const DockerResponse = z.object({
  raw: z.string()
})

const packageManagers: PackageManager[] = [
  {command: 'apk --version', name: 'apk'},
  {command: 'apt-get --version', name: 'apt'}
]

export class Image {
  name: string
  pkgManager: PackageManagerName | null
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
  async initPackageManager(): Promise<void> {
    for (const manager of packageManagers) {
      try {
        await this.docker.command(
          `run --user root ${this.name} sh -c "${manager.command} > /dev/null"`
        )
        this.pkgManager = manager.name
        return
      } catch {
        // Continue to the next iteration if the current one fails
      }
    }
    throw new Error('Unable to find supported package manager')
  }

  async getLatestVersion(installedPackage: Package): Promise<Package> {
    switch (this.pkgManager) {
      case 'apk':
        return this.getLatestVersionApk(installedPackage)
      case 'apt':
        return this.getLatestVersionApt(installedPackage)
      default:
        throw new Error('Unable to get package manager')
    }
  }

  async getLatestVersionApk(installedPackage: Package): Promise<Package> {
    const response = DockerResponse.parse(
      await this.docker.command(
        `run --user root ${this.name} sh -c "apk update > /dev/null && apk info ${installedPackage.name}"`
      )
    )
    const updatedVersion = removePrefix(
      response.raw.split(' ')[0],
      `${installedPackage.name}-`
    )
    return {...installedPackage, version: updatedVersion}
  }

  async getLatestVersionApt(installedPackage: Package): Promise<Package> {
    const response = DockerResponse.parse(
      await this.docker.command(
        `run --user root ${this.name} sh -c "apt-get update > /dev/null && apt-cache policy ${installedPackage.name}"`
      )
    )
    const candidateLine = response.raw
      .split('\n')
      .find(line => line.includes('Candidate'))
    if (!candidateLine)
      throw new Error('Unable to extract new version from package infos')
    // must handle case of multiple : in the line i.e. Candidate: 1:8.9p1-3ubuntu0.4
    const updatedVersion = candidateLine.split(':').slice(1).join(':').trim()
    return {...installedPackage, version: updatedVersion}
  }
}

function removePrefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text.substring(prefix.length)
  }
  return text
}
