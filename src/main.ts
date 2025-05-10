// src/main.ts
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { localStoragePlugin } from '@/plugins/piniaLocalStorage'

// 1️⃣ Start MSW in dev, before anything else
if (import.meta.env.DEV) {
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' }, 
    onUnhandledRequest: 'bypass',                    // or 'error' to debug
  })
}

// 2️⃣ Then wire up Pinia + mount your Vue app
const pinia = createPinia()
pinia.use(localStoragePlugin)

createApp(App)
  .use(pinia)
  .mount('#app')
