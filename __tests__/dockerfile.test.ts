import {test, expect} from '@jest/globals'
import * as path from 'path'
import {load} from '../src/dockerfile'
import {AlpineImage, DebImage} from '../src/image'

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
  expect(dockerfile).toBeInstanceOf(AlpineImage)
  expect(dockerfile.name).toBe('alpine:latest')
})

test('load debian dockerfile', () => {
  const dockerfilePath = path.join(__dirname, 'data', 'debianDockerfile')
  const dockerfile = load(dockerfilePath)
  expect(dockerfile).toBeInstanceOf(DebImage)
  expect(dockerfile.name).toBe('debian:bullseye-slim')
})

test ('load cuda dockerfile', () => {
  const dockerfilePath = path.join(__dirname, 'data', 'cudaDockerfile')
  const dockerfile = load(dockerfilePath)
  expect(dockerfile).toBeInstanceOf(DebImage)
  expect(dockerfile.name).toBe('nvidia/cuda:11.8.0-runtime-ubuntu22.04')
})
