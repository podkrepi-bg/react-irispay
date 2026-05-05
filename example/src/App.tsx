import { IrisElements, PaymentElement } from '@podkrepi-bg/react-irispay'

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 720 }}>
      <h1>react-iris-pay playground</h1>
      <p>
        Provide real values for <code>hookhash</code>, <code>userhash</code>, and{' '}
        <code>publicHash</code> to exercise the SDK end-to-end. Fake values render the host
        element but will not load any IRIS content.
      </p>
      <IrisElements
        backend="development"
        hookhash="FAKE_HOOK_HASH"
        userhash="FAKE_USER_HASH"
        publicHash="FAKE_PUBLIC_HASH"
        country="bulgaria"
        lang="bg"
        currency="EUR">
        <PaymentElement
          onLoad={(e) => console.log('loaded', e.detail)}
          onSuccess={(e) => console.log('success', e.detail)}
          onError={(e) => console.error('error', e.detail)}
        />
      </IrisElements>
    </div>
  )
}
