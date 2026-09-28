import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getWord } from '../../data/quran'
import { AUDIO_GIVE_UP_MS, clipAudioRef, clipAudioSpan, createHtmlAudioDriver, mediaFragmentUrl } from './audio'

/** Stands in for an HTMLAudioElement: no media loads; the test moves `currentTime` and fires events. */
class FakeAudioElement extends EventTarget {
  src = ''
  currentTime = 0
  playResult: Promise<void> = Promise.resolve()
  play = vi.fn(() => this.playResult)
  pause = vi.fn()
  load = vi.fn()
  at(seconds: number) {
    this.currentTime = seconds
    this.dispatchEvent(new Event('timeupdate'))
  }
}

const span = { url: 'https://example.test/001001.mp3', start: 1190, end: 2340 }

let element: FakeAudioElement
const driver = () => createHtmlAudioDriver(() => element as unknown as HTMLAudioElement)

beforeEach(() => {
  element = new FakeAudioElement()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('clip audio sources', () => {
  it('resolves a word to its fetched span and its place in the Quran', () => {
    expect(clipAudioSpan({ word: '1:1:3' })).toEqual(getWord('1:1:3')!.audio)
    expect(clipAudioRef({ word: '113:1:4' })).toEqual({ surah: 113, ayah: 1, word: 4 })
  })

  it('writes a span as a Media Fragments URL, in seconds', () => {
    expect(mediaFragmentUrl(span)).toBe('https://example.test/001001.mp3#t=1.19,2.34')
  })
})

describe('createHtmlAudioDriver', () => {
  it('starts the element at the span and stops it at the span end, once', () => {
    const onEnd = vi.fn()
    driver().play(span, onEnd)
    expect(element.src).toBe(mediaFragmentUrl(span))
    expect(element.play).toHaveBeenCalledOnce()

    element.at(2.3)
    expect(onEnd).not.toHaveBeenCalled()
    element.at(2.34)
    expect(element.pause).toHaveBeenCalled()
    expect(onEnd).toHaveBeenCalledOnce()
    element.at(2.5)
    element.dispatchEvent(new Event('ended'))
    expect(onEnd).toHaveBeenCalledOnce()
  })

  it('checks the end every animation frame once playing', () => {
    const onEnd = vi.fn()
    driver().play(span, onEnd)
    element.dispatchEvent(new Event('playing'))
    element.currentTime = 2.35
    vi.advanceTimersToNextFrame()
    expect(onEnd).toHaveBeenCalledOnce()
  })

  it('stops early without reporting the end', () => {
    const onEnd = vi.fn()
    const stop = driver().play(span, onEnd)
    stop()
    expect(element.pause).toHaveBeenCalled()
    element.at(3)
    expect(onEnd).not.toHaveBeenCalled()
  })

  it('reports the end when the file ends, fails to load, or refuses to play', async () => {
    const onEnd = vi.fn()
    const audio = driver()
    audio.play(span, onEnd)
    element.dispatchEvent(new Event('ended'))
    audio.play(span, onEnd)
    element.dispatchEvent(new Event('error'))
    element.playResult = Promise.reject(new Error('NotAllowedError'))
    audio.play(span, onEnd)
    await vi.runAllTimersAsync()
    expect(onEnd).toHaveBeenCalledTimes(3)
  })

  it('gives up on a span that never finishes (e.g. offline and not cached)', () => {
    const onEnd = vi.fn()
    driver().play(span, onEnd)
    vi.advanceTimersByTime(AUDIO_GIVE_UP_MS + span.end - span.start - 1)
    expect(onEnd).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onEnd).toHaveBeenCalledOnce()
  })

  it('stops the previous span when a new one starts', () => {
    const first = vi.fn()
    const second = vi.fn()
    const audio = driver()
    audio.play(span, first)
    audio.play({ ...span, start: 100, end: 500 }, second)
    element.at(0.5)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })

  it('unlocks its one element by loading it, once', () => {
    const audio = driver()
    audio.unlock!()
    audio.unlock!()
    expect(element.load).toHaveBeenCalledOnce()
  })
})
