import path from 'path' // eslint-disable-line import/no-nodejs-modules

export function sanitizePath(inputPath: string): string {
  // Sanitize: reject traversal sequences before any path operation
  if (inputPath.includes('..')) {
    throw new Error(`Path "${inputPath}" contains traversal sequences`)
  }
  const baseDir = path.resolve(process.env.GITHUB_WORKSPACE ?? process.cwd())
  const fullPath = path.normalize(
    path.isAbsolute(inputPath) ? inputPath : path.join(baseDir, inputPath)
  )
  if (fullPath !== baseDir && !fullPath.startsWith(baseDir + path.sep)) {
    throw new Error(`Path "${inputPath}" is outside the workspace`)
  }
  return fullPath
}
