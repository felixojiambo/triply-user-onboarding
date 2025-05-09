// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { localStoragePlugin } from '@/plugins/piniaLocalStorage'
import App from './App.vue'
import './index.css'

// Only start MSW in development
if (import.meta.env.DEV) {
  import('@/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .catch((err: unknown) => {
      console.error('Failed to start MSW:', err)
    })
}

const pinia = createPinia()
pinia.use(localStoragePlugin)

const app = createApp(App)
  .use(pinia)
  .use(Toast, {
    position: 'top-right',
    timeout: 5000,
    hideProgressBar: true,
  })

// Global error handler
app.config.errorHandler = (err: unknown, _vm, info) => {
  // Normalize the error message
  const message =
    err instanceof Error ? err.message : String(err)

  console.error(`Unhandled error in ${info}:`, message)

  const toast = useToast()
  toast.error('An unexpected error occurred. Please try again.')

  // Send to MSW-log endpoint (or real backend) for collection
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message, info }),
  }).catch((postErr: unknown) => {
    console.warn('Failed to POST to /api/log:', postErr)
  })
}

app.mount('#app')
