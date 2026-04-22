import { forwardRef, useContext } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { IRISPayContext } from '../context/IRISPayProvider'
import { useElementHandle } from '../internal/useElementHandle'
import {
  SUPPORTED_CURRENCIES,
  type ElementHandle,
  type PaymentData,
} from '../types/common'
import type { IRISPaymentDataElementProps } from '../types/elements'

export type PaymentDataElementHandle = ElementHandle<PaymentData>

const PaymentDataElement = forwardRef<
  PaymentDataElementHandle,
  ElementWithListener<IRISPaymentDataElementProps>
>(function PaymentDataElement(props, ref) {
  const context = useContext(IRISPayContext)
  const internal = useElementHandle<PaymentData>(ref)

  const base = internal ?? props.payment_data
  if (!base) return null

  if (!context?.publicHash) {
    throw new Error('publicHash must be set for payment-data types')
  }

  if (!context.currency || !SUPPORTED_CURRENCIES.includes(context.currency)) {
    throw new Error(
      `Currency missing from context or has invalid value. Supported currencies are: ${SUPPORTED_CURRENCIES.join(', ')}`,
    )
  }

  const paymentData: PaymentData = {
    ...base,
    publicHash: context.publicHash,
    currency: context.currency,
  }

  return <IRISPaySDK {...props} payment_data={paymentData} type="payment-data" />
})

export default PaymentDataElement
