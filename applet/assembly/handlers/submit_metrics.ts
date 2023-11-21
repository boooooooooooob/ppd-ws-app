import {
  GetDataByRID,
  JSON,
  Log,
  SubmitMetrics,
  ExecSQL,
  QuerySQL,
} from '@w3bstream/wasm-sdk'

import { String, Int64, Float64 } from '@w3bstream/wasm-sdk/assembly/sql'

export function submit(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  const payload = JSON.parse(deviceMessage) as JSON.Obj

  const publisherName = payload.getString('publisherName')

  if (publisherName == null) {
    Log('resourceID: ' + rid.toString() + ' missing publisherName')
    return 0
  }

  const voltage = payload.getNum('voltage')
  const current = payload.getNum('current')
  const power = payload.getNum('power')
  const datetime = payload.getInteger('datetime')
  const startMeter = payload.getNum('startMeter')
  const endMeter = payload.getNum('endMeter')
  const amount = payload.getNum('amount')
  const totalAmount = payload.getNum('totalAmount')
  const totolSecs = payload.getInteger('totolSecs')

  if (
    voltage == null ||
    current == null ||
    power == null ||
    datetime == null ||
    startMeter == null ||
    endMeter == null ||
    amount == null ||
    totalAmount == null ||
    totolSecs == null
  ) {
    Log('resourceID: ' + rid.toString() + ' missing charge field')
    return 0
  }

  // insert into table t_charge id, voltage, current, power, start_time, end_time, start_meter, end_meter, amount, device_id
  const sql = `INSERT INTO "t_charge" (rid,publisher_name,voltage,current,power,datetime,start_meter,end_meter,amount,total_amount,totol_secs) VALUES (?,?,?,?,?,?,?,?,?,?,?);`
  ExecSQL(sql, [
    new Int64(rid),
    new String(publisherName.valueOf()),
    new Float64(voltage.valueOf()),
    new Float64(current.valueOf()),
    new Float64(power.valueOf()),
    new Int64(datetime.valueOf()),
    new Float64(startMeter.valueOf()),
    new Float64(endMeter.valueOf()),
    new Float64(amount.valueOf()),
    new Float64(totalAmount.valueOf()),
    new Int64(totolSecs.valueOf()),
  ])

  // insert or update table t_charge_total where device_id = {deviceId}, set total_amount = total_amount + {amount} and remaining_amount = remaining_amount + {amount}
  const sql2 = `INSERT INTO "t_charge_total" (publisher_name,total_amount,remaining_amount) VALUES (?,?,?) ON CONFLICT(publisher_name) DO UPDATE SET total_amount = "t_charge_total".total_amount + ?, remaining_amount = "t_charge_total".remaining_amount + ?;`
  ExecSQL(sql2, [
    new String(publisherName.toString()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
    new Float64(amount.valueOf()),
  ])

  // SubmitMetrics
  // const result = QuerySQL(
  //   `SELECT id, publisher_name, total_amount, remaining_amount, consumed_amount, created_at FROM "t_charge_total" WHERE publisher_name = ?;`,
  //   [new String(publisherName.toString())]
  // )

  // SubmitMetrics(result)

  return 0
}
