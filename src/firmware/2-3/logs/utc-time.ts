import { SBGParsedData } from "../../../types"
import { bit_test } from "../../../utils"
/* Message ID 02 -> SBG_ECOM_LOG_UTC_TIME => Provides UTC time reference
 * Field         Offset  Size  Format   Unit  Description                                                             
 * TIME_STAMP         0     4  uint32     µs  Time since sensor is powered up                                         
 * CLOCK_STATUS       4     2  uint16      -  General UTC time and clock sync status                                  
 * YEAR               6     2  uint16   year  Year                                                                    
 * MONTH              8     1   uint8  month  Month in Year [1 ... 12]                                                 
 * DAY                9     1   uint8      d  Day in Month [1 … 31]                                                     
 * HOUR              10     1   uint8      h  Hour in day [0 … 23]                                                     
 * MIN               11     1   uint8    min  Minute in hour [0 … 59]                                                  
 * SEC               12     1   uint8      s  Second in minute [0 … 60] Note 60 is when a leap second is added.        
 * NANOSEC           13     4  uint32     ns  Nanosecond of second.                                                   
 * GPS_TOW           17     4  uint32     ms  GPS Time of week                                                        
 *        Total size 21
 * 
 * CLOCK_STATUS definition -> Provide status on the clock stability, error and synchronization.
 * Bit    Type  Name                         Description
 *   0    Mask  SBG_ECOM_CLOCK_STABLE_INPUT  Set if the input clock signal is valid and can be used.
 * [1-4]  Enum  SBG_ECOM_CLOCK_STATUS        Define the internal clock estimation status
 *   5    Mask  SBG_ECOM_CLOCK_UTC_SYNC      Set to 1 if UTC time is synchronized with a PPS
 * [6-9]  Enum  SBG_ECOM_CLOCK_UTC_STATUS    Define the UTC validity status (see Table 38 below)
 * 
 * SBG_ECOM_CLOCK_STATUS enumeration
 * Value Name                         Description
 *   0   SBG_ECOM_CLOCK_ERROR         An error has occurred on the clock estimation.
 *   1   SBG_ECOM_CLOCK_FREE_RUNNING  The clock is only based on the internal crystal.
 *   2   SBG_ECOM_CLOCK_STEERINGA     PPS has been detected and the clock is converging to it.
 *   3   SBG_ECOM_CLOCK_VALID         The clock has converged to the PPS and is within 500ns.
 * 
 * SBG_ECOM_CLOCK_UTC_STATUS enumeration
 * Value Name                      Description
 *   0   SBG_ECOM_UTC_INVALID      The UTC time is not known, we are just propagating the UTC time internally.
 *   1   SBG_ECOM_UTC_NO_LEAP_SEC  Valid UTC time information received but unknown leap seconds information.
 *   2   SBG_ECOM_UTC_VALID        We have received valid UTC time data with valid leap seconds
 */
enum ClockStatus {
  SBG_ECOM_CLOCK_ERROR = 'SBG_ECOM_CLOCK_ERROR',
  SBG_ECOM_CLOCK_FREE_RUNNING = 'SBG_ECOM_CLOCK_FREE_RUNNING',
  SBG_ECOM_CLOCK_STEERINGA = 'SBG_ECOM_CLOCK_STEERINGA',
  SBG_ECOM_CLOCK_VALID = 'SBG_ECOM_CLOCK_VALID',
  UNKNOWN = 'UNKWNOWN'
}

const getClockStatus = (clockStatus: number) => {
  /** Value  Bit 4 Bit 3  Bit 2  Bit 1  State
   *    0       0     0      0      0  SBG_ECOM_CLOCK_ERROR
   *    1       0     0      0      1  SBG_ECOM_CLOCK_FREE_RUNNING
   *    2       0     0      1      0  SBG_ECOM_CLOCK_STEERINGA
   *    3       0     1      0      0  SBG_ECOM_CLOCK_VALID
   *  other     w     x      y      z  UNKNOWN  
   */
  const bit1 = bit_test(clockStatus, 1)
  const bit2 = bit_test(clockStatus, 2)
  const bit3 = bit_test(clockStatus, 3)
  const bit4 = bit_test(clockStatus, 4)
  if (!bit4 && !bit3 && !bit2 && !bit1) return ClockStatus.SBG_ECOM_CLOCK_ERROR
  if (!bit4 && !bit3 && !bit2 && bit1) return ClockStatus.SBG_ECOM_CLOCK_FREE_RUNNING
  if (!bit4 && !bit3 && bit2 && !bit1) return ClockStatus.SBG_ECOM_CLOCK_STEERINGA
  if (!bit4 && bit3 && !bit2 && !bit1) return ClockStatus.SBG_ECOM_CLOCK_VALID
  return ClockStatus.UNKNOWN
}

enum UTCStatus {
  SBG_ECOM_UTC_INVALID = 'SBG_ECOM_UTC_INVALID',
  SBG_ECOM_UTC_NO_LEAP_SEC = 'SBG_ECOM_UTC_NO_LEAP_SEC',
  SBG_ECOM_UTC_VALID = 'SBG_ECOM_UTC_VALID',
  UNKNOWN = 'UNKNOWN'
}

const getUTCStatus = (utcStatus: number) => {
  /** Value  Bit 9 Bit 8  Bit 7  Bit 6  State
   *    0       0     0      0      0  SBG_ECOM_UTC_INVALID
   *    1       0     0      0      1  SBG_ECOM_UTC_NO_LEAP_SEC
   *    2       0     0      1      0  SBG_ECOM_UTC_VALID
   *  other     w     x      y      z  UNKNOWN  
   */
  const bit6 = bit_test(utcStatus, 6)
  const bit7 = bit_test(utcStatus, 7)
  const bit8 = bit_test(utcStatus, 8)
  const bit9 = bit_test(utcStatus, 9)
  if (!bit9 && !bit8 && !bit7 && !bit6) return UTCStatus.SBG_ECOM_UTC_INVALID
  if (!bit9 && !bit8 && !bit7 && bit6) return UTCStatus.SBG_ECOM_UTC_NO_LEAP_SEC
  if (!bit9 && !bit8 && bit7 && !bit6) return UTCStatus.SBG_ECOM_UTC_VALID
  return UTCStatus.UNKNOWN
}
export const SBG_ECOM_LOG_UTC_TIME = (payload: Buffer): SBGParsedData => {
  const name = 'SBG_ECOM_LOG_UTC_TIME'

  const data = {
      timestamp: payload.readUIntLE(0, 4),
      clockStatus: payload.readUIntLE(4, 2),
      year: payload.readUIntLE(6, 2),
      month: payload.readUIntLE(8, 1),
      day: payload.readUIntLE(9, 1),
      hour: payload.readUIntLE(10, 1),
      min: payload.readUIntLE(11, 1),
      sec: payload.readUIntLE(12, 1),
      nanosec: payload.readUIntLE(13, 4),
      gpsTOW: payload.readUIntLE(17, 4),
      metadata: {
        clockStatus: {}
      }
  }
  data.metadata = {
      clockStatus: {
          stableInput: bit_test(data.clockStatus, 0),
          status: getClockStatus(data.clockStatus),
          utcSync: bit_test(data.clockStatus, 5),
          utcstatus: getUTCStatus(data.clockStatus),
      }
  }
  return { name, data }
}