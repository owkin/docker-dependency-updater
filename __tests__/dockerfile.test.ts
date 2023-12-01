import {test, expect} from '@jest/globals'
import * as path from 'path'
import {load} from '../src/dockerfile'

test('load alpine dockerfile', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile')
  const dockerfile = await load(dockerfilePath)
  expect(dockerfile.name).toBe('alpine:latest')
})

test('load dockerfile with unsupported package manager', async () => {
  const dockerfilePath = path.join(__dirname, 'data', 'Dockerfile.unsupported')
  await expect(load(dockerfilePath)).rejects.toThrow(
    'Unable to find supported package manager'
  )
}, 10000)
