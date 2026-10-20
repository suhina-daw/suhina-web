import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { importMainSettings, validateExport } from './import-main-settings.ts'

const entries = JSON.parse(readFileSync(new URL('../public/settings.json', import.meta.url), 'utf8'))
test('native contract requires a supported schema and complete source-reviewed help', () => {
  assert.equal(validateExport({ schemaVersion: 1, entries }).length, entries.length)
  assert.throws(() => validateExport(entries), /schemaVersion/)
  assert.throws(() => validateExport({ schemaVersion: 2, entries }), /schemaVersion/)
  assert.throws(() => validateExport({ schemaVersion: 1, entries: [] }), /empty/)
  for (const patch of [{ helpStatus: 'needs-review' }, { description: '' }, { whenToChange: '' }, { sourceFingerprint: 'invalid' }]) {
    assert.throws(() => validateExport({ schemaVersion: 1, entries: [{ ...entries[0], ...patch }] }), /incomplete/)
  }
})

test('import uses only committed official main data and rejects another revision or repository', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'suhina-main-export-'))
  try {
    const source = join(temporary, 'native')
    const target = join(temporary, 'public')
    mkdirSync(source)
    mkdirSync(target)
    const git = (...args: string[]) => execFileSync('git', ['-C', source, ...args], { encoding: 'utf8' }).trim()
    git('init', '-b', 'main')
    git('config', 'user.name', 'Export tests')
    git('config', 'user.email', 'export-tests@example.invalid')
    git('remote', 'add', 'origin', 'https://github.com/suhina-daw/suhina-daw.git')
    mkdirSync(join(source, 'docs/guide-data'), { recursive: true })
    const nativeFile = join(source, 'docs/guide-data/settings.json')
    writeFileSync(nativeFile, JSON.stringify({ schemaVersion: 1, entries }))
    git('add', '.')
    git('commit', '-m', 'Source-reviewed export fixture')
    git('update-ref', 'refs/remotes/origin/main', 'HEAD')
    writeFileSync(join(target, 'settings.json'), '[]\n')
    // Uncommitted source edits are never imported.
    writeFileSync(nativeFile, '{"uncommitted":true}')
    assert.equal(importMainSettings(source, target), true)
    assert.equal(JSON.parse(readFileSync(join(target, 'settings.json'), 'utf8')).length, entries.length)
    const provenance = JSON.parse(readFileSync(join(target, 'settings-source.json'), 'utf8'))
    assert.equal(provenance.branch, 'main')
    assert.equal(provenance.commit, git('rev-parse', 'HEAD'))
    assert.equal(importMainSettings(source, target), false)
    git('commit', '--allow-empty', '-m', 'Unmerged revision')
    assert.throws(() => importMainSettings(source, target), /origin\/main/)
    git('update-ref', 'refs/remotes/origin/main', 'HEAD')
    git('remote', 'set-url', 'origin', 'https://github.com/example/fork.git')
    assert.throws(() => importMainSettings(source, target), /official/)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
})
