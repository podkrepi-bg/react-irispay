import { useContext } from 'react'
import { IRISPayContext } from './IRISPayProvider'

export function useIrisElements() {
  const context = useContext(IRISPayContext)
  if (!context) {
    throw new Error('useIrisElements must be used within <IrisElements>')
  }
  return context
}
