/**
 * Runs child processes for the build and release scripts: `run` streams a command's output,
 * `capture` returns its stdout (for git queries, never through a shell). Paths: `rootPath` resolves from the repo root.
 */
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const rootPath = (...segments: string[]) => join(ROOT, ...segments)

export interface RunOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  /** Through a shell (default): needed for npm/npx and .bat files on Windows. Without one,
   *  arguments with spaces (a commit message, a release title) reach the command unsplit. */
  shell?: boolean
}

/** Runs a command with its output shown; rejects on a non-zero exit. */
export function run(command: string, args: string[], options: RunOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? rootPath(),
      env: options.env ?? process.env,
      stdio: 'inherit',
      shell: options.shell ?? true,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

/** Runs a command and resolves with its trimmed stdout; rejects on a non-zero exit. */
export function capture(command: string, args: string[], options: RunOptions = {}) {
  return new Promise<string>((resolve, reject) => {
    // No shell: arguments (e.g. a git --format with spaces) reach the command unsplit.
    const child = spawn(command, args, {
      cwd: options.cwd ?? rootPath(),
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'inherit'],
    })
    let out = ''
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => (out += chunk))
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve(out.trim())
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}
