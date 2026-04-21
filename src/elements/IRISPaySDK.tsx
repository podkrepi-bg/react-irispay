import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import IrisPayElement from '../internal/IrisPayElement'
import { stringifyIrisProps } from '../internal/stringifyProps'
import { IRISPayContext } from '../context/IRISPayProvider'
import type { IRISBackend } from '../types/common'
import type { IRISPayCommonProps } from '../types/elements'
import type {
  OnPaymentEvent,
  OnPaymentEventError,
  OnPaymentEventLastStep,
  OnPaymentEventLoaded,
} from '../types/events'

const IRIS_SDK_SCRIPT_URL = 'https://websdk.irispay.bg/assets/irispay-ui/elements.js'
const IRIS_SDK_STYLE_URL = 'https://websdk.irispay.bg/assets/irispay-ui/styles.css'
const IRIS_SDK_SCRIPT_ID = 'iris-sdk'

export type IRISListenerProps = {
  onLoad?: (data: CustomEvent<OnPaymentEventLoaded>) => void
  onSuccess?: (data: CustomEvent<OnPaymentEventLastStep>) => void
  onError?: (data: CustomEvent<OnPaymentEventError>) => void
}

export type ElementWithListener<T> = T & IRISListenerProps
export type IRISPaySDKProps = ElementWithListener<IRISPayCommonProps>

export default function IRISPaySDK(props: IRISPaySDKProps) {
  const context = useContext(IRISPayContext)
  if (!context) {
    throw new Error('IRISPaySDK must be a child of <IrisElements>')
  }

  const hostRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<ShadowRoot | null>(null)
  const irisComponentRef = useRef<HTMLElement | null>(null)
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null)

  const { onLoad, onSuccess, onError, ...restProps } = props
  const onLoadRef = useRef(onLoad)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onLoadRef.current = onLoad
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [onLoad, onSuccess, onError])

  const stringifiedProps = stringifyIrisProps(restProps)

  const environment: IRISBackend =
    context.backend === 'production'
      ? 'https://developer.irispay.bg/'
      : 'https://developer.sandbox.irispay.bg/'

  useEffect(() => {
    if (!hostRef.current || shadowRef.current) return

    const shadow = hostRef.current.attachShadow({ mode: 'open' })
    shadowRef.current = shadow

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = IRIS_SDK_STYLE_URL
    shadow.appendChild(link)

    if (!document.getElementById(IRIS_SDK_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.src = IRIS_SDK_SCRIPT_URL
      script.id = IRIS_SDK_SCRIPT_ID
      document.body.appendChild(script)
    }

    const container = document.createElement('div')
    shadow.appendChild(container)
    setPortalTarget(container)
  }, [])

  useEffect(() => {
    const el = irisComponentRef.current
    if (!el) return

    const eventListener = ((data: CustomEvent<OnPaymentEvent>) => {
      switch (data.detail.type) {
        case 'loaded':
          onLoadRef.current?.(data as CustomEvent<OnPaymentEventLoaded>)
          break
        case 'lastStep':
          onSuccessRef.current?.(data as CustomEvent<OnPaymentEventLastStep>)
          break
        case 'error':
          onErrorRef.current?.(data as CustomEvent<OnPaymentEventError>)
          break
      }
    }) as EventListener

    el.addEventListener('on_payment_event', eventListener)
    return () => {
      el.removeEventListener('on_payment_event', eventListener)
    }
  }, [portalTarget])

  if (!context.paymentSession?.hookHash || !context.paymentSession?.userhash) {
    return null
  }

  return (
    <>
      <div ref={hostRef} />
      {portalTarget &&
        createPortal(
          <IrisPayElement
            ref={irisComponentRef}
            {...stringifiedProps}
            backend={environment}
            hookhash={context.paymentSession.hookHash}
            userhash={context.paymentSession.userhash}
          />,
          portalTarget,
        )}
    </>
  )
}
