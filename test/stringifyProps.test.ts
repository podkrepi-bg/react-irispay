import { describe, it, expect } from 'vitest'
import { stringifyIrisProps } from '../src/internal/stringifyProps'
import type { IRISPayCommonProps } from '../src/types/elements'

describe('stringifyIrisProps', () => {
  it('calls toString on primitive values', () => {
    const out = stringifyIrisProps({
      type: 'payment',
      lang: 'bg',
      country: 'bulgaria',
      show_bank_selector: true,
    } as IRISPayCommonProps)

    expect(out.lang).toBe('bg')
    expect(out.country).toBe('bulgaria')
    expect(out.show_bank_selector).toBe('true')
  })

  it('JSON-stringifies object values', () => {
    const out = stringifyIrisProps({
      type: 'payment',
      pagination_options: { start_page_items: 5, increase_per_click: 3 },
      header_options: { show_header: true, show_language_selector: false },
    } as IRISPayCommonProps)

    expect(out.pagination_options).toBe('{"start_page_items":5,"increase_per_click":3}')
    expect(out.header_options).toBe('{"show_header":true,"show_language_selector":false}')
  })

  it('preserves the discriminator key', () => {
    const out = stringifyIrisProps({ type: 'pay-with-iban-selection' } as IRISPayCommonProps)
    expect(out.type).toBe('pay-with-iban-selection')
  })
})
