import { useSyncExternalStore } from 'react'

export type Route =
  | { page: 'home' }
  | { page: 'lesson'; id: string }
  | { page: 'quiz'; id: string }
  | { page: 'progress' }
  | { page: 'letters' }
  | { page: 'letter'; id: string }
  | { page: 'about' }

/**
 * Hash routing (#/lesson/<id>, its quiz page #/lesson/<id>/quiz, #/progress, and the letters page
 * #/letters with a card per letter at #/letters/<id>, and #/about) needs no server
 * rewrites, so the same build works on any static host, from a subfolder, and inside the
 * Capacitor WebView.
 */
export function parseHash(hash: string): Route {
  if (hash === '#/progress') return { page: 'progress' }
  if (hash === '#/about') return { page: 'about' }
  if (hash === '#/letters') return { page: 'letters' }
  const letter = /^#\/letters\/([\w-]+)$/.exec(hash)
  if (letter) return { page: 'letter', id: letter[1] }
  const match = /^#\/lesson\/([\w-]+)(\/quiz)?$/.exec(hash)
  if (!match) return { page: 'home' }
  return { page: match[2] ? 'quiz' : 'lesson', id: match[1] }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/** The current hash, re-rendering on change. */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash)
}

export function useHashRoute(): Route {
  return parseHash(useHash())
}
