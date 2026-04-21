import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import type { IRISAddIbanElementProps } from '../types/elements'

export default function AddIbanElement(props: ElementWithListener<IRISAddIbanElementProps>) {
  return <IRISPaySDK {...props} type="add-iban" />
}
