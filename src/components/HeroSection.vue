<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v'
const reducedMotion = useReducedMotion()
</script>

<template>
<motion.section class="hero" :initial="{ opacity: 0, y: reducedMotion ? 0 : 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: reducedMotion ? 0 : 0.45 }"><div class="eyebrow"><span class="status-dot"></span> SUHINA / USER MANUAL <span class="edition">PRE-ALPHA EDITION</span></div><h1>Less searching.<br>More <span>making.</span></h1><div class="hero-bottom"><p>Your space to make sense of Suhina.<br>From your first sound to the little settings<br>that make it feel like yours.</p><a class="round-link" href="#guide" aria-label="Explore the guide">↓</a></div><div class="sequencer" aria-label="Decorative musical clip sequence"><div class="seq-meta"><span>IDEAS, IN MOTION.</span><span>001 : 01 : 00</span></div><div class="seq-grid" aria-hidden="true"><div class="clip c1"><span>01 / RHYTHM</span><i></i></div><div class="clip c2"><span>02 / TEXTURE</span><i></i></div><div class="clip c3"><span>03 / A LITTLE NOISE</span><i></i></div><div class="playhead"></div></div><div class="seq-foot"><span>AN OPEN-SOURCE MUSIC WORKSTATION.</span><span>BUILT IN RUST. MADE FOR IDEAS.</span></div></div></motion.section>
</template>
