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

test('unknown keys in dependency file are preserved after load and save', async () => {
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-load-dep-unknown'))
  process.env.GITHUB_WORKSPACE = tmpdir
  const depPath = path.join(tmpdir, 'deps.json')

  // Simulate a pre-existing file written by the user (not by this action)
  const rawContent = `[
  {
    "name": "git",
    "version": "2.34.1-r0",
    "reason": "security patch"
  }
]`
  fs.writeFileSync(depPath, rawContent)

  // Simulate what the action does: load, (optionally update version), save
  const packages = load(depPath)
  save(depPath, packages)

  const result = JSON.parse(fs.readFileSync(depPath, 'utf-8'))
  expect(result[0].reason).toBe('security patch')
})
