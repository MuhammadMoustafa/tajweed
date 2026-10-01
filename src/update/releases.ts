/**
 * Where the app's releases live: the GitHub repo, its "latest release" API and the APK's asset
 * name. Shared by the update check (src/update/check.ts) and `npm run release` (scripts/release.ts),
 * which uploads every release's APK under this one name.
 */
export const REPO = 'MuhammadMoustafa/tajweed'
/** The APK's asset name on every release, so LATEST_APK_URL always gets the newest. */
export const APK_ASSET_NAME = 'tajweed.apk'
/** Public, no login: the newest non-draft, non-prerelease release. */
export const LATEST_RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`
export const LATEST_APK_URL = `https://github.com/${REPO}/releases/latest/download/${APK_ASSET_NAME}`
