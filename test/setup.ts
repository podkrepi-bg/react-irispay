import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'

class IrisPayElementStub extends HTMLElement {}

if (!customElements.get('irispay-component')) {
  customElements.define('irispay-component', IrisPayElementStub)
}

beforeAll(() => {
  const original = document.createElement.bind(document)
  document.createElement = ((tagName: string, options?: ElementCreationOptions) => {
    if (tagName === 'script' || tagName === 'link') {
      return original('div', options)
    }
    return original(tagName as keyof HTMLElementTagNameMap, options)
  }) as typeof document.createElement
})

afterEach(() => {
  cleanup()
  document.getElementById('iris-sdk')?.remove()
})
