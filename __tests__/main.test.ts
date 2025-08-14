import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test} from '@jest/globals'

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
