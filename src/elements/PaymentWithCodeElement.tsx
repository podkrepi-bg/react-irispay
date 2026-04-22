import { forwardRef } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { useElementHandle } from '../internal/useElementHandle'
import type { ElementHandle, PaymentWithCode } from '../types/common'
import type { IRISPayWithCodeElementProps } from '../types/elements'

export type PaymentWithCodeElementHandle = ElementHandle<PaymentWithCode>

const PaymentWithCodeElement = forwardRef<
  PaymentWithCodeElementHandle,
  ElementWithListener<IRISPayWithCodeElementProps>
>(function PaymentWithCodeElement(props, ref) {
  const internal = useElementHandle<PaymentWithCode>(ref)

  const code = internal?.code ?? props.code
  if (!code) return null

  return <IRISPaySDK {...props} code={code} type="pay-with-code" />
})

export default PaymentWithCodeElement
