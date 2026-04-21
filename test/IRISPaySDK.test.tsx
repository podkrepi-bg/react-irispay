import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import IrisElements from '../src/context/IRISPayProvider'
import PaymentElement from '../src/elements/PaymentElement'

describe('IRISPaySDK render guards', () => {
  it('throws when rendered outside <IrisElements>', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<PaymentElement />)).toThrow(/must be a child of <IrisElements>/)
    err.mockRestore()
  })

  it('renders nothing when hookhash is empty', () => {
    const { container } = render(
      <IrisElements
        backend="development"
        hookhash=""
        userhash="user"
        publicHash="pub"
        currency="EUR">
        <PaymentElement />
      </IrisElements>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when userhash is empty', () => {
    const { container } = render(
      <IrisElements
        backend="development"
        hookhash="hook"
        userhash=""
        publicHash="pub"
        currency="EUR">
        <PaymentElement />
      </IrisElements>,
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('IRIS SDK script injection', () => {
  it('injects the iris-sdk script exactly once across sibling mounts', () => {
    const props = {
      backend: 'development' as const,
      hookhash: 'hook',
      userhash: 'user',
      publicHash: 'pub',
      currency: 'EUR' as const,
    }
    render(
      <>
        <IrisElements {...props}>
          <PaymentElement />
        </IrisElements>
        <IrisElements {...props}>
          <PaymentElement />
        </IrisElements>
      </>,
    )

    expect(document.querySelectorAll('#iris-sdk')).toHaveLength(1)
  })
})
