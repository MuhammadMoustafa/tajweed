import { useSyncExternalStore } from 'react'

/**
 * Per-device lesson progress ("marked as learned"), the only module that reads or writes it.
 * Backed by a single localStorage key; every access is wrapped in try/catch so a lesson still
 * renders correctly when storage is unavailable (private browsing, restricted WebViews) — the
 * toggle just stops persisting across reloads and instead only lasts for the current session.
 */
const STORAGE_KEY = 'tajweed.progress'

type Listener = () => void
const listeners = new Set<Listener>()

// `cachedRaw` mirrors the last string actually read from (or successfully written to) storage,
// so `readAll` only re-parses JSON when storage truly changed — required for useSyncExternalStore,
// which needs a stable snapshot reference across renders when nothing changed.
let cachedRaw: string | null = null
let cachedIds: ReadonlySet<string> = new Set()

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function parseIds(raw: string | null): Set<string> {
  try {
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function readAll(): ReadonlySet<string> {
  const raw = readStorage()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedIds = parseIds(raw)
  }
  return cachedIds
}

function emit(): void {
  for (const listener of listeners) listener()
}

/** Whether `id` is currently marked learned. */
export function isLessonLearned(id: string): boolean {
  return readAll().has(id)
}

/** Marks (or unmarks) a lesson as learned and persists it. Never throws, even if storage does. */
export function setLessonLearned(id: string, learned: boolean): void {
  const current = readAll()
  if (current.has(id) === learned) return

  const next = new Set(current)
  if (learned) next.add(id)
  else next.delete(id)
  cachedIds = next

  try {
    const raw = JSON.stringify([...next])
    localStorage.setItem(STORAGE_KEY, raw)
    // Only remember the write as the new baseline once it actually succeeded — if it threw,
    // `cachedRaw` is left pointing at the last value storage really holds, so a later successful
    // read doesn't undo this in-memory change by re-parsing stale, unwritten storage content.
    cachedRaw = raw
  } catch {
    // Storage unavailable or full: the change above still applies for this session.
  }

  emit()
}

/** Flips `id`'s learned state. */
export function toggleLessonLearned(id: string): void {
  setLessonLearned(id, !isLessonLearned(id))
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const EMPTY: ReadonlySet<string> = new Set()

export interface ProgressState {
  learnedIds: ReadonlySet<string>
  isLearned: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

/** Learned-lesson state kept in sync across every component that calls this hook. */
export function useProgress(): ProgressState {
  const learnedIds = useSyncExternalStore(subscribe, readAll, () => EMPTY)
  return {
    learnedIds,
    isLearned: (id: string) => learnedIds.has(id),
    toggle: toggleLessonLearned,
    count: learnedIds.size,
  }
}
