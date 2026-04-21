export type IRISBackend =
  | 'https://developer.sandbox.irispay.bg/'
  | 'https://developer.irispay.bg/'

export type IRISSupportedLangs = 'bg' | 'en' | 'ro' | 'el' | 'hr' | 'cy'
export type IRISSupportedCountries = 'bulgaria' | 'romania' | 'greece' | 'croatia' | 'cyprus'

export const SUPPORTED_CURRENCIES = ['EUR', 'RON'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export type PaymentData = {
  sum: number
  publicHash?: string
  description: string
  currency?: string
  toIban: string
  merchant: string
  useOnlySelectedBankHashes?: string | null
}

export type BudgetPayment = {
  identifierType: string
  identifier: 'EIK' | 'EGN' | 'LNC'
  ultimateDebtor: string
}

export type PaymentDataWithAccountId = {
  description: string
  currency: string
  receiverName: string
  toIban: string
  emailNotification: string
  bankAccountId: string
  sum: number
}

export type IrisPayComponentCommon = {
  userhash: string
  lang?: IRISSupportedLangs
  backend: IRISBackend
  country?: IRISSupportedCountries
  show_bank_selector?: boolean
  bankhash?: string
  hookhash: string
  ibanhookhash?: string
  redirect_url?: string
  redirect_timeout?: string
  pagination_options?: {
    start_page_items: number
    increase_per_click: number
  }
  header_options?: {
    show_header: boolean
    show_language_selector: boolean
  }
}
