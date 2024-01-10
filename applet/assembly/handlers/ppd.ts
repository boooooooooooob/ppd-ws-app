import {
  GetDataByRID,
  JSON,
  Log,
  SubmitMetrics,
  ExecSQL,
  QuerySQL,
} from '@w3bstream/wasm-sdk'

import { String, Int64, Float64, Time } from '@w3bstream/wasm-sdk/assembly/sql'

export function charge(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid)
  Log('device message: ' + deviceMessage)

  const payload = JSON.parse(deviceMessage) as JSON.Obj

  const publisherName = payload.getString('publisherName')

  if (publisherName == null) {
    Log('resourceID: ' + rid.toString() + ' missing publisherName')
    return 0
  }

  // const voltage = payload.getString('voltage')
  // const current = payload.getString('current')
  // const power = payload.getString('power')
  const ua = payload.getString('ua')
  const ub = payload.getString('ub')
  const uc = payload.getString('uc')
  const ia = payload.getString('ia')
  const ib = payload.getString('ib')
  const ic = payload.getString('ic')
  const pa = payload.getString('pa')
  const pb = payload.getString('pb')
  const pc = payload.getString('pc')
  const datetime = payload.getInteger('datetime')
  const startMeter = payload.getString('startMeter')
  const endMeter = payload.getString('endMeter')
  const amount = payload.getString('amount')
  const totalAmount = payload.getString('totalAmount')
  const totalSecs = payload.getInteger('totalSecs')
  const times = payload.getInteger('times')

  if (ua == null || ub == null || uc == null) {
    Log('resourceID: ' + rid.toString() + ' missing voltage')
    return 1
  }
  if (ia == null || ib == null || ic == null) {
    Log('resourceID: ' + rid.toString() + ' missing current')
    return 1
  }
  if (pa == null || pb == null || pc == null) {
    Log('resourceID: ' + rid.toString() + ' missing power')
    return 1
  }
  if (datetime == null) {
    Log('resourceID: ' + rid.toString() + ' missing datetime')
    return 1
  }
  if (startMeter == null) {
    Log('resourceID: ' + rid.toString() + ' missing startMeter')
    return 1
  }
  if (endMeter == null) {
    Log('resourceID: ' + rid.toString() + ' missing endMeter')
    return 1
  }
  if (amount == null) {
    Log('resourceID: ' + rid.toString() + ' missing amount')
    return 1
  }
  if (totalAmount == null) {
    Log('resourceID: ' + rid.toString() + ' missing totalAmount')
    return 1
  }
  if (totalSecs == null) {
    Log('resourceID: ' + rid.toString() + ' missing totalSecs')
    return 1
  }
  if (times == null) {
    Log('resourceID: ' + rid.toString() + ' missing times')
    return 1
  }

  const sql_charge = `INSERT INTO "t_charge_info" (rid,publisher_name,ua,ub,uc,ia,ib,ic,pa,pb,pc,datetime,start_meter,end_meter,amount,total_amount,total_secs,times) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`
  ExecSQL(sql_charge, [
    new Int64(rid),
    new String(publisherName.toString()),
    new Float64(parseFloat(ua.valueOf())),
    new Float64(parseFloat(ub.valueOf())),
    new Float64(parseFloat(uc.valueOf())),
    new Float64(parseFloat(ia.valueOf())),
    new Float64(parseFloat(ib.valueOf())),
    new Float64(parseFloat(ic.valueOf())),
    new Float64(parseFloat(pa.valueOf())),
    new Float64(parseFloat(pb.valueOf())),
    new Float64(parseFloat(pc.valueOf())),
    new Int64(datetime.valueOf()),
    new Float64(parseFloat(startMeter.valueOf())),
    new Float64(parseFloat(endMeter.valueOf())),
    new Float64(parseFloat(amount.valueOf())),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Int64(totalSecs.valueOf()),
    new Int64(times.valueOf()),
  ])

  // const date = new Date(Date.now())
  // const isoString = date.toISOString()

  const sql_charge_session = `
    INSERT INTO "t_charge_session_statistics" (publisher_name, session_id, total_amount, total_secs)
    VALUES (?, ?, ?, ?)
    ON CONFLICT (publisher_name, session_id)
    DO UPDATE SET
        total_amount = CASE 
            WHEN "t_charge_session_statistics".total_amount < ? THEN ? 
            ELSE "t_charge_session_statistics".total_amount 
        END,
        total_secs = CASE 
            WHEN "t_charge_session_statistics".total_secs < ? THEN ? 
            ELSE "t_charge_session_statistics".total_secs 
        END,
        updated_at = now();
  `
  ExecSQL(sql_charge_session, [
    new String(publisherName.toString()),
    new Int64(times.valueOf()),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Int64(totalSecs.valueOf()),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Float64(parseFloat(totalAmount.valueOf())),
    new Int64(totalSecs.valueOf()),
    new Int64(totalSecs.valueOf()),
  ])

  // const sql_charge_stat = `INSERT INTO "t_charge_statistics" (publisher_name,total_amount,total_secs,remaining_amount)
  //   VALUES (?,?,?,?) ON CONFLICT(publisher_name) DO UPDATE SET total_amount="t_charge_statistics".total_amount+?, total_secs="t_charge_statistics".total_secs+?, remaining_amount="t_charge_statistics".remaining_amount+?;`
  // ExecSQL(sql_charge_stat, [
  //   new String(publisherName.toString()),
  //   new Float64(parseFloat(amount.valueOf())),
  //   new Int64(totalSecs.valueOf()),
  //   new Float64(parseFloat(amount.valueOf())),
  //   new Float64(parseFloat(amount.valueOf())),
  //   new Int64(totalSecs.valueOf()),
  //   new Float64(parseFloat(amount.valueOf())),
  //   // new Time(isoString),
  // ])

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

  const lat = payload.getString('lat')
  const long = payload.getString('long')
  const alt = payload.getString('alt')

  if (lat == null) {
    Log('resourceID: ' + rid.toString() + ' missing lat')
    return 0
  }
  if (long == null) {
    Log('resourceID: ' + rid.toString() + ' missing long')
    return 0
  }
  if (alt == null) {
    Log('resourceID: ' + rid.toString() + ' missing alt')
    return 0
  }

  const sql_charge_session = `
    INSERT INTO "t_locate_info" (publisher_name, long, lat, alt)
    VALUES (?, ?, ?, ?)
    ON CONFLICT (publisher_name)
    DO UPDATE SET
        long=?, lat=?, alt=?, updated_at = now();
  `
  ExecSQL(sql_charge_session, [
    new String(publisherName.toString()),
    new String(long.toString()),
    new String(lat.toString()),
    new String(alt.toString()),
    new String(long.toString()),
    new String(lat.toString()),
    new String(alt.toString()),
  ])

  // TODO: save data to database and SubmitMetrics
  // const result = QuerySQL(
  //   `SELECT id, publisher_name, total_amount, remaining_amount, consumed_amount, created_at FROM "t_charge_statistics" WHERE publisher_name = ?;`,
  //   [new String(publisherName.toString())]
  // )

  // SubmitMetrics(result)

  return 0
}

export function start(rid: i32): i32 {
  Log('start from typescript')
  const message = GetDataByRID(rid)
  Log('wasm received message:' + message)

  return 0
}
