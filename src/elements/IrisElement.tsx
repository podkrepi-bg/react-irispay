import { forwardRef, useImperativeHandle, useState } from 'react'
import PaymentElement from './PaymentElement'
import PayWithIbanSelectionElement from './PayWithIbanSelectionElement'
import PaymentDataElement from './PaymentDataElement'
import BudgetPaymentElement from './BudgetPaymentElement'
import PaymentDataWithAccountIdElement from './PaymentDataWithAccountIdElement'
import PaymentWithCodeElement from './PaymentWithCodeElement'
import AddIbanElement from './AddIbanElement'
import AddIbanWithBankElement from './AddIbanWithBankElement'
import type { IRISListenerProps } from './IRISPaySDK'
import type { IRISPayTypes } from '../types/elements'

export interface IrisElementHandle {
  load: (options: IRISPayTypes) => void
}

const IrisElement = forwardRef<IrisElementHandle, IRISListenerProps>(
  function IrisElement(listeners, ref) {
    const [options, setOptions] = useState<IRISPayTypes | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        load: (next) => setOptions(next),
      }),
      [],
    )

    if (!options) return null

    switch (options.type) {
      case 'payment':
        return (
          <PaymentElement
            show_bank_selector={options.show_bank_selector}
            {...listeners}
          />
        )
      case 'pay-with-iban-selection':
        return (
          <PayWithIbanSelectionElement
            show_bank_selector={options.show_bank_selector}
            {...listeners}
          />
        )
      case 'payment-data':
        return (
          <PaymentDataElement
            payment_data={options.payment_data}
            show_bank_selector={options.show_bank_selector}
            {...listeners}
          />
        )
      case 'budget-payment':
        return (
          <BudgetPaymentElement payment_data={options.payment_data} {...listeners} />
        )
      case 'payment-data-with-accountid':
        return (
          <PaymentDataWithAccountIdElement
            payment_data_with_account_id={options.payment_data_with_account_id}
            show_bank_selector={options.show_bank_selector}
            {...listeners}
          />
        )
      case 'pay-with-code':
        return <PaymentWithCodeElement code={options.code} {...listeners} />
      case 'add-iban':
        return (
          <AddIbanElement
            show_bank_selector={options.show_bank_selector}
            ibanhookhash={options.ibanhookhash}
            {...listeners}
          />
        )
      case 'add-iban-with-bank':
        return (
          <AddIbanWithBankElement
            bankhash={options.bankhash}
            ibanhookhash={options.ibanhookhash}
            {...listeners}
          />
        )
    }
  },
)

export default IrisElement
