export type OnPaymentEventLoaded = {
  type: 'loaded'
  payload: { description: string }
}

export type OnPaymentEventCreatingPayment = {
  type: 'creating-payment'
  payload: { description: string }
}

export type OnPaymentEventCloseClicked = {
  type: 'closeClicked'
  payload: { description: string }
}

export type OnPaymentEventLanguageChanged = {
  type: 'languageChanged'
  payload: { description: string; data: { lang: string } }
}

export type OnPaymentEventError = {
  type: 'error'
  payload: { message: string | Record<string, unknown>; description: string }
}

export type OnPaymentEventLastStep = {
  type: 'lastStep'
  payload: { success: boolean; description: string; data: unknown }
}

export type OnPaymentEvent =
  | OnPaymentEventLoaded
  | OnPaymentEventCreatingPayment
  | OnPaymentEventCloseClicked
  | OnPaymentEventLanguageChanged
  | OnPaymentEventError
  | OnPaymentEventLastStep
