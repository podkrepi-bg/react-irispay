import { forwardRef } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { useElementHandle } from '../internal/useElementHandle'
import type { ElementHandle, PaymentDataWithAccountId } from '../types/common'
import type { IRISPaymentDataWithAccountIdProps } from '../types/elements'

export type PaymentDataWithAccountIdElementHandle = ElementHandle<PaymentDataWithAccountId>

const PaymentDataWithAccountIdElement = forwardRef<
  PaymentDataWithAccountIdElementHandle,
  ElementWithListener<IRISPaymentDataWithAccountIdProps>
>(function PaymentDataWithAccountIdElement(props, ref) {
  const internal = useElementHandle<PaymentDataWithAccountId>(ref)

  const payment_data_with_account_id = internal ?? props.payment_data_with_account_id
  if (!payment_data_with_account_id) return null

  return (
    <IRISPaySDK
      {...props}
      payment_data_with_account_id={payment_data_with_account_id}
      type="payment-data-with-accountid"
    />
  )
})

export default PaymentDataWithAccountIdElement
