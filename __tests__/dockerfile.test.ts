import {test, expect} from '@jest/globals'
import * as path from 'path'
import {load} from '../src/dockerfile'

test('load invalid dockerfile', () => {
  let dockerfilePath = path.join(__dirname, 'data', 'InvalidDockerfile')
  function loadInvalid() {
    load(dockerfilePath)
  }
  expect(loadInvalid).toThrowError('Unable to extract image from Dockerfile')
})

test('load alpine dockerfile', () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile')
  const dockerfile = load(dockerfilePath)
  expect(dockerfile.name).toBe('alpine:latest')
})
