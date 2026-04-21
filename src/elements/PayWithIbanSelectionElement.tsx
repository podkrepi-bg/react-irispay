import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISPayWithIbanSelectionProps } from '../types/elements'

export default function PayWithIbanSelectionElement(
  props: ElementWithListener<IRISPayWithIbanSelectionProps>,
) {
  return <IRISPaySDK {...props} type="pay-with-iban-selection" />
}
