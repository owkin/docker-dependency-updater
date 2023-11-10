import * as core from '@actions/core'
import * as dependencies from './dependencies'
import * as dockerfile from './dockerfile'
import * as manifest from './manifest'

async function run(): Promise<void> {
  try {
    const dockerfile_path = core.getInput('dockerfile')
    const apply = core.getBooleanInput('apply')
    const dependencies_path = core.getInput('dependencies')
    const manifest_path = core.getInput('manifest')

    const image = dockerfile.load(dockerfile_path)
    let updated_packages: dependencies.Package[] = []
    let updated_manifest: manifest.Package[] = []

    if (dependencies_path) {
      const dependencies_info = dependencies.load(dependencies_path)
      const packages_update = dependencies_info.map(async function (
        installed_pkg
      ) {
        return image.get_latest_version(installed_pkg)
      })
      updated_packages = await Promise.all(packages_update)
      core.exportVariable('updatedDependencies', updated_packages)
    }

    if (manifest_path) {
      console.log('manifest_path', manifest_path)
      const manifestInfo = manifest.load(manifest_path)
      console.log('manifestInfo', manifestInfo)
      const manifest_update = manifestInfo.map(async function (installedPkg) {
        console.log('installedPkg', installedPkg)
        const pkg = new dependencies.Package(installedPkg.name, installedPkg.version)
        console.log('pkg', pkg)
        return image.get_latest_version(pkg)
      })
      console.log('manifest_update', manifest_update)
      updated_manifest = await Promise.all(manifest_update)
      core.exportVariable('updatedManifest', updated_manifest)
    }
    if (apply) {
      if (dependencies_path) {
        ;('save dependencies')
        dependencies.save(dependencies_path, updated_packages)
      }
      if (manifest_path) {
        manifest.save(manifest_path, updated_manifest)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
