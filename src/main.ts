import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { localStoragePlugin } from '@/plugins/piniaLocalStorage'
import App from './App.vue'

const pinia = createPinia()
pinia.use(localStoragePlugin)

createApp(App)
  .use(pinia)
  .mount('#app')
