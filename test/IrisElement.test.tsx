import { describe, it, expect } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'
import { useEffect, useRef, type ComponentProps, type ReactElement } from 'react'
import IrisElements from '../src/context/IRISPayProvider'
import IrisElement, { type IrisElementHandle } from '../src/elements/IrisElement'
import type { PaymentData } from '../src/types/common'

type ProviderProps = ComponentProps<typeof IrisElements>

const defaultProvider: Omit<ProviderProps, 'children'> = {
  backend: 'development',
  hookhash: 'hook',
  userhash: 'user',
  publicHash: 'pub',
  currency: 'EUR',
}

function wrap(ui: ReactElement) {
  return <IrisElements {...defaultProvider}>{ui}</IrisElements>
}

async function getPortaledElement(container: HTMLElement) {
  const host = container.querySelector('div')
  if (!host) throw new Error('no host div rendered')
  await waitFor(() => {
    if (!host.shadowRoot?.querySelector('irispay-component')) {
      throw new Error('custom element not yet in shadow root')
    }
  })
  return host.shadowRoot!.querySelector('irispay-component')! as HTMLElement
}

describe('IrisElement composer', () => {
  it('renders nothing before load() is called', () => {
    function Parent() {
      const ref = useRef<IrisElementHandle>(null)
      return <IrisElement ref={ref} />
    }
    const { container } = render(wrap(<Parent />))
    expect(container.firstChild).toBeNull()
  })

  it('mounts PaymentDataElement when loaded with type="payment-data"', async () => {
    const data: PaymentData = {
      sum: 10,
      description: 'Donation',
      toIban: 'BG80BNBG96611020345678',
      merchant: 'merchant',
    }

    function Parent() {
      const ref = useRef<IrisElementHandle>(null)
      useEffect(() => {
        ref.current?.load({ type: 'payment-data', payment_data: data })
      }, [])
      return <IrisElement ref={ref} />
    }

    const { container } = render(wrap(<Parent />))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('type')).toBe('payment-data')
    const pd = JSON.parse(el.getAttribute('payment_data')!) as PaymentData
    expect(pd.sum).toBe(10)
    expect(pd.publicHash).toBe('pub')
  })

  it('mounts PaymentWithCodeElement when loaded with type="pay-with-code"', async () => {
    function Parent() {
      const ref = useRef<IrisElementHandle>(null)
      useEffect(() => {
        ref.current?.load({ type: 'pay-with-code', code: 'XYZ123' })
      }, [])
      return <IrisElement ref={ref} />
    }

    const { container } = render(wrap(<Parent />))
    const el = await getPortaledElement(container)
    expect(el.getAttribute('type')).toBe('pay-with-code')
    expect(el.getAttribute('code')).toBe('XYZ123')
  })

  it('switches element type on a subsequent load() call', async () => {
    const ref = { current: null as IrisElementHandle | null }

    function Parent() {
      const localRef = useRef<IrisElementHandle>(null)
      useEffect(() => {
        ref.current = localRef.current
        localRef.current?.load({
          type: 'payment-data',
          payment_data: { sum: 5, description: 'first', toIban: 'BG', merchant: 'm' },
        })
      }, [])
      return <IrisElement ref={localRef} />
    }

    const { container } = render(wrap(<Parent />))
    let el = await getPortaledElement(container)
    expect(el.getAttribute('type')).toBe('payment-data')

    act(() => {
      ref.current?.load({ type: 'pay-with-code', code: 'SWITCHED' })
    })

    await waitFor(() => {
      el = container.querySelector('div')!.shadowRoot!.querySelector(
        'irispay-component',
      ) as HTMLElement
      if (el.getAttribute('type') !== 'pay-with-code') {
        throw new Error('not switched yet')
      }
    })

    expect(el.getAttribute('code')).toBe('SWITCHED')
  })
})
