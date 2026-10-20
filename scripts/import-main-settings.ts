import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseSettings } from '../src/data/settings.ts'

export function validateExport(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || !('schemaVersion' in value) || value.schemaVersion !== 1 || !('entries' in value)) {
    throw new Error('Expected the native schemaVersion 1 settings export.')
  }
  const entries = parseSettings(value.entries)
  if (!entries.length || entries.length > 10000 || entries.some(row =>
    row.helpStatus !== 'reviewed' || !row.description.trim() || !row.whenToChange.trim()
    || !row.name.trim() || !row.note.trim() || !/^[a-f0-9]{64}$/.test(row.sourceFingerprint)
    || row.options.some(option => !option.name.trim() || !option.description.trim()))) {
    throw new Error('The native export is empty, incomplete or invalid. Review it in the DAW repository.')
  }
  // Publish only the website contract, rather than arbitrary extra source fields.
  return entries.map(({ id, page, section, name, note, keys, sourceFingerprint, helpStatus,
    description, options, whenToChange, workInProgress }) => ({
    id, page, section, name, note, keys, sourceFingerprint, helpStatus,
    description, options: options.map(({ name, description }) => ({ name, description })),
    whenToChange, workInProgress,
  }))
}

export function importMainSettings(source: string, destination: string) {
  const git = (...args: string[]) => execFileSync('git', ['-C', source, ...args], { encoding: 'utf8' }).trim()
  const remote = git('remote', 'get-url', 'origin')
  if (!/^https:\/\/github\.com\/suhina-daw\/suhina-daw(?:\.git)?$/.test(remote)) {
    throw new Error('Only the official suhina-daw/suhina-daw repository is accepted.')
  }
  const commit = git('rev-parse', 'HEAD')
  if (commit !== git('rev-parse', 'refs/remotes/origin/main')) {
    throw new Error('Only the fetched origin/main revision is accepted; PR and other branches are excluded.')
  }
  const relative = 'docs/guide-data/settings.json'
  const input = resolve(source, relative)
  if (statSync(input).size > 5 * 1024 * 1024) throw new Error('Native settings export exceeds 5 MiB.')
  // Read the committed blob, never uncommitted edits to a checkout.
  const blob = execFileSync('git', ['-C', source, 'show', `${commit}:${relative}`], {
    encoding: 'utf8', maxBuffer: 5 * 1024 * 1024,
  })
  const entries = validateExport(JSON.parse(blob))
  const output = JSON.stringify(entries, null, 2) + '\n'
  const target = resolve(destination, 'settings.json')
  if (readFileSync(target, 'utf8') === output && existsSync(resolve(destination, 'settings-source.json'))) return false
  writeFileSync(target, output)
  writeFileSync(resolve(destination, 'settings-source.json'), JSON.stringify({
    repository: 'suhina-daw/suhina-daw', branch: 'main', commit, schemaVersion: 1,
  }, null, 2) + '\n')
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = process.argv[2]
  if (!source || process.argv.length !== 3) throw new Error('Usage: import-main-settings.ts <official-main-checkout>')
  console.log(importMainSettings(resolve(source), resolve('public')) ? 'Imported native main settings.' : 'Settings unchanged.')
}
