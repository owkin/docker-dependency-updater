import * as core from '@actions/core'
import * as dependencies from './dependencies'

async function run(): Promise<void> {
  try {
    const dependencies_path = core.getInput('dependencies')
    const apply = core.getBooleanInput('apply')
    const [image, dependencies_info] = dependencies.load(dependencies_path)

    const packages_update = dependencies_info.map(async function (
      installed_pkg
    ) {
      return image.get_latest_version(installed_pkg)
    })

    const updated_packages = await Promise.all(packages_update)
    core.exportVariable('updatedDependencies', updated_packages)
    if (apply) {
      dependencies.save(dependencies_path, image.name, updated_packages)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
