import {Package, load, save} from '../src/manifest'
import {test, expect} from '@jest/globals'
import fs from 'fs'
import os from 'os'
import * as path from 'path'
import {mkdtemp} from 'fs/promises'

test('save manifest', async () => {
  const pkg = new Package('test', 'latest', 'base')
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-save-manifest-'))
  const outPath = path.join(tmpdir, 'manifest.csv')
  save(outPath, [pkg])

  const content = fs.readFileSync(outPath).toString()
  const expected = 'package,version,reason\r\n' + 'test,latest,base' // CSV format
  expect(content).toBe(expected)
})

test('save and load manifest', async () => {
  const tmpdir = await mkdtemp(path.join(os.tmpdir(), 'test-load-manifest'))
  const manifestPath = path.join(tmpdir, 'manifest.csv')
  const pkg = new Package('test', 'latest', 'base')

  save(manifestPath, [pkg])
  const packages = load(manifestPath)

  // When comparing, ensure that the reason field is accounted for
  const expectedPackage = new Package('test', 'latest', 'base') // If your Package class has a 'reason' field
  expect(packages).toEqual([expectedPackage])
})

test('load manifest with multiple entries', async () => {
  const tmpdir = await mkdtemp(
    path.join(os.tmpdir(), 'test-load-multi-manifest')
  )
  const manifestPath = path.join(tmpdir, 'manifest.csv')

  // Create a test CSV file
  const testCSVContent =
    'package,version,reason\r\n' + 'test1,1.0,base\r\n' + 'test2,2.0,base\r\n'
  fs.writeFileSync(manifestPath, testCSVContent)

  const packages = load(manifestPath)

  // Expect the loaded packages to match the content of the test CSV
  const expectedPackages = [
    new Package('test1', '1.0', 'base'),
    new Package('test2', '2.0', 'base')
  ]
  expect(packages).toEqual(expectedPackages)
})
