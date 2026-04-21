import { useContext } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { IRISPayContext } from '../context/IRISPayProvider'
import type { PaymentDataWithAccountId } from '../types/common'
import type { IRISPaymentDataWithAccountIdProps } from '../types/elements'

export default function PaymentDataWithAccountIdElement(
  props: ElementWithListener<IRISPaymentDataWithAccountIdProps>,
) {
  const context = useContext(IRISPayContext)
  const payment_data_with_account_id =
    (context?.elementData as PaymentDataWithAccountId | undefined) ??
    props.payment_data_with_account_id

  if (!payment_data_with_account_id) return null

  return (
    <IRISPaySDK
      {...props}
      payment_data_with_account_id={payment_data_with_account_id}
      type="payment-data-with-accountid"
    />
  )
}
