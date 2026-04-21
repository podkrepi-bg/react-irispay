import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISPaymentElementProps } from '../types/elements'

export default function PaymentElement(props: ElementWithListener<IRISPaymentElementProps>) {
  return <IRISPaySDK {...props} type="payment" />
}
