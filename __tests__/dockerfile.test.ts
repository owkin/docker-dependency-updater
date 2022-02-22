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
