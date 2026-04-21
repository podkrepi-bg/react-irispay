import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import type { ComponentProps, ReactElement } from 'react'
import IrisElements from '../src/context/IRISPayProvider'
import PaymentElement from '../src/elements/PaymentElement'
import PaymentDataElement from '../src/elements/PaymentDataElement'
import BudgetPaymentElement from '../src/elements/BudgetPaymentElement'
import PayWithIbanSelectionElement from '../src/elements/PayWithIbanSelectionElement'
import PaymentWithCodeElement from '../src/elements/PaymentWithCodeElement'
import AddIbanElement from '../src/elements/AddIbanElement'
import AddIbanWithBankElement from '../src/elements/AddIbanWithBankElement'

type ProviderProps = ComponentProps<typeof IrisElements>

const defaultProvider: Omit<ProviderProps, 'children'> = {
  backend: 'development',
  hookhash: 'hook',
  userhash: 'user',
  publicHash: 'pub',
  currency: 'EUR',
}

function wrap(ui: ReactElement, overrides: Partial<ProviderProps> = {}) {
  return (
    <IrisElements {...defaultProvider} {...overrides}>
      {ui}
    </IrisElements>
  )
}

async function getPortaledElement(container: HTMLElement) {
  const host = container.querySelector('div')
  if (!host) throw new Error('no host div rendered')

  await waitFor(() => {
    const el = host.shadowRoot?.querySelector('irispay-component')
    if (!el) throw new Error('custom element not yet in shadow root')
  })

  return host.shadowRoot!.querySelector('irispay-component')! as HTMLElement
}

describe('element type forwarding', () => {
  it.each([
    ['PaymentElement', <PaymentElement />, 'payment'],
    [
      'PayWithIbanSelectionElement',
      <PayWithIbanSelectionElement />,
      'pay-with-iban-selection',
    ],
    [
      'PaymentWithCodeElement',
      <PaymentWithCodeElement code="CODE123" />,
      'pay-with-code',
    ],
    ['AddIbanElement', <AddIbanElement />, 'add-iban'],
    [
      'AddIbanWithBankElement',
      <AddIbanWithBankElement bankhash="BANK" />,
      'add-iban-with-bank',
    ],
  ])('%s forwards type="%s"', async (_name, ui, expectedType) => {
    const { container } = render(wrap(ui))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('type')).toBe(expectedType)
  })
})

describe('backend URL derivation', () => {
  it('development → sandbox URL', async () => {
    const { container } = render(wrap(<PaymentElement />))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('backend')).toBe('https://developer.sandbox.irispay.bg/')
  })

  it('production → prod URL', async () => {
    const { container } = render(wrap(<PaymentElement />, { backend: 'production' }))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('backend')).toBe('https://developer.irispay.bg/')
  })
})

describe('PaymentDataElement', () => {
  const paymentData = {
    sum: 10,
    description: 'Test',
    toIban: 'BG80BNBG96611020345678',
    merchant: 'test-merchant',
  }

  it('returns null when no payment_data is available', () => {
    const { container } = render(wrap(<PaymentDataElement />))
    expect(container.firstChild).toBeNull()
  })

  it('throws on unsupported currency', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        wrap(<PaymentDataElement payment_data={paymentData} />, {
          // @ts-expect-error — exercising the runtime guard with an invalid currency
          currency: 'USD',
        }),
      ),
    ).toThrow(/Supported currencies are: EUR, RON/)
    err.mockRestore()
  })

  it('stamps publicHash and currency onto payment_data', async () => {
    const { container } = render(wrap(<PaymentDataElement payment_data={paymentData} />))
    const el = await getPortaledElement(container)
    const pd = JSON.parse(el.getAttribute('payment_data')!) as typeof paymentData & {
      publicHash: string
      currency: string
    }
    expect(pd.publicHash).toBe('pub')
    expect(pd.currency).toBe('EUR')
  })
})

describe('BudgetPaymentElement', () => {
  const paymentData = {
    sum: 10,
    description: 'Budget',
    toIban: 'BG80BNBG96611020345678',
    merchant: 'test-merchant',
    identifierType: 'id',
    identifier: 'EIK' as const,
    ultimateDebtor: 'Debtor',
  }

  it('rejects unsupported currency', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        wrap(<BudgetPaymentElement payment_data={paymentData} />, {
          // @ts-expect-error — forcing an unsupported currency at runtime
          currency: 'USD',
        }),
      ),
    ).toThrow(/Supported currencies are: EUR, RON/)
    err.mockRestore()
  })

  it('forwards type="budget-payment" and stamps context values', async () => {
    const { container } = render(wrap(<BudgetPaymentElement payment_data={paymentData} />))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('type')).toBe('budget-payment')
    const pd = JSON.parse(el.getAttribute('payment_data')!)
    expect(pd.publicHash).toBe('pub')
    expect(pd.currency).toBe('EUR')
  })
})
