<script setup lang="ts">
const base = import.meta.env.BASE_URL
</script>

<template>
<header class="topbar"><a class="brand" href="#home" aria-label="Suhina home"><img class="brand-logo" :src="`${base}assets/brand/suhina-logo.svg?v=3`" alt="Suhina" width="125" height="37"></a><nav aria-label="Main navigation"><a href="#home" class="top-link">Overview</a><a href="#guide" class="top-link">The guide</a><a href="#settings" class="top-link">Settings</a></nav><a class="download" href="https://github.com/suhina-daw/suhina-daw/releases/tag/nightly" target="_blank" rel="noreferrer">Get Suhina <span>↗</span></a></header>
</template>
