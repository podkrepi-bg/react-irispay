import { useImperativeHandle, useState, type Ref } from 'react'
import type { ElementHandle } from '../types/common'

export function useElementHandle<T>(ref: Ref<ElementHandle<T>>) {
  const [data, setData] = useState<T | null>(null)
  useImperativeHandle(ref, () => ({ updateElementData: setData }), [])
  return data
}
