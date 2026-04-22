import { createContext, useState, type PropsWithChildren } from 'react'
import type {
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
}

export const IRISPayContext = createContext<IPContext | null>(null)

type IrisElementProps = Omit<IPContext, 'updatePaymentSessionData' | 'paymentSession'>

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

  return (
    <IRISPayContext.Provider
      value={{
        paymentSession,
        updatePaymentSessionData: setPaymentSession,
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
