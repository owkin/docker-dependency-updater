import {save, Package, load} from '../src/dependencies'
import {test, expect} from '@jest/globals'
import fs from 'fs'
import os from 'os'
import {mkdtemp} from 'fs/promises'
import * as path from 'path'

test('save dependencies', async () => {
  const pkg = {name: 'test', version: 'latest'}
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-save-dep-'))
  const outPath = path.join(tmpdir, 'deps.json')
  save(outPath, [pkg])

  const content = fs.readFileSync(outPath).toString()
  const expected = `[
  {
    "name": "test",
    "version": "latest"
  }
]`
  expect(content).toBe(expected)
})

test('save and load dependencies', async () => {
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-load-dep'))
  const depPath = path.join(tmpdir, 'deps.json')
  const pkg = {name: 'test', version: 'latest'}

  save(depPath, [pkg])
  const packages = load(depPath)
  expect(packages).toEqual([pkg])
})
