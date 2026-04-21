import type {
  BudgetPayment,
  IrisPayComponentCommon,
  PaymentData,
  PaymentDataWithAccountId,
} from './common'

type IRISPaymentElement = { type: 'payment'; show_bank_selector?: boolean }
type IRISPayWithIbanSelection = { type: 'pay-with-iban-selection'; show_bank_selector?: boolean }
type IrisBudgetPayment = { type: 'budget-payment'; payment_data: PaymentData & BudgetPayment }
type IRISPaymentData = {
  type: 'payment-data'
  payment_data?: PaymentData
  show_bank_selector?: boolean
}
type IRISPaymentDataWithAccountId = {
  type: 'payment-data-with-accountid'
  payment_data_with_account_id: PaymentDataWithAccountId
  show_bank_selector?: boolean
}
type IRISPayWithCodeElement = { type: 'pay-with-code'; code: string }
type IrisAddIban = { type: 'add-iban'; show_bank_selector?: boolean; ibanhookhash?: string }
type IRISAddIbanWithBank = { type: 'add-iban-with-bank'; ibanhookhash?: string; bankhash: string }

export type IRISPayTypes =
  | IRISPaymentElement
  | IRISPayWithIbanSelection
  | IrisBudgetPayment
  | IRISPaymentData
  | IRISPaymentDataWithAccountId
  | IRISPayWithCodeElement
  | IrisAddIban
  | IRISAddIbanWithBank

type IRISPaySDKBase = Omit<IrisPayComponentCommon, 'userhash' | 'backend' | 'hookhash'>

export type IRISPayCommonProps = IRISPaySDKBase & IRISPayTypes

export type IRISPaymentElementProps = IRISPaySDKBase & Omit<IRISPaymentElement, 'type'>
export type IRISPayWithIbanSelectionProps = IRISPaySDKBase & Omit<IRISPayWithIbanSelection, 'type'>
export type IRISBudgetPaymentElementProps = IRISPaySDKBase & Omit<IrisBudgetPayment, 'type'>
export type IRISPaymentDataElementProps = IRISPaySDKBase & Omit<IRISPaymentData, 'type'>
export type IRISPaymentDataWithAccountIdProps = IRISPaySDKBase &
  Omit<IRISPaymentDataWithAccountId, 'type'>
export type IRISPayWithCodeElementProps = IRISPaySDKBase & Omit<IRISPayWithCodeElement, 'type'>
export type IRISAddIbanElementProps = IRISPaySDKBase & Omit<IrisAddIban, 'type'>
export type IRISAddIbanWithBankElementProps = IRISPaySDKBase & Omit<IRISAddIbanWithBank, 'type'>

export type IrisPayComponentProps = IrisPayComponentCommon & IRISPayTypes
export type IrisWithRefProp = {
  [key in keyof IrisPayComponentProps]: string
}
