import { SBGParsedData } from "../../../types"
import { bit_test } from "../../../utils"
/* Message ID 09 -> SBG_ECOM_LOG_SHIP_MOTION => Real time heave, surge, sway, accelerations and velocity
 * Message ID 32 -> SBG_ECOM_LOG_SHIP_MOTION_HP => Delayed heave, surge, sway, accelerations and velocity
 * Field         Offset  Size  Format   Unit  Description                    
 * TIME_STAMP         0     4  uint32     µs  Time since sensor is powered up
 * HEAVE_PERIOD       4     4   float      s  Main heave period in seconds.
 * SURGE              8     4   float      m  Surge at main location (positive forward)
 * SWAY              12     4   float      m  Sway at main location (positive right)
 * HEAVE             16     4   float      m  Heave at main location (positive down)
 * ACCEL_X           20     4   float  m.s-2  Longitudinal acceleration (positive forward)
 * ACCEL_Y           24     4   float  m.s-2  Lateral acceleration (positive right)
 * ACCEL_Z           28     4   float  m.s-2  Vertical acceleration (positive down)
 * VEL_X             32     4   float  m.s-1  Longitudinal velocity (positive forward)
 * VEL_Y             36     4   float  m.s-1  Lateral velocity (positive right)
 * VEL_Z             40     4   float  m.s-1  Vertical velocity (positive down)
 * HEAVE_STATUS      44     2  uint16      -  Ship motion output status
 *        Total size 46
 * 
 * HEAVE_STATUS definition -> This field must be checked in order to know which fields are active in the output and to know if data is valid or not.
 * Bit  Type  Name                                Description
 *  0   Mask  SBG_ECOM_HEAVE_VALID                Set to 1 after heave convergence time.
 *                                                Set to 0 in following conditions:
 *                                                  • Turn occurred and no velocity aiding is available
 *                                                  • Heave reached higher/lower limits
 *                                                  • If a step is detected and filter has to re-converge
 *                                                  • If internal failure
 *  1   Mask  SBG_ECOM_HEAVE_VEL_AIDED            Set to 1 if heave output is compensated for transient accelerations
 *  2   Mask  SBG_ECOM_HEAVE_SURGE_SWAY_INCLUDED  Set to 1 if surge and sway channels are provided in this output
 *  3   Mask  SBG_ECOM_HEAVE_PERIOD_INCLUDED      Set to 1 if the swell period is provided in this output
 *  4   Mask  SBG_ECOM_HEAVE_PERIOD_VALID         Set to 1 if the period returned is assumed to be valid or not.
 *  5   Mask  SBG_ECOM_HEAVE_SWELL_MODE           Set to 1 if real time heave is using the swell mode computations
*/
enum ClockStatus {
  SBG_ECOM_HEAVE_VALID = 'SBG_ECOM_HEAVE_VALID',
  SBG_ECOM_HEAVE_VEL_AIDED = 'SBG_ECOM_HEAVE_VEL_AIDED',
  SBG_ECOM_HEAVE_SURGE_SWAY_INCLUDED = 'SBG_ECOM_HEAVE_SURGE_SWAY_INCLUDED',
  SBG_ECOM_HEAVE_PERIOD_INCLUDED = 'SBG_ECOM_HEAVE_PERIOD_INCLUDED',
  SBG_ECOM_HEAVE_PERIOD_VALID = 'SBG_ECOM_HEAVE_PERIOD_VALID',
  SBG_ECOM_HEAVE_SWELL_MODE = 'SBG_ECOM_HEAVE_SWELL_MODE',
  UNKNOWN = 'UNKNOWN'
}

const getHeaveStatus = (clockStatus: number) => {
  const bit0 = bit_test(clockStatus, 0)
  const bit1 = bit_test(clockStatus, 1)
  const bit2 = bit_test(clockStatus, 2)
  const bit3 = bit_test(clockStatus, 3)
  const bit4 = bit_test(clockStatus, 4)
  const bit5 = bit_test(clockStatus, 5)
  if (!bit5 && !bit4 && !bit3 && !bit2 && !bit1 && !bit0) return ClockStatus.SBG_ECOM_HEAVE_PERIOD_VALID
  if (!bit5 && !bit4 && !bit3 && !bit2 && !bit1 && bit0) return ClockStatus.SBG_ECOM_HEAVE_VEL_AIDED
  if (!bit5 && !bit4 && !bit3 && !bit2 && bit1 && !bit0) return ClockStatus.SBG_ECOM_HEAVE_SURGE_SWAY_INCLUDED
  if (!bit5 && !bit4 && !bit3 && !bit2 && bit1 && bit0) return ClockStatus.SBG_ECOM_HEAVE_PERIOD_INCLUDED
  if (!bit5 && !bit4 && !bit3 && bit2 && !bit1 && !bit0) return ClockStatus.SBG_ECOM_HEAVE_PERIOD_VALID
  if (!bit5 && !bit4 && !bit3 && bit2 && !bit1 && bit0) return ClockStatus.SBG_ECOM_HEAVE_SWELL_MODE
  return ClockStatus.UNKNOWN
}

const getData = (payload: Buffer) => {
  const data = {
    timestamp: payload.readUIntLE(0, 4),
    heavePeriod: payload.readFloatLE(4),
    surge: payload.readFloatLE(8),
    sway: payload.readFloatLE(12),
    heave: payload.readFloatLE(16),
    accelerationX: payload.readFloatLE(20),
    accelerationY: payload.readFloatLE(24),
    accelerationZ: payload.readFloatLE(28),
    velocityX: payload.readFloatLE(32),
    velocityY: payload.readFloatLE(36),
    velocityZ: payload.readFloatLE(40),
    heaveStatus: payload.readUIntLE(44, 2),
    metadata: {}
  }
  data.metadata = {
    heaveStatus: getHeaveStatus(data.heaveStatus)
  }
  return data
}

export const SBG_ECOM_LOG_SHIP_MOTION = (payload: Buffer): SBGParsedData => {
  const name = 'SBG_ECOM_LOG_SHIP_MOTION'
  const data = getData(payload)
  return { name, data }
}

export const SBG_ECOM_LOG_SHIP_MOTION_HP = (payload: Buffer): SBGParsedData => {
  const name = 'SBG_ECOM_LOG_SHIP_MOTION_HP'
  const data = getData(payload)
  return { name, data }
}