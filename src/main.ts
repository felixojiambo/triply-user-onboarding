import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { localStoragePlugin } from '@/plugins/piniaLocalStorage'
import App from './App.vue'
// Only start MSW in development
if (import.meta.env.DEV) {
  import('@/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .catch(err => console.error('Failed to start MSW', err))
}
const pinia = createPinia()
pinia.use(localStoragePlugin)

createApp(App)
  .use(pinia)
  .mount('#app')