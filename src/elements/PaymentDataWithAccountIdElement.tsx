import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISPaymentDataWithAccountIdProps } from '../types/elements'

export default function PaymentDataWithAccountIdElement(
  props: ElementWithListener<IRISPaymentDataWithAccountIdProps>,
) {
  return <IRISPaySDK {...props} type="payment-data-with-accountid" />
}
