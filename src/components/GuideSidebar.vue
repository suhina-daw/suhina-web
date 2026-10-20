<script setup lang="ts">
import { pages } from '../data/settings'
import type { Category } from '../data/settings'

defineProps<{ category: Category }>()
const emit = defineEmits<{ category: [category: Category]; search: [] }>()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-label">THE FIELD GUIDE <span>01—13</span></div>
    <button class="search-trigger" id="focus-search" @click="emit('search')">Find something <kbd>/</kbd></button>
    <nav id="side-nav" aria-label="Guide chapters">
      <a href="#guide"><span>↗</span> Getting started</a>
      <a v-for="(label, key, index) in pages" :key="key" href="#settings"
        :class="{ active: category === key }" :aria-current="category === key ? 'true' : undefined"
        @click="emit('category', key)">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ label }}
      </a>
    </nav>
    <div class="sidebar-bottom"><span class="status-dot"></span> A work in progress.
      <p>Open source. Open possibilities.</p>
      <a href="https://github.com/suhina-daw/suhina-daw" target="_blank" rel="noreferrer">Follow the project ↗</a>
    </div>
  </aside>
</template>
