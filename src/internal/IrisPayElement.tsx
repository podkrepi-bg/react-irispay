import { createElement, forwardRef } from 'react'
import type { IrisWithRefProp } from '../types/elements'

const IrisPayElement = forwardRef<HTMLElement, IrisWithRefProp>((props, ref) => {
  return createElement('irispay-component', { ref, ...props })
})

IrisPayElement.displayName = 'IrisPayElement'

export default IrisPayElement
