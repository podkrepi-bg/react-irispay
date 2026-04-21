import { useContext } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { IRISPayContext } from '../context/IRISPayProvider'
import { SUPPORTED_CURRENCIES } from '../types/common'
import type { IRISPaymentDataElementProps } from '../types/elements'

export default function PaymentDataElement(
  props: ElementWithListener<IRISPaymentDataElementProps>,
) {
  const context = useContext(IRISPayContext)
  const paymentData = context?.paymentData || props.payment_data

  if (!paymentData) return null

  if (!context?.publicHash) {
    throw new Error('publicHash must be set for payment-data types')
  }

  if (!context.currency || !SUPPORTED_CURRENCIES.includes(context.currency)) {
    throw new Error(
      `Currency missing from context or has invalid value. Supported currencies are: ${SUPPORTED_CURRENCIES.join(', ')}`,
    )
  }

  paymentData.publicHash = context.publicHash
  paymentData.currency = context.currency

  return <IRISPaySDK {...props} payment_data={paymentData} type="payment-data" />
}
