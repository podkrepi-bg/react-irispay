import type {
  IRISPayCommonProps,
  IrisPayComponentProps,
  IrisWithRefProp,
} from '../types/elements'

export function stringifyIrisProps(data: IRISPayCommonProps) {
  return Object.entries(data).reduce<IrisWithRefProp>((acc, curr) => {
    const key = curr[0] as keyof IrisPayComponentProps
    if (curr[1] == null) return acc
    acc[key] = typeof curr[1] === 'object' ? JSON.stringify(curr[1]) : curr[1].toString()
    return acc
  }, {} as IrisWithRefProp)
}
