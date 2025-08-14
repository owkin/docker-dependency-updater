import * as image from './image'
import fs from 'fs' // eslint-disable-line import/no-nodejs-modules

export async function load(dockerfile: string): Promise<image.Image> {
  const content = fs.readFileSync(dockerfile).toString('utf-8')
  const extractedImage = extract_docker_image(content)

  await extractedImage.init_package_manager()

  return extractedImage
}

function extract_docker_image(dockerfile_content: string): image.Image {
  let imageName = ''
  const dockerfileLines = dockerfile_content.split('\n')
  for (const line of dockerfileLines) {
    if (line.includes('FROM')) {
      imageName = line.split(' ')[1].trim()
      break
    }
  }
  return new image.Image(imageName)
}
