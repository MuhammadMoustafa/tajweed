/**
 * Where the app's releases live: the GitHub repo, its "latest release" API and the app files'
 * asset names. Shared by the update check (src/update/check.ts), `npm run release`
 * (scripts/release.ts), which uploads every release's APK under this one name, and the iOS build
 * (scripts/ios-ci.ts), which names the .ipa.
 */
export const REPO = 'MuhammadMoustafa/tajweed'
/** The APK's asset name on every release, so LATEST_APK_URL always gets the newest. */
export const APK_ASSET_NAME = 'tajweed.apk'
/** Public, no login: the newest non-draft, non-prerelease release. */
export const LATEST_RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`
export const LATEST_APK_URL = `https://github.com/${REPO}/releases/latest/download/${APK_ASSET_NAME}`
/**
 * The unsigned iOS build's asset name. .github/workflows/ios.yml builds it on GitHub and uploads it
 * to the tag's release a few minutes after `npm run release` creates it (keep the two in step).
 */
export const IPA_ASSET_NAME = 'tajweed.ipa'
/** The PWA on GitHub Pages: what iPhone users install (Safari, Share, Add to Home Screen). */
export const WEB_APP_URL = 'https://muhammadmoustafa.github.io/tajweed/'
