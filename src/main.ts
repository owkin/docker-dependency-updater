import * as core from '@actions/core'
import * as dependencies from './dependencies'
import * as dockerfile from './dockerfile'

async function run(): Promise<void> {
  try {
    const dockerfile_path = core.getInput('dockerfile')
    const dependencies_path = core.getInput('dependencies')

    const image = dockerfile.load(dockerfile_path)
    const dependencies_info = dependencies.load(dependencies_path)
    const packages_update = dependencies_info.map(async function (
      installed_pkg
    ) {
      return image.get_latest_version(installed_pkg)
    })

    const updated_packages = await Promise.all(packages_update)
    dependencies.save(dependencies_path, updated_packages)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
