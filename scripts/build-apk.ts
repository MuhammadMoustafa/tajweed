/**
 * Builds a sideloadable Android debug APK (scripts/lib/android.ts) to apk/tajweed-debug.apk
 * (gitignored). Needs no signing key. Run with:  npm run apk
 * Signed release APKs are built by `npm run release` (scripts/release.ts).
 */
import { join } from 'node:path'
import { APK_OUT_DIR, buildApk } from './lib/android.ts'

await buildApk({ variant: 'debug', outPath: join(APK_OUT_DIR, 'tajweed-debug.apk') })
