# Tajweed · تعلّم التجويد

Beginner tajweed lessons in Arabic and English, with animations beside the text and color-coded Quran examples with audio.

## Install

- **Any phone or computer:** the offline web app (PWA) at https://muhammadmoustafa.github.io/tajweed/. On iPhone, open it in Safari, then Share, then Add to Home Screen; it works offline and updates itself.
- **Android app:** [tajweed.apk](https://github.com/MuhammadMoustafa/tajweed/releases/latest/download/tajweed.apk) (the newest release; open it on the phone and allow installing from that source). Coming from the preview app before v0.2.0? Uninstall it first; later versions install over it, and the app offers each new one.
- **iOS app (testers only):** each release also carries `tajweed.ipa`, an unsigned build made on GitHub Actions a few minutes after the release. It is not an App Store or TestFlight build: it installs only by sideloading with your own Apple ID (e.g. Sideloadly or AltStore), and a free Apple ID's install lasts 7 days. Everyone else on iPhone should use the web app.

Releases are published by the maintainer with `npm run release`; the iOS build runs on GitHub Actions (`.github/workflows/ios.yml`, see CLAUDE.md, Distribution).

```bash
npm install
npm run dev
```

Quran text: Quran Foundation API (`text_uthmani_tajweed`, Hafs). Recitation audio: EveryAyah (Mishary Alafasy).
