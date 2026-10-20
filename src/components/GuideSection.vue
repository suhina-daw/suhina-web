<script setup lang="ts">
defineProps<{ count: number | null }>()
</script>

<template>
<section class="guide-section" id="guide"><div class="section-heading"><div><div class="eyebrow">A GOOD PLACE TO START</div><h2>Find your way in.</h2></div><span class="small-note">A little guidance. A lot of possibility.</span></div><div class="guide-grid"><a class="guide-card" href="#first-sound"><span class="card-num">01 / START HERE</span><div class="card-icon">↗</div><h3>Your first sound</h3><p>Connect your audio, open a project,<br>and get something moving.</p><span class="card-footer">THE ESSENTIALS <span>→</span></span></a><a class="guide-card" href="#settings"><span class="card-num">02 / MAKE IT YOURS</span><div class="card-icon sliders">≡</div><h3>A setting for that.</h3><p>What it does. Where to find it.<br>All the options, without the overwhelm.</p><span class="card-footer"><span id="setting-count">{{ count === null ? 'SETTINGS REFERENCE' : `${count} REFERENCE ENTRIES` }}</span> <span>→</span></span></a><a class="guide-card" href="#workflow"><span class="card-num">03 / FIND YOUR FLOW</span><div class="card-icon">⌘</div><h3>Work your way</h3><p>Clips, shortcuts, and small changes<br>that keep you in the moment.</p><span class="card-footer">WORKFLOW NOTES <span>→</span></span></a></div></section>
</template>
