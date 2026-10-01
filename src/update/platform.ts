import { Capacitor } from '@capacitor/core'

/** True inside the Android APK (Capacitor's WebView), false in a browser or the installed PWA.
 *  Only the APK checks GitHub for updates; the PWA updates itself through its service worker. */
export const isNativeApp = (): boolean => Capacitor.isNativePlatform()
