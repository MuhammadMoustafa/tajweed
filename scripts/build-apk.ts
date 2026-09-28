/**
 * Builds a sideloadable Android debug APK from the web app via Capacitor:
 * web build -> `cap sync android` -> Gradle `assembleDebug` -> copies the APK to
 * apk/tajweed-debug.apk (gitignored).
 *
 * Locates the Android SDK and a JDK without relying on ANDROID_HOME/JAVA_HOME being set:
 * uses them if present in the environment, otherwise falls back to the default install
 * locations of Android Studio on Windows. Run with:  npm run apk
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { platform } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const rootPath = (...segments: string[]) => join(ROOT, ...segments)

const ANDROID_DIR = rootPath('android')
const APK_OUT_DIR = rootPath('apk')
const APK_OUT_PATH = join(APK_OUT_DIR, 'tajweed-debug.apk')

function run(command: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? rootPath(),
      env: options.env ?? process.env,
      stdio: 'inherit',
      shell: true,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

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

const sdkDir = findAndroidSdk()
const javaHome = findJdk()
console.log(`Using Android SDK: ${sdkDir}`)
console.log(`Using JAVA_HOME: ${javaHome}`)

// local.properties is gitignored; every machine building the APK needs its own.
await writeFile(
  join(ANDROID_DIR, 'local.properties'),
  `sdk.dir=${sdkDir.replace(/\\/g, '/')}\n`,
  'utf8',
)

console.log('\n> npm run build')
await run('npm', ['run', 'build'])

console.log('\n> npx cap sync android')
await run('npx', ['cap', 'sync', 'android'])

// Windows cmd.exe (spawned via shell: true) does not search the current directory for a bare
// command name, so gradlew.bat must be given as an explicit path.
const gradlew = platform() === 'win32' ? join(ANDROID_DIR, 'gradlew.bat') : './gradlew'
console.log(`\n> ${gradlew} assembleDebug`)
await run(gradlew, ['assembleDebug'], {
  cwd: ANDROID_DIR,
  env: { ...process.env, JAVA_HOME: javaHome },
})

const debugOutDir = join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'debug')
const apkName = (await readdir(debugOutDir)).find((f) => f.endsWith('.apk'))
if (!apkName) throw new Error(`No .apk found in ${debugOutDir} after assembleDebug`)

await mkdir(APK_OUT_DIR, { recursive: true })
await copyFile(join(debugOutDir, apkName), APK_OUT_PATH)

console.log(`\nAPK ready: ${APK_OUT_PATH}`)
