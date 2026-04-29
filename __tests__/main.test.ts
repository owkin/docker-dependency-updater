import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test, expect, describe, beforeEach, afterEach} from '@jest/globals'
import {fileURLToPath} from 'url'
import {sanitizePath} from '../src/path-utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_DOCKERFILE'] = path.join(
    __dirname,
    'data',
    'Dockerfile.apk'
  )
  process.env['INPUT_DEPENDENCIES'] = path.join(
    __dirname,
    'data',
    'dependencies.json'
  )
  process.env['INPUT_APPLY'] = 'false'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  cp.execFileSync(np, [ip], options)
})

describe('sanitizePath', () => {
  const originalEnv = process.env.GITHUB_WORKSPACE

  beforeEach(() => {
    process.env.GITHUB_WORKSPACE = '/workspace'
  })

  afterEach(() => {
    process.env.GITHUB_WORKSPACE = originalEnv
  })

  test('accepts a path inside the workspace', () => {
    expect(() => sanitizePath('/workspace/Dockerfile')).not.toThrow()
  })

  test('rejects a path outside the workspace via traversal', () => {
    expect(() => sanitizePath('/workspace/../etc/passwd')).toThrow(
      'traversal sequences'
    )
  })

  test('rejects an absolute path outside the workspace', () => {
    expect(() => sanitizePath('/etc/passwd')).toThrow('outside the workspace')
  })
})
