import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISPayWithCodeElementProps } from '../types/elements'

export default function PaymentWithCodeElement(
  props: ElementWithListener<IRISPayWithCodeElementProps>,
) {
  return <IRISPaySDK {...props} type="pay-with-code" />
}
