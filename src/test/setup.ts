import { configure } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// findBy*/waitFor give up after this long. Only a safety net: a lazily loaded page can take more
// than the default 1 s to import on a busy or slow machine (a CI deploy run failed on that).
configure({ asyncUtilTimeout: 15_000 })
