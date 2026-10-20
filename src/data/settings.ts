export const pages = {
  General: 'General', Audio: 'Audio', Midi: 'MIDI', Plugins: 'Plug-ins',
  Arrangement: 'Arrangement', Session: 'Session & mixer', ClipEditor: 'Clip editor',
  Transport: 'Transport', DetailArea: 'Detail area', Browser: 'Browser',
  Appearance: 'Appearance', Theme: 'Theme', Shortcuts: 'Shortcuts',
} as const

export type Page = keyof typeof pages
export type Category = 'All' | Page
export interface SettingOption { name: string; description: string }
export interface Setting {
  id: string
  page: Page
  section: string
  name: string
  note: string
  keys: string[]
  sourceFingerprint: string
  helpStatus: 'reviewed' | 'needs-review'
  description: string
  options: SettingOption[]
  whenToChange: string
  workInProgress: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSettings(value: unknown): Setting[] {
  if (!Array.isArray(value)) throw new Error('Settings must be an array.')
  const ids = new Set<string>()
  return value.map((row: unknown) => {
    if (!isRecord(row) || !['id', 'page', 'section', 'name', 'note', 'sourceFingerprint', 'description', 'whenToChange']
      .every(key => typeof row[key] === 'string')
      || typeof row.page !== 'string' || !Object.hasOwn(pages, row.page)
      || (row.helpStatus !== 'reviewed' && row.helpStatus !== 'needs-review')
      || typeof row.workInProgress !== 'boolean'
      || !Array.isArray(row.keys) || !row.keys.every(key => typeof key === 'string')
      || !Array.isArray(row.options) || !row.options.every(option => isRecord(option) && typeof option.name === 'string' && typeof option.description === 'string')) {
      throw new Error('Invalid settings entry.')
    }
    const setting = row as unknown as Setting
    if (!setting.id || ids.has(setting.id)) throw new Error('Duplicate or empty setting ID.')
    ids.add(setting.id)
    return setting
  })
}

export function filterSettings(settings: Setting[], category: Category, query: string): Setting[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return settings.filter(row => {
    if (category !== 'All' && row.page !== category) return false
    const text = [pages[row.page], row.section, row.name, row.note, row.description,
      row.whenToChange, row.workInProgress ? 'Work in progress' : '', ...row.keys, ...row.options.flatMap(option => [option.name, option.description])].join(' ').toLowerCase()
    return words.every(word => text.includes(word))
  })
}
