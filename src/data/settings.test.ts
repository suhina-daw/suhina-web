import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { filterSettings, parseSettings } from './settings.ts'

const source: unknown = JSON.parse(readFileSync(new URL('../../public/settings.json', import.meta.url), 'utf8'))
const settings = parseSettings(source)

test('published data is valid and includes reviewed help', () => {
  assert.ok(settings.length > 0)
  const reviewed = settings.find(row => row.keys.includes('open_projects'))
  assert.equal(reviewed?.helpStatus, 'reviewed')
  assert.ok(reviewed?.options.some(option => option.name === 'New tab'))
  assert.ok(settings.every(row => row.helpStatus === 'reviewed' && row.description.trim() && row.whenToChange.trim()))
})

test('search combines words, searches extended help, and respects categories', () => {
  assert.ok(filterSettings(settings, 'General', 'comparing projects').some(row => row.keys.includes('open_projects')))
  assert.equal(filterSettings(settings, 'Audio', 'comparing projects').length, 0)
  assert.ok(filterSettings(settings, 'All', 'OPEN_PROJECTS').length > 0)
  assert.equal(filterSettings(settings, 'All', 'xyz-no-such-setting').length, 0)
  assert.equal(filterSettings(settings, 'All', '   ').length, settings.length)
  const inProgress = filterSettings(settings, 'All', 'work in progress')
  assert.ok(inProgress.some(row => row.keys.includes('warp_mode')))
  assert.ok(inProgress.every(row => row.workInProgress))
  assert.ok(filterSettings(settings, 'Audio', 'exclusive input').some(row => row.keys.includes('audio_host')))
})

test('invalid structure and duplicate IDs are rejected', () => {
  assert.throws(() => parseSettings({}), /array/)
  assert.throws(() => parseSettings([{ ...settings[0], page: 'Unknown' }]), /Invalid/)
  assert.throws(() => parseSettings([{ ...settings[0], options: [null] }]), /Invalid/)
  assert.throws(() => parseSettings([{ ...settings[0], workInProgress: 'yes' }]), /Invalid/)
  assert.throws(() => parseSettings([settings[0], settings[0]]), /Duplicate/)
})
