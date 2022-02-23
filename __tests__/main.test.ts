import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test, expect} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_DOCKERFILE'] = path.join(__dirname, 'data', 'Dockerfile')
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
  const output = cp.execFileSync(np, [ip], options).toString()
  expect(output).toContain(
    '[{"name":"git","version":"2.34.1-r0"},{"name":"make","version":"4.3-r0"},{"name":"protoc","version":"3.18.1-r1"},{"name":"protobuf-dev","version":"3.18.1-r1"}]'
  )
})
