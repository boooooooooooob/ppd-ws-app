import { JSON } from '@w3bstream/wasm-sdk'

export function getPayloadValue(message: string): JSON.Obj {
  return JSON.parse(message) as JSON.Obj
}

export function getField<T extends JSON.Value>(
  data: JSON.Obj,
  field: string
): T | null {
  return data.get(field) as T
}

export function getIntegerOrNum(
  data: JSON.Obj,
  key: string
): JSON.Integer | JSON.Num | null {
  let jsonValue = data.get(key)
  if (jsonValue != null) {
    if (jsonValue.isInteger) {
      JSON.Float.toString()
      return <JSON.Integer>jsonValue
    }
    if (jsonValue.isNum) {
      return <JSON.Num>jsonValue
    }
  }
  return null
}
