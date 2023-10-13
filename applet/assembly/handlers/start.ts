import { GetDataByRID, Log } from '@w3bstream/wasm-sdk'

export function start(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  return 0
}
