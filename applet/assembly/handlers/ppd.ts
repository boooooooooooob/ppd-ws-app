import {
  GetDataByRID,
  JSON,
  Log,
  SubmitMetrics,
  ExecSQL,
  QuerySQL,
} from '@w3bstream/wasm-sdk'

import { String, Int64, Float64 } from '@w3bstream/wasm-sdk/assembly/sql'

export function charge(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  const payload = JSON.parse(deviceMessage) as JSON.Obj

  const publisherName = payload.getString('publisherName')

  if (publisherName == null) {
    Log('resourceID: ' + rid.toString() + ' missing publisherName')
    return 0
  }

  const voltage = payload.getString('voltage')
  const current = payload.getString('current')
  const power = payload.getString('power')
  const datetime = payload.getInteger('datetime')
  const startMeter = payload.getString('startMeter')
  const endMeter = payload.getString('endMeter')
  const amount = payload.getString('amount')
  const totalAmount = payload.getString('totalAmount')
  const totolSecs = payload.getInteger('totolSecs')
  const times = payload.getInteger('times')

  if (voltage == null) {
    Log('resourceID: ' + rid.toString() + ' missing voltage')
    return 0
  }
  if (current == null) {
    Log('resourceID: ' + rid.toString() + ' missing current')
    return 0
  }
  if (power == null) {
    Log('resourceID: ' + rid.toString() + ' missing power')
    return 0
  }
  if (datetime == null) {
    Log('resourceID: ' + rid.toString() + ' missing datetime')
    return 0
  }
  if (startMeter == null) {
    Log('resourceID: ' + rid.toString() + ' missing startMeter')
    return 0
  }
  if (endMeter == null) {
    Log('resourceID: ' + rid.toString() + ' missing endMeter')
    return 0
  }
  if (amount == null) {
    Log('resourceID: ' + rid.toString() + ' missing amount')
    return 0
  }
  if (totalAmount == null) {
    Log('resourceID: ' + rid.toString() + ' missing totalAmount')
    return 0
  }
  if (totolSecs == null) {
    Log('resourceID: ' + rid.toString() + ' missing totolSecs')
    return 0
  }
  if (times == null) {
    Log('resourceID: ' + rid.toString() + ' missing times')
    return 0
  }

  const sql_charge = `INSERT INTO "t_charge_info" (rid,publisher_name,voltage,current,power,datetime,start_meter,end_meter,amount,total_amount,totol_secs, times) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`
  ExecSQL(sql_charge, [
    new Int64(rid),
    new String(publisherName.toString()),
    new Float64(parseFloat(voltage.valueOf())),
    new Float64(parseFloat(current.valueOf())),
    new Float64(parseFloat(power.valueOf())),
    new Int64(datetime.valueOf()),
    new Float64(parseFloat(startMeter.valueOf())),
    new Float64(parseFloat(endMeter.valueOf())),
    new Float64(parseFloat(amount.valueOf())),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Int64(totolSecs.valueOf()),
    new Int64(times.valueOf()),
  ])

  const sql_charge_session = `INSERT INTO "t_charge_session_statistics" (publisher_name,session_id,total_amount,totol_secs,updated_at) 
    VALUES (?,?,?,?,?,?,?) ON CONFLICT(publisher_name,session_id) DO UPDATE SET total_amount="t_charge_session_statistics".total_amount + ?,totol_secs="t_charge_session_statistics".totol_secs + ?,d.total_amount=?,d.totol_secs=?,updated_at=?;`
  ExecSQL(sql_charge_session, [
    new String(publisherName.toString()),
    new Int64(times.valueOf()),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Int64(totolSecs.valueOf()),
    new Int64(Math.floor(Date.now() / 1000)),
  ])

  const sql_charge_stat = `INSERT INTO "t_charge_statistics" (publisher_name,total_amount,totol_secs,remaining_amount,updated_at) 
    VALUES (?,?,?,?,?,?) ON CONFLICT(publisher_name) DO UPDATE SET total_amount="t_charge_statistics".total_amount + ?, totol_secs="t_charge_statistics".totol_secs + ?, remaining_amount="t_charge_statistics".remaining_amount + ?,updated_at=?;`
  ExecSQL(sql_charge_stat, [
    new String(publisherName.toString()),
    new Float64(parseFloat(amount.valueOf())),
    new Float64(parseFloat(amount.valueOf())),
    new Float64(parseFloat(amount.valueOf())),
    new Float64(parseFloat(amount.valueOf())),
    new Int64(Math.floor(Date.now() / 1000)),
  ])

  return 0
}

export function locate(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  const payload = JSON.parse(deviceMessage) as JSON.Obj

  const publisherName = payload.getString('publisherName')

  if (publisherName == null) {
    Log('resourceID: ' + rid.toString() + ' missing publisherName')
    return 0
  }

  const lat = payload.getInteger('lat')
  const long = payload.getString('long')
  const alt = payload.getString('alt')

  if (lat == null) {
    Log('resourceID: ' + rid.toString() + ' missing voltage')
    return 0
  }
  if (long == null) {
    Log('resourceID: ' + rid.toString() + ' missing current')
    return 0
  }
  if (alt == null) {
    Log('resourceID: ' + rid.toString() + ' missing power')
    return 0
  }

  // TODO: save data to database and SubmitMetrics
  // const result = QuerySQL(
  //   `SELECT id, publisher_name, total_amount, remaining_amount, consumed_amount, created_at FROM "t_charge_statistics" WHERE publisher_name = ?;`,
  //   [new String(publisherName.toString())]
  // )

  // SubmitMetrics(result)

  return 0
}
