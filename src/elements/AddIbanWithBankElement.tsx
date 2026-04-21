import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISAddIbanWithBankElementProps } from '../types/elements'

export default function AddIbanWithBankElement(
  props: ElementWithListener<IRISAddIbanWithBankElementProps>,
) {
  return <IRISPaySDK {...props} type="add-iban-with-bank" />
}
