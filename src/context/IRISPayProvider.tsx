import { createContext, useState, type PropsWithChildren } from 'react'
import type {
  IRISSupportedCountries,
  IRISSupportedLangs,
  PaymentData,
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
  paymentData?: PaymentData | null
  updatePaymentData?: (obj: PaymentData) => void
}

export const IRISPayContext = createContext<IPContext | null>(null)

type IrisElementProps = Omit<
  IPContext,
  'updatePaymentSessionData' | 'paymentSession' | 'paymentData' | 'updatePaymentData'
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
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  return (
    <IRISPayContext.Provider
      value={{
        paymentSession,
        updatePaymentSessionData: setPaymentSession,
        paymentData,
        updatePaymentData: setPaymentData,
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
