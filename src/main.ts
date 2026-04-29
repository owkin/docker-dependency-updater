import * as core from '@actions/core'
import * as dependencies from './dependencies.js'
import * as dockerfile from './dockerfile.js'

async function run(): Promise<void> {
  try {
    const dockerfilePath = core.getInput('dockerfile')
    const dependenciesPath = core.getInput('dependencies')
    const apply = core.getBooleanInput('apply')

    const image = await dockerfile.load(dockerfilePath)
    const dependenciesInfo = dependencies.load(dependenciesPath)
    const packagesUpdate = dependenciesInfo.map(pkg =>
      image.getLatestVersion(pkg)
    )

    const updatedPackages = await Promise.all(packagesUpdate)
    core.exportVariable('updatedDependencies', updatedPackages)
    if (apply) {
      dependencies.save(dependenciesPath, updatedPackages)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

void run()
