<script setup lang="ts">
import type { Category } from '../data/settings'
const emit = defineEmits<{ category: [category: Category] }>()
</script>

<template>
<section class="workflow" id="workflow"><div><div class="eyebrow">03 / YOUR WAY OF WORKING</div><h2>Make yourself<br>at home.</h2></div><div><p>Prefer drawing notes with a click? Want previews a little quieter? Start with the parts you touch every day.</p><a href="#settings" @click="emit('category', 'ClipEditor')">Explore the clip editor <span>↗</span></a><a href="#settings" @click="emit('category', 'Browser')">Tune your browser <span>↗</span></a><a href="#settings" data-category="Shortcuts">Find your shortcuts <span>↗</span></a></div></section>
</template>
