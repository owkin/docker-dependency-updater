import {test, expect} from '@jest/globals'
import * as path from 'path'
import { fileURLToPath } from 'url'
import {load} from '../src/dockerfile.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('load alpine dockerfile', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile.apk')
  const dockerfile = await load(dockerfilePath)
  expect(dockerfile.pkgManager).toBe('apk')
  expect(dockerfile.name).toBe('alpine:latest')
}, 10000)

test('load ubuntu dockerfile', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile.apt')
  const dockerfile = await load(dockerfilePath)
  expect(dockerfile.pkgManager).toBe('apt')
  expect(dockerfile.name).toBe('ubuntu:latest')
}, 10000)

test('load dockerfile with unsupported package manager', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile.unsupported')
  await expect(load(dockerfilePath)).rejects.toThrow(
    'Unable to find supported package manager'
  )
}, 10000)

test('load multi stage dockerfile', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile.multi')
  const dockerfile = await load(dockerfilePath)
  expect(dockerfile.pkgManager).toBe('apt')
  expect(dockerfile.name).toBe('ubuntu:latest')
})
