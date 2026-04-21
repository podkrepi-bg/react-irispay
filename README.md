# @podkrepibg/react-irispay

A thin React wrapper around the [IRIS Pay (Pay-By-Click) Web SDK](https://www.irisbgsf.com/en/sdk-documentation). It exposes IRIS's `<irispay-component>` Web Component as a set of typed React components driven by a shared context provider.

## Install

Not published to npm yet — install directly from GitHub:

```bash
yarn add github:podkrepibg/react-irispay
# or pin to a branch/tag/commit:
yarn add github:podkrepibg/react-irispay#main
```

The `prepare` hook builds `dist/` during install, so the consumer gets a ready-to-import package. If your install fails because the build step couldn't run, make sure the dev dependencies (Vite, TypeScript, `vite-plugin-dts`, `@vitejs/plugin-react`) are allowed to install — some CI setups pass `--production` or equivalent, which skips them and breaks `prepare`.

Peer dependencies: `react >= 18` and `react-dom >= 18`. The package is **ESM-only**.

## Quick start

```tsx
import {
  IrisElements,
  PaymentDataElement,
} from '@podkrepibg/react-irispay'

export function CheckoutPage({ session }: {
  session: { hookhash: string; userhash: string }
}) {
  return (
    <IrisElements
      backend="production"
      publicHash={process.env.IRIS_PUBLIC_HASH!}
      hookhash={session.hookhash}
      userhash={session.userhash}
      currency="EUR"
      country="bulgaria"
      lang="bg">
      <PaymentDataElement
        payment_data={{
          sum: 25,
          description: 'Donation',
          toIban: 'BG00XXXX...',
          merchant: 'Example',
        }}
        onLoad={(e) => console.log('loaded', e.detail)}
        onSuccess={(e) => console.log('completed:', e.detail.payload.success)}
        onError={(e) => console.error(e.detail.payload.message)}
      />
    </IrisElements>
  )
}
```

## API reference

### `<IrisElements>` — context provider

Wraps any tree that uses one of the Iris element components.

| Prop | Type | Notes |
| --- | --- | --- |
| `backend` | `'production' \| 'development'` | Maps to IRIS's production or sandbox URL. |
| `hookhash` | `string` | Session hookhash from your backend. |
| `userhash` | `string` | Session userhash from your backend. |
| `publicHash` | `string` | Your merchant public hash. |
| `country` | `'bulgaria' \| 'romania' \| 'greece' \| 'croatia' \| 'cyprus'` | Defaults to `'bulgaria'`. |
| `lang` | `'bg' \| 'en' \| 'ro' \| 'el' \| 'hr' \| 'cy'` | Defaults to `'bg'`. |
| `currency` | `SupportedCurrency` (`'EUR' \| 'RON'`) | Defaults to `'EUR'`. IRIS Pay supports EUR and RON. |

### `useIrisElements()`

Returns the current context. Throws if called outside `<IrisElements>`.

### Elements

Each component corresponds to one `type` value accepted by the underlying `<irispay-component>`.

| Component | IRIS `type` | Purpose |
| --- | --- | --- |
| `<PaymentElement>` | `payment` | User-initiated payment flow. End user picks a bank from the integrated list to complete a credit or SEPA payment. |
| `<PayWithIbanSelectionElement>` | `pay-with-iban-selection` | Payment using an IBAN the end user previously added through the PSD2 `add-iban` consent flow. |
| `<BudgetPaymentElement>` | `budget-payment` | Budget payment flow. |
| `<PaymentDataElement>` | `payment-data` | Payment with pre-defined sum, IBAN, description, etc. Context's `publicHash` and `currency` are stamped onto `payment_data` before the SDK sees it. |
| `<PaymentDataWithAccountIdElement>` | `payment-data-with-accountid` | Payment with pre-defined data plus a specific IBAN account id (previously added via `add-iban`). Equivalent to IRIS's `createPayWithbankAccIdWithoutForm` flow. |
| `<PaymentWithCodeElement>` | `pay-with-code` | Complete a payment already created on the server via IRIS's `POST /api/8/payment/direct` or `POST /api/8/payment/iban`. Requires a `code` prop. |
| `<AddIbanElement>` | `add-iban` | PSD2 account-consent flow with bank selector. Adds an IBAN that can later be used with `pay-with-iban-selection` or `payment-data-with-accountid`. |
| `<AddIbanWithBankElement>` | `add-iban-with-bank` | PSD2 account-consent flow with a pre-selected bank. Requires `bankhash`. |

### Element-specific props

All elements accept the common props declared on the context (`show_bank_selector`, `bankhash`, `redirect_url`, `redirect_timeout`, `pagination_options`, `header_options`, etc.) plus their type-specific payload:

```tsx
<PaymentElement show_bank_selector />

<PaymentWithCodeElement code="XYZ123" />

<AddIbanWithBankElement bankhash="bank-hash" />

<PaymentDataElement
  payment_data={{
    sum: 10,
    description: 'Tip',
    toIban: 'BG00...',
    merchant: 'Example',
    // useOnlySelectedBankHashes?: optional — restricts the bank choice
  }}
/>

<BudgetPaymentElement
  payment_data={{
    sum: 10,
    description: 'Fee',
    toIban: 'BG00...',
    merchant: 'Example',
    identifierType: 'id',
    identifier: 'EIK',     // 'EIK' | 'EGN' | 'LNC'
    ultimateDebtor: 'Payer',
  }}
/>

<PaymentDataWithAccountIdElement
  payment_data_with_account_id={{
    sum: 10,
    currency: 'EUR',
    description: 'Fee',
    receiverName: 'Example',
    toIban: 'BG00...',
    emailNotification: 'true',
    bankAccountId: 'acc-id',
  }}
/>
```

### Events

Every element accepts the same three optional listeners:

```ts
type IRISListenerProps = {
  onLoad?: (e: CustomEvent<OnPaymentEventLoaded>) => void
  onSuccess?: (e: CustomEvent<OnPaymentEventLastStep>) => void
  onError?: (e: CustomEvent<OnPaymentEventError>) => void
}
```

They bridge the SDK's `on_payment_event` CustomEvent:

| SDK event `type` | Callback |
| --- | --- |
| `loaded` | `onLoad` |
| `lastStep` | `onSuccess` — inspect `e.detail.payload.success` to distinguish bank-approved from rejected |
| `error` | `onError` |

Other event types emitted by the SDK (`creating-payment`, `closeClicked`, `languageChanged`) are not currently bridged; open an issue if you need one.

### Types

All public types are re-exported from both the main entry and a types-only subpath (useful if you want type definitions without pulling in the React runtime):

```ts
import type { PaymentData, OnPaymentEventLastStep } from '@podkrepibg/react-irispay'
// or, types-only:
import type { PaymentData } from '@podkrepibg/react-irispay/types'
```

## Lazy updates: feeding session and element data later

You rarely have the session hashes or the element's payload at the moment you mount the provider. `useIrisElements()` returns two setters that let you push them in once they're ready — every child element re-renders and picks up the new values.

| Setter | Updates | Read via |
| --- | --- | --- |
| `updatePaymentSessionData({ hookHash, userhash })` | The IRIS session | `paymentSession` |
| `updateElementData<T>(data)` | Payload for any data-bearing element | `elementData` |

### Deferring the session

`<IRISPaySDK>` (and every wrapper built on it) renders `null` until both `hookHash` and `userhash` are present on `paymentSession`. Mount the provider with empty strings, then push the real values once your backend returns them:

```tsx
import { useEffect } from 'react'
import {
  IrisElements,
  PaymentElement,
  useIrisElements,
} from '@podkrepibg/react-irispay'

function CheckoutInner() {
  const { updatePaymentSessionData } = useIrisElements()

  useEffect(() => {
    async function start() {
      const { hookHash, userhash } = await createIrisSessionOnMyBackend()
      updatePaymentSessionData?.({ hookHash, userhash })
    }
    start()
  }, [])

  return <PaymentElement />
}

export function Checkout() {
  return (
    <IrisElements
      backend="production"
      hookhash=""
      userhash=""
      publicHash={process.env.IRIS_PUBLIC_HASH!}>
      <CheckoutInner />
    </IrisElements>
  )
}
```

Once the setter fires, the host `<div>` mounts and the SDK script loads. Calling the setter again replaces the session entirely — useful if the user bails and you want to restart the flow with a fresh hookhash.

### Deferring element data

Every data-bearing element (`<PaymentDataElement>`, `<BudgetPaymentElement>`, `<PaymentDataWithAccountIdElement>`, `<PaymentWithCodeElement>`) reads the context's `elementData` slot first, then falls back to its own prop, and returns `null` if neither is set. Push data via `updateElementData<T>(data)` — the generic **must be specified explicitly** so TypeScript knows which shape you're writing:

```tsx
import type { PaymentData, BudgetPayment, PaymentWithCode } from '@podkrepibg/react-irispay'

function AmountPicker() {
  const { updateElementData } = useIrisElements()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const sum = Number(new FormData(e.currentTarget).get('amount'))
        updateElementData?.<PaymentData>({
          sum,
          description: 'Donation',
          toIban: 'BG00XXXX...',
          merchant: 'Example',
        })
      }}>
      <input name="amount" type="number" required />
      <button type="submit">Continue</button>
    </form>
  )
}

function Checkout() {
  return (
    <IrisElements
      backend="production"
      hookhash={session.hookhash}
      userhash={session.userhash}
      publicHash={process.env.IRIS_PUBLIC_HASH!}>
      <AmountPicker />
      <PaymentDataElement />
    </IrisElements>
  )
}
```

Other shapes work the same way — just point the generic at the type that matches the element you're feeding:

```tsx
updateElementData?.<BudgetPayment>({
  sum, description, toIban, merchant,
  identifierType: 'id', identifier: 'EIK', ultimateDebtor: 'Payer',
})

updateElementData?.<PaymentWithCode>({ code: 'XYZ' })
```

The type parameter is required: `updateElementData?.({...})` without `<T>` is a type error, and `<T>` must extend one of `PaymentData | BudgetPayment | PaymentDataWithAccountId | PaymentWithCode` (the `ElementData` union). The slot holds one payload at a time — if you mount multiple data-bearing elements simultaneously, they share it, so prefer one per provider tree.

Both setters replace the whole object — pass a complete payload each time rather than merging.

## How it mounts

Each element attaches a Shadow DOM to a host `<div>`, loads the IRIS SDK stylesheet into that shadow root, injects the SDK script once per page into `document.body`, and portals the `<irispay-component>` into the shadow root. Your host app's global CSS will not leak into the IRIS UI and IRIS's styles will not leak out. SSR is safe — all DOM access happens inside `useEffect`.

## Upstream reference

The full list of possible props, event payloads, and backend flows lives in IRIS's [Web SDK documentation](https://www.irisbgsf.com/en/sdk-documentation). Start there if anything in this README is ambiguous.

## License

MIT