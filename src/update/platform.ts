import { Capacitor } from '@capacitor/core'

/** True only inside the Android APK (Capacitor's WebView); false in a browser, the installed PWA
 *  and the native iOS app. Only the APK checks GitHub for updates and offers the APK download; the
 *  PWA updates itself through its service worker and iOS has no APK to install. */
export const isAndroidApp = (): boolean => Capacitor.getPlatform() === 'android'

/** Which build is running, as an issue report names it (src/about/report.ts). */
export type AppBuild = 'APK' | 'iOS app' | 'web'

const BUILDS: Record<string, AppBuild> = { android: 'APK', ios: 'iOS app' }

export const appBuild = (): AppBuild => BUILDS[Capacitor.getPlatform()] ?? 'web'
