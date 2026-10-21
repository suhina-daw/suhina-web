<script setup lang="ts">
const base = import.meta.env.BASE_URL
</script>

<template>
<header class="topbar"><a class="brand" href="#home" aria-label="Suhina home"><img class="brand-logo" :src="`${base}assets/brand/suhina-logo.svg?v=3`" alt="Suhina" width="125" height="37"></a><nav aria-label="Main navigation"><a href="#home" class="top-link">Overview</a><a href="#guide" class="top-link">The guide</a><a href="#settings" class="top-link">Settings</a><a href="#shortcuts" class="top-link">Shortcuts</a><a href="https://github.com/suhina-daw/suhina-daw" class="top-link github-link" target="_blank" rel="noreferrer">GitHub ↗</a></nav><a class="download" href="https://github.com/suhina-daw/suhina-daw/releases/tag/nightly" target="_blank" rel="noreferrer">Get Suhina <span>↗</span></a></header>
</template>

<style scoped>
@media (max-width: 900px) { .topbar { gap: 18px; } .topbar nav { gap: 16px; } }
@media (max-width: 720px) { .topbar nav a:nth-child(2) { display: none; } }
@media (max-width: 540px) { .topbar { gap: 12px; } .topbar nav { gap: 12px; } .topbar nav .github-link { display: none; } .topbar .brand-logo { width: 94px; height: auto; } }
@media (max-width: 360px) { .topbar { padding: 0 14px; gap: 8px; } .topbar nav { gap: 8px; } .top-link { font-size: 9px; } .topbar .brand-logo { width: 82px; } .download { white-space: nowrap; gap: 8px; font-size: 9px; padding: 8px; } }
</style>
