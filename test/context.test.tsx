import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import IrisElements from '../src/context/IRISPayProvider'
import { useIrisElements } from '../src/context/useIrisElements'

describe('<IrisElements>', () => {
  it('applies default country=bulgaria, lang=bg, currency=EUR', () => {
    const { result } = renderHook(() => useIrisElements(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <IrisElements backend="development" hookhash="hook" userhash="user" publicHash="pub">
          {children}
        </IrisElements>
      ),
    })

    expect(result.current.country).toBe('bulgaria')
    expect(result.current.lang).toBe('bg')
    expect(result.current.currency).toBe('EUR')
  })

  it('honors explicitly provided country/lang/currency', () => {
    const { result } = renderHook(() => useIrisElements(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <IrisElements
          backend="production"
          hookhash="h"
          userhash="u"
          publicHash="p"
          country="romania"
          lang="ro"
          currency="RON">
          {children}
        </IrisElements>
      ),
    })

    expect(result.current.country).toBe('romania')
    expect(result.current.lang).toBe('ro')
    expect(result.current.currency).toBe('RON')
  })

  it('seeds paymentSession with the passed hookhash/userhash', () => {
    const { result } = renderHook(() => useIrisElements(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <IrisElements
          backend="development"
          hookhash="HOOK"
          userhash="USER"
          publicHash="pub">
          {children}
        </IrisElements>
      ),
    })

    expect(result.current.paymentSession).toEqual({ hookHash: 'HOOK', userhash: 'USER' })
  })
})

describe('useIrisElements', () => {
  it('throws when called outside <IrisElements>', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useIrisElements())).toThrow(
      /must be used within <IrisElements>/,
    )
    err.mockRestore()
  })
})
