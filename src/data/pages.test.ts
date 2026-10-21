import assert from 'node:assert/strict'
import test from 'node:test'
import { legacyGuideUrl, pageUrl, resolvePage } from './pages.ts'

test('static entry points resolve on direct visits and directory index URLs', () => {
  assert.equal(resolvePage('/'), 'home')
  for (const page of ['guide', 'settings', 'shortcuts'] as const) {
    for (const path of [`/${page}`, `/${page}/`, `/${page}/index.html`]) {
      assert.equal(resolvePage(path), page)
    }
    assert.equal(resolvePage(`/preview/${page}/`, '/preview/'), page)
    assert.equal(pageUrl(page, '/preview/'), `/preview/${page}/`)
  }
})

test('published hash links retain their destination after the product/guide split', () => {
  assert.equal(legacyGuideUrl('/', '#settings'), '/settings/')
  assert.equal(legacyGuideUrl('/', '#shortcuts'), '/shortcuts/')
  assert.equal(legacyGuideUrl('/', '#first-sound'), '/guide/#first-sound')
  assert.equal(legacyGuideUrl('/preview/', '#guide', '/preview/'), '/preview/guide/')
  assert.equal(legacyGuideUrl('/', '#download'), undefined)
  assert.equal(legacyGuideUrl('/', '#features'), undefined)
  assert.equal(legacyGuideUrl('/settings/', '#settings'), undefined)
})
