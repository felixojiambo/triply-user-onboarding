import type { PiniaPluginContext } from 'pinia'

export function localStoragePlugin({ store }: PiniaPluginContext) {
  const key = `onboarding:${store.$id}`

  // Hydrate from localStorage
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      store.$patch(JSON.parse(saved))
    } catch {
      localStorage.removeItem(key)
    }
  }

  // Persist on every mutation
  store.$subscribe((_, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}
