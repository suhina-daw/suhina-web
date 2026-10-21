<script setup lang="ts">
import { ref } from 'vue'
const selected = ref('All sounds')
const kinds = [
  { name: 'Drums', color: '#d8a080', x: 110, y: 155, caption: 'Short attacks. Weight and rhythm.' },
  { name: 'Hats', color: '#d8ce92', x: 250, y: 85, caption: 'Bright, sharp and airy.' },
  { name: 'Tones', color: '#b7c79d', x: 385, y: 150, caption: 'Sustained notes and pitched sounds.' },
  { name: 'Textures', color: '#9cb0bb', x: 275, y: 235, caption: 'Noise, layers and in-between sounds.' },
]
const points = kinds.flatMap(kind => Array.from({ length: 43 }, (_, i) => ({ kind: kind.name, color: kind.color,
  x: kind.x + Math.cos(i * 2.4) * (9 + Math.sqrt(i) * 10), y: kind.y + Math.sin(i * 2.4) * (8 + Math.sqrt(i) * 8), r: i % 11 === 0 ? 4.5 : 2.4 })))
</script>

<template>
  <figure class="map-study">
    <div class="map-caption"><span>SOUND NEIGHBORHOODS</span><span>ILLUSTRATION</span></div>
    <svg viewBox="0 0 520 330" role="img" aria-label="Illustration of samples grouped in neighborhoods by sound, with differently colored clusters">
      <path d="M15 165h490M260 20v290" stroke="#434c40" stroke-width=".7" stroke-dasharray="2 7"/>
      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" :r="point.r" :fill="point.color" :opacity="selected === 'All sounds' || selected === point.kind ? 0.85 : 0.12"/>
      <circle cx="110" cy="155" r="13" fill="none" stroke="#d8a080" stroke-width="1"/>
    </svg>
    <div class="kind-controls" aria-label="Highlight an illustrated sound neighborhood"><button :aria-pressed="selected === 'All sounds'" @click="selected = 'All sounds'">All sounds</button><button v-for="kind in kinds" :key="kind.name" :aria-pressed="selected === kind.name" @click="selected = kind.name"><i :style="{ background: kind.color }" aria-hidden="true"></i>{{ kind.name }}</button></div>
    <figcaption aria-live="polite">{{ kinds.find(kind => kind.name === selected)?.caption ?? 'Similar sounds become neighbors. Follow a sound, then explore what is nearby.' }}</figcaption>
  </figure>
</template>

<style scoped>
.map-study { margin: 0; min-width: 0; }
.map-caption { display: flex; justify-content: space-between; font: 8px var(--mono); color: #a1ab96; letter-spacing: .7px; }
svg { display: block; width: 100%; height: auto; } circle { transition: opacity .2s; }
.kind-controls { display: flex; flex-wrap: wrap; gap: 6px; }
button { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid #57604d; color: #bcc5b0; padding: 7px 10px; font: 9px var(--mono); }
button[aria-pressed=true] { border-color: #e5d59a; color: #f8edbf; }
i { display: block; width: 5px; height: 5px; border-radius: 50%; }
figcaption { color: #aab49e; font-size: 11px; margin-top: 15px; min-height: 36px; }
</style>
