import { useSyncExternalStore } from 'react'

export type Route = { page: 'home' } | { page: 'lesson'; id: string } | { page: 'quiz'; id: string }

/**
 * Hash routing (#/lesson/<id>, and its quiz page #/lesson/<id>/quiz) needs no server rewrites,
 * so the same build works on any static host, from a subfolder, and inside the Capacitor WebView.
 */
export function parseHash(hash: string): Route {
  const match = /^#\/lesson\/([\w-]+)(\/quiz)?$/.exec(hash)
  if (!match) return { page: 'home' }
  return { page: match[2] ? 'quiz' : 'lesson', id: match[1] }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return parseHash(hash)
}
