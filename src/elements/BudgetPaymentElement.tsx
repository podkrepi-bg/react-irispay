import { useContext } from 'react'
import IRISPaySDK, { type ElementWithListener } from './IRISPaySDK'
import { IRISPayContext } from '../context/IRISPayProvider'
import { SUPPORTED_CURRENCIES } from '../types/common'
import type { IRISBudgetPaymentElementProps } from '../types/elements'

export default function BudgetPaymentElement(
  props: ElementWithListener<IRISBudgetPaymentElementProps>,
) {
  const context = useContext(IRISPayContext)
  if (!context?.publicHash) {
    throw new Error('publicHash must be set for budget-payment types')
  }
  if (!context.currency || !SUPPORTED_CURRENCIES.includes(context.currency)) {
    throw new Error(
      `Currency missing from context or has invalid value. Supported currencies are: ${SUPPORTED_CURRENCIES.join(', ')}`,
    )
  }
  props.payment_data.publicHash = context.publicHash
  props.payment_data.currency = context.currency
  return <IRISPaySDK {...props} type="budget-payment" />
}
