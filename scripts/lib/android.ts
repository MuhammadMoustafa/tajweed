/**
 * Builds the Android APK from the web app via Capacitor: web build -> `cap sync android` ->
 * Gradle `assembleDebug` or `assembleRelease` -> copies the APK to the given path. Used by
 * scripts/build-apk.ts (`npm run apk`, debug) and scripts/release.ts (`npm run release`, signed).
 *
 * Locates the Android SDK and a JDK without relying on ANDROID_HOME/JAVA_HOME being set:
 * uses them if present in the environment, otherwise falls back to the default install
 * locations of Android Studio on Windows.
 */
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { platform } from 'node:os'
import { dirname, join } from 'node:path'
import { rootPath, run } from './run.ts'

export const ANDROID_DIR = rootPath('android')
export const APK_OUT_DIR = rootPath('apk')

export type ApkVariant = 'debug' | 'release'

/** The Gradle task that builds a variant's APK. */
export const assembleTask = (variant: ApkVariant) => (variant === 'debug' ? 'assembleDebug' : 'assembleRelease')

/** gradlew as a command: Windows cmd.exe (spawned via shell: true) does not search the current
 *  directory for a bare command name, so gradlew.bat must be given as an explicit path. */
export const gradlew = () => (platform() === 'win32' ? join(ANDROID_DIR, 'gradlew.bat') : './gradlew')

function findAndroidSdk(): string {
  if (process.env.ANDROID_HOME) return process.env.ANDROID_HOME
  if (process.env.ANDROID_SDK_ROOT) return process.env.ANDROID_SDK_ROOT
  if (platform() === 'win32' && process.env.LOCALAPPDATA) {
    const candidate = join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
    if (existsSync(candidate)) return candidate
  }
  throw new Error(
    'Could not find the Android SDK. Set ANDROID_HOME, or install Android Studio so the SDK ' +
      'lands at %LOCALAPPDATA%\\Android\\Sdk (Windows default).',
  )
}

function findJdk(): string {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME
  if (platform() === 'win32') {
    const candidate = 'C:\\Program Files\\Android\\Android Studio\\jbr'
    if (existsSync(candidate)) return candidate
  }
  throw new Error(
    'Could not find a JDK. Set JAVA_HOME, or install Android Studio so its bundled JDK lands at ' +
      'C:\\Program Files\\Android\\Android Studio\\jbr (Windows default).',
  )
}

export interface BuildApkOptions {
  variant: ApkVariant
  /** Where the finished APK is copied. */
  outPath: string
  /** Skip `npm run build` when dist/ was just built (e.g. by `npm run check`). */
  skipWebBuild?: boolean
}

/** Builds the APK and copies it to `outPath`; returns that path. */
export async function buildApk({ variant, outPath, skipWebBuild = false }: BuildApkOptions): Promise<string> {
  const sdkDir = findAndroidSdk()
  const javaHome = findJdk()
  console.log(`Using Android SDK: ${sdkDir}`)
  console.log(`Using JAVA_HOME: ${javaHome}`)

  // local.properties is gitignored; every machine building the APK needs its own.
  await writeFile(join(ANDROID_DIR, 'local.properties'), `sdk.dir=${sdkDir.replace(/\\/g, '/')}\n`, 'utf8')

  if (!skipWebBuild) {
    console.log('\n> npm run build')
    await run('npm', ['run', 'build'])
  }

  console.log('\n> npx cap sync android')
  await run('npx', ['cap', 'sync', 'android'])

  const task = assembleTask(variant)
  console.log(`\n> ${gradlew()} ${task}`)
  await run(gradlew(), [task], { cwd: ANDROID_DIR, env: { ...process.env, JAVA_HOME: javaHome } })

  const builtDir = join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', variant)
  // A release build without a signing config would be named *-unsigned.apk: never pick that up.
  const apkName = (await readdir(builtDir)).find((f) => f.endsWith('.apk') && !f.includes('unsigned'))
  if (!apkName) throw new Error(`No signed .apk found in ${builtDir} after ${task}`)

  await mkdir(dirname(outPath), { recursive: true })
  await copyFile(join(builtDir, apkName), outPath)
  console.log(`\nAPK ready: ${outPath}`)
  return outPath
}
