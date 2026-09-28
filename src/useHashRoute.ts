import { useSyncExternalStore } from 'react'

export type Route = { page: 'home' } | { page: 'lesson'; id: string }

/**
 * Hash routing (#/lesson/<id>) needs no server rewrites, so the same build works on any static
 * host, from a subfolder, and inside the Capacitor WebView.
 */
export function parseHash(hash: string): Route {
  const match = /^#\/lesson\/([\w-]+)$/.exec(hash)
  return match ? { page: 'lesson', id: match[1] } : { page: 'home' }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return parseHash(hash)
}
