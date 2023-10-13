import {
  GetDataByRID,
  JSON,
  Log,
  SubmitMetrics,
  ExecSQL,
  QuerySQL,
} from '@w3bstream/wasm-sdk'

import { String, Int64, Float64 } from '@w3bstream/wasm-sdk/assembly/sql'

import { getField, getPayloadValue } from '../utils/payload-parser'

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key'
)

export function submit(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  const payload = getPayloadValue(deviceMessage)

  const deviceId = getField<JSON.Str>(payload, 'device_id')
  if (deviceId == null) {
    Log('resourceID: ' + rid.toString() + ' device_id is null')
    return 0
  }

  const chargeData = getField<JSON.Obj>(payload, 'chargeData')
  if (chargeData == null) {
    Log('resourceID: ' + rid.toString() + ' chargeData is null')
    return 0
  }

  const voltage = getField<JSON.Integer>(chargeData, 'voltage')
  const current = getField<JSON.Integer>(chargeData, 'current')
  const power = getField<JSON.Integer>(chargeData, 'power')
  const startTime = getField<JSON.Str>(chargeData, 'startTime')
  const endTime = getField<JSON.Str>(chargeData, 'endTime')
  const startMeter = getField<JSON.Integer>(chargeData, 'startMeter')
  const endMeter = getField<JSON.Integer>(chargeData, 'endMeter')
  const amount = getField<JSON.Num>(chargeData, 'amount')

  if (
    voltage == null ||
    current == null ||
    power == null ||
    startTime == null ||
    endTime == null ||
    startMeter == null ||
    endMeter == null ||
    amount == null
  ) {
    Log('resourceID: ' + rid.toString() + ' charge_data any field is null')
    return 0
  }

  // insert into table t_charge id, voltage, current, power, start_time, end_time, start_meter, end_meter, amount, device_id
  const sql = `INSERT INTO "t_charge" (rid,voltage,current,power,start_time,end_time,start_meter,end_meter,amount,device_id) VALUES (?,?,?,?,?,?,?,?,?,?);`
  ExecSQL(sql, [
    new Int64(rid),
    new Int64(voltage.valueOf()),
    new Int64(current.valueOf()),
    new Int64(power.valueOf()),
    new String(startTime.toString()),
    new String(endTime.toString()),
    new Int64(startMeter.valueOf()),
    new Int64(endMeter.valueOf()),
    new Float64(amount.valueOf()),
    new String(deviceId.toString()),
  ])

  // insert or update table t_charge_total where device_id = {deviceId}, set total_amount = total_amount + {amount} and remaining_amount = remaining_amount + {amount}
  const sql2 = `INSERT INTO "t_charge_total" (device_id,total_amount,remaining_amount) VALUES (?,?,?) ON CONFLICT(device_id) DO UPDATE SET total_amount = "t_charge_total".total_amount + ?, remaining_amount = "t_charge_total".remaining_amount + ?;`
  ExecSQL(sql2, [
    new String(deviceId.toString()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
  ])

  // SubmitMetrics
  const result = QuerySQL(
    `SELECT id, device_id, total_amount, remaining_amount, consumed_amount, created_at FROM "t_charge_total" WHERE device_id = ?;`,
    [new String(deviceId.toString())]
  )

  SubmitMetrics(result)

  return 0
}
