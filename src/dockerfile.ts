import * as image from './image.js'
import fs from 'fs' // eslint-disable-line import/no-nodejs-modules
import {sanitizePath} from './path-utils.js'

export async function load(dockerfile: string): Promise<image.Image> {
  const content = fs.readFileSync(sanitizePath(dockerfile), 'utf-8')
  const extractedImage = extractDockerImage(content)

  await extractedImage.initPackageManager()

  return extractedImage
}

function extractDockerImage(dockerfileContent: string): image.Image {
  let imageName = ''
  const dockerfileLines = dockerfileContent.split('\n')
  for (const line of dockerfileLines) {
    if (line.includes('FROM')) {
      imageName = line.split(' ')[1].trim()
      break
    }
  }
  return new image.Image(imageName)
}
