import { useContext } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { IRISPayContext } from '../context/IRISPayProvider'
import type { PaymentWithCode } from '../types/common'
import type { IRISPayWithCodeElementProps } from '../types/elements'

export default function PaymentWithCodeElement(
  props: ElementWithListener<IRISPayWithCodeElementProps>,
) {
  const context = useContext(IRISPayContext)
  const contextCode = (context?.elementData as PaymentWithCode | undefined)?.code
  const code = contextCode ?? props.code

  if (!code) return null

  return <IRISPaySDK {...props} code={code} type="pay-with-code" />
}
