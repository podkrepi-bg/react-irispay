import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import type { ReactElement } from 'react'
import IrisElements from '../src/context/IRISPayProvider'
import PaymentElement from '../src/elements/PaymentElement'

function wrap(ui: ReactElement) {
  return (
    <IrisElements
      backend="development"
      hookhash="hook"
      userhash="user"
      publicHash="pub"
      currency="EUR">
      {ui}
    </IrisElements>
  )
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

describe('on_payment_event dispatch bridging', () => {
  it('invokes onLoad for a "loaded" event', async () => {
    const onLoad = vi.fn()
    const { container } = render(wrap(<PaymentElement onLoad={onLoad} />))
    const el = await getPortaledElement(container)

    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: { type: 'loaded', payload: { description: 'ready' } },
      }),
    )

    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(onLoad.mock.calls[0][0].detail.type).toBe('loaded')
  })

  it('invokes onSuccess for a "lastStep" event', async () => {
    const onSuccess = vi.fn()
    const { container } = render(wrap(<PaymentElement onSuccess={onSuccess} />))
    const el = await getPortaledElement(container)

    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: {
          type: 'lastStep',
          payload: { success: true, description: 'done', data: null },
        },
      }),
    )

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess.mock.calls[0][0].detail.payload.success).toBe(true)
  })

  it('invokes onError for an "error" event', async () => {
    const onError = vi.fn()
    const { container } = render(wrap(<PaymentElement onError={onError} />))
    const el = await getPortaledElement(container)

    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: { type: 'error', payload: { message: 'boom', description: 'fail' } },
      }),
    )

    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('ignores unmapped event types', async () => {
    const onLoad = vi.fn()
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { container } = render(
      wrap(<PaymentElement onLoad={onLoad} onSuccess={onSuccess} onError={onError} />),
    )
    const el = await getPortaledElement(container)

    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: { type: 'closeClicked', payload: { description: '' } },
      }),
    )
    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: { type: 'languageChanged', payload: { description: '', data: { lang: 'en' } } },
      }),
    )

    expect(onLoad).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('uses the latest handler after re-render (latest-ref pattern)', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const { container, rerender } = render(wrap(<PaymentElement onLoad={first} />))
    const el = await getPortaledElement(container)

    rerender(wrap(<PaymentElement onLoad={second} />))

    el.dispatchEvent(
      new CustomEvent('on_payment_event', {
        detail: { type: 'loaded', payload: { description: '' } },
      }),
    )

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
