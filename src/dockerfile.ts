import * as image from './image'
import fs from 'fs'

export function load(dockerfile: string): image.Image {
  const content = fs.readFileSync(dockerfile).toString('utf-8')
  return extract_docker_image(content)
}

function extract_docker_image(dockerfile_content: string): image.Image {
  let imageName = ''
  const dockerfileLines = dockerfile_content.split('\n')
  for (const line of dockerfileLines) {
    if (line.includes('FROM')) {
      imageName = line.split(' ')[1].trim()
    }
    if (line.includes('apk add') || line.includes('apt-get install')) {
      return new image.Image(imageName)
    }
  }
  throw Error('Unable to extract image from Dockerfile')
}
