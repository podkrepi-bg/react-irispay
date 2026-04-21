import { createContext, useState, type PropsWithChildren } from 'react'
import type {
  ElementData,
  IRISSupportedCountries,
  IRISSupportedLangs,
  SupportedCurrency,
} from '../types/common'

type SessionData = { userhash?: string; hookHash?: string }

type IPContext = {
  userhash?: string
  hookhash?: string
  backend: 'production' | 'development'
  publicHash: string
  country?: IRISSupportedCountries
  lang?: IRISSupportedLangs
  currency?: SupportedCurrency
  paymentSession?: SessionData
  updatePaymentSessionData?: (obj: SessionData) => void
  elementData?: ElementData | null
  updateElementData?: <T extends ElementData = never>(data: NoInfer<T>) => void
}

export const IRISPayContext = createContext<IPContext | null>(null)

type IrisElementProps = Omit<
  IPContext,
  'updatePaymentSessionData' | 'paymentSession' | 'elementData' | 'updateElementData'
>

type IrisElementsProps = PropsWithChildren<IrisElementProps>

export default function IrisElements({
  children,
  userhash,
  backend,
  hookhash,
  publicHash,
  country = 'bulgaria',
  lang = 'bg',
  currency = 'EUR',
}: IrisElementsProps) {
  const [paymentSession, setPaymentSession] = useState<SessionData>({
    hookHash: hookhash,
    userhash,
  })
  const [elementData, setElementData] = useState<ElementData | null>(null)

  function updateElementData<T extends ElementData = never>(data: NoInfer<T>) {
    setElementData(data)
  }

  return (
    <IRISPayContext.Provider
      value={{
        paymentSession,
        updatePaymentSessionData: setPaymentSession,
        elementData,
        updateElementData,
        backend,
        publicHash,
        country,
        lang,
        currency,
      }}>
      {children}
    </IRISPayContext.Provider>
  )
}
