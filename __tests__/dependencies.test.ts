import {save, load} from '../src/dependencies'
import {test, expect, afterEach} from '@jest/globals'
import fs from 'fs'
import os from 'os'
import {mkdtemp} from 'fs/promises'
import * as path from 'path'

const originalWorkspace = process.env.GITHUB_WORKSPACE

afterEach(() => {
  process.env.GITHUB_WORKSPACE = originalWorkspace
})

test('save dependencies', async () => {
  const pkg = {name: 'test', version: 'latest', extra: 'field'}
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-save-dep-'))
  process.env.GITHUB_WORKSPACE = tmpdir
  const outPath = path.join(tmpdir, 'deps.json')
  save(outPath, [pkg])

  const content = fs.readFileSync(outPath).toString()
  const expected = `[
  {
    "name": "test",
    "version": "latest",
    "extra": "field"
  }
]`
  expect(content).toBe(expected)
})

test('save and load dependencies', async () => {
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-load-dep'))
  process.env.GITHUB_WORKSPACE = tmpdir
  const depPath = path.join(tmpdir, 'deps.json')
  const pkg = {name: 'test', version: 'latest', extra: 'field'}

  save(depPath, [pkg])
  const packages = load(depPath)
  expect(packages).toEqual([pkg])
})
