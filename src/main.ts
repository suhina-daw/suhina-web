import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import { legacyGuideUrl } from './data/pages'

const redirect = legacyGuideUrl(window.location.pathname, window.location.hash, import.meta.env.BASE_URL)
if (redirect) window.location.replace(redirect)
else createApp(App).mount('#app')
