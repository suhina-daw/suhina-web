<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { MotionConfig } from 'motion-v'
import SiteHeader from './components/SiteHeader.vue'
import GuideSidebar from './components/GuideSidebar.vue'
import HeroSection from './components/HeroSection.vue'
import GuideSection from './components/GuideSection.vue'
import FirstSound from './components/FirstSound.vue'
import SettingsReference from './components/SettingsReference.vue'
import ShortcutsReference from './components/ShortcutsReference.vue'
import WorkflowSection from './components/WorkflowSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { parseSettings } from './data/settings'
import type { Category, Setting } from './data/settings'

const settings = ref<Setting[]>([])
const category = ref<Category>('All')
const loading = ref(true)
const loaded = ref(false)
const error = ref('')
const reference = ref<InstanceType<typeof SettingsReference> | null>(null)
let request: AbortController | undefined

function selectCategory(value: Category) {
  category.value = value
  reference.value?.clearSearch()
}
async function focusSearch() {
  window.location.hash = 'settings'
  await nextTick()
  reference.value?.focusSearch()
}
function handleKey(event: KeyboardEvent) {
  const target = event.target
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey
    || (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))) return
  event.preventDefault()
  void focusSearch()
}
async function loadSettings() {
  request?.abort()
  const controller = new AbortController()
  request = controller
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}settings.json`, { signal: controller.signal })
    if (!response.ok) throw new Error(`Settings request failed: ${response.status}`)
    settings.value = parseSettings(await response.json())
    loaded.value = true
  } catch (cause) {
    if (controller.signal.aborted) return
    error.value = 'Settings could not be loaded.'
    console.error(cause)
  } finally {
    if (!controller.signal.aborted) loading.value = false
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKey)
  const initialHash = window.location.hash
  // Settings render above later chapters; resolve deep links after that async layout settles.
  void loadSettings().then(async () => {
    await nextTick()
    if (initialHash && window.location.hash === initialHash) {
      document.getElementById(initialHash.slice(1))?.scrollIntoView()
    }
  })
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKey)
  request?.abort()
})
</script>

<template>
  <MotionConfig reduced-motion="user">
    <SiteHeader />
    <div class="shell">
      <GuideSidebar :category="category" @category="selectCategory" @search="focusSearch" />
      <main id="home">
        <HeroSection />
        <GuideSection :count="loaded ? settings.length : null" />
        <FirstSound />
        <SettingsReference ref="reference" :settings="settings" :category="category" :loading="loading" :error="error" @category="selectCategory" @retry="loadSettings" />
        <ShortcutsReference />
        <WorkflowSection @category="selectCategory" />
        <SiteFooter />
      </main>
    </div>
  </MotionConfig>
</template>
