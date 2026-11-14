<script setup lang="ts">
import { ref } from 'vue'
import AppShot from './AppShot.vue'

const views = [
  { name: 'Launcher', file: 'suhina-launcher', alt: 'Suhina Launcher: columns of MIDI and audio clips above a mixer whose tracks hold a plug-in synth, a compressor, EQs and multiband effects' },
  { name: 'Arrangement', file: 'suhina-arrangement', alt: 'Suhina Arrangement: lead, bass and drum clips along a timeline, with grouped tracks of plug-in synths in the track headers on the right' },
]
const current = ref(0)
</script>

<template>
  <figure class="stage switch">
    <div class="frames">
      <AppShot v-for="(view, index) in views" :key="view.file" :name="view.file" :alt="view.alt" :width="1920" :height="727" :class="{ shown: index === current }" :aria-hidden="index !== current" />
    </div>
    <figcaption>
      <span class="stage-tabs"><button v-for="(view, index) in views" :key="view.file" type="button" :aria-pressed="index === current" @click="current = index">{{ view.name }}</button></span>
      <span>Launch clips in the Launcher, lay out the song in the Arrangement.</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.frames, figcaption { width: min(100%, 1280px); margin-inline: auto; }
.frames { display: grid; }
.frames > * { grid-area: 1 / 1; opacity: 0; transition: opacity .25s; }
.frames > .shown { opacity: 1; }
figcaption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; margin-top: clamp(16px, 2vw, 28px); font-size: 14px; }
</style>
