import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

expect.extend(matchers)

afterEach(() => {
    cleanup()
})

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.HTMLElement.prototype.scrollIntoView = function () {}
