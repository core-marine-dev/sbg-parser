import { SBGParsedData } from "../../../types"
import { bit_test } from "../../../utils"
/* Message ID = 01 -> SBG_ECOM_LOG_STATUS => Status general, clock, com aiding, solution, heave
 * Field          Offset  Size Format Unit Description                                   
 * TIME STAMP          0     4 uint32   µs Time since sensor is powered up               
 * GENERAL STATUS      4     2 uint16    - General status bitmask and enums               
 * RESERVED 1          6     2 uint16    - Reserved status field for future use           
 * COM STATUS          8     4 uint32    - Communication status bitmask and enums         
 * AIDING STATUS      12     4 uint32    - Aiding equipment status bitmask and enums      
 * RESERVED 2         16     4 uint32    - Reserved status field for future use           
 * RESERVED 3         20     2 uint16    - Reserved field for future use                  
 * UP TIME            22     4 uint32    s System up time since the power on              
 *         Total size 26
 * 
 * GENERAL_STATUS definition -> Provides general device status and information such as the power supplies (main, IMU, GNSS), settings, temperature and data-logger.
 * Bit  Name                             Type  Description
 *  0   SBG_ECOM_GENERAL_MAIN_POWER_OK   Mask  Set to 1 when main power supply is OK.
 *  1   SBG_ECOM_GENERAL_IMU_POWER_OK    Mask  Set to 1 when IMU power supply is OK.
 *  2   SBG_ECOM_GENERAL_GPS_POWER_OK    Mask  Set to 1 when GPS power supply is OK.
 *  3   SBG_ECOM_GENERAL_SETTINGS_OK     Mask  Set to 1 if settings were correctly loaded
 *  4   SBG_ECOM_GENERAL_TEMPERATURE_OK  Mask  Set to 1 when temperature is within specified limits.
 *  5   SBG_ECOM_GENERAL_DATALOGGER_OK   Mask  Set to 1 when the data-logger is working correctly.
 *  6   SBG_ECOM_GENERAL_CPU_OK          Mask  Set to 1 if the CPU headroom is correct.
 * 
 * COM_STATUS definition -> Provide information on ports, tells is they are valid or saturated.
 * Bit    Name                   Type  Description
 *  0     SBG_ECOM_PORTA_VALID   Mask  Set to 0 in case of low level communication error.
 *  1     SBG_ECOM_PORTB_VALID   Mask  Set to 0 in case of low level communication error.
 *  2     SBG_ECOM_PORTC_VALID   Mask  Set to 0 in case of low level communication error.
 *  3     SBG_ECOM_PORTD_VALID   Mask  Set to 0 in case of low level communication error.
 *  4     SBG_ECOM_PORTE_VALID   Mask  Set to 0 in case of low level communication error.
 *  5     SBG_ECOM_PORTA_RX_OK   Mask  Set to 0 in case of saturation on PORT A input
 *  6     SBG_ECOM_PORTA_TX_OK   Mask  Set to 0 in case of saturation on PORT A output
 *  7     SBG_ECOM_PORTB_RX_OK   Mask  Set to 0 in case of saturation on PORT B input
 *  8     SBG_ECOM_PORTB_TX_OK   Mask  Set to 0 in case of saturation on PORT B output
 *  9     SBG_ECOM_PORTC_RX_OK   Mask  Set to 0 in case of saturation on PORT C input
 * 10     SBG_ECOM_PORTC_TX_OK   Mask  Set to 0 in case of saturation on PORT C output
 * 11     SBG_ECOM_PORTD_RX_OK   Mask  Set to 0 in case of saturation on PORT D input
 * 12     SBG_ECOM_PORTD_TX_OK   Mask  Set to 0 in case of saturation on PORT D output
 * 13     SBG_ECOM_PORTE_RX_OK   Mask  Set to 0 in case of saturation on PORT E input
 * 14     SBG_ECOM_PORTE_TX_OK   Mask  Set to 0 in case of saturation on PORT E output
 * 15     SBG_ECOM_ETH0_VALID    Mask  Set to 0 in case of saturation on PORT ETH0
 * 16     SBG_ECOM_ETH1_VALID    Mask  Set to 0 in case of saturation on PORT ETH1
 * 17     SBG_ECOM_ETH2_VALID    Mask  Set to 0 in case of saturation on PORT ETH2
 * 18     SBG_ECOM_ETH3_VALID    Mask  Set to 0 in case of saturation on PORT ETH3
 * 19     SBG_ECOM_ETH4_VALID    Mask  Set to 0 in case of saturation on PORT ETH4
 * 25     SBG_ECOM_CAN_VALID     Mask  Set to 0 in case of low level communication error.
 * 26     SBG_ECOM_CAN_RX_OK     Mask  Set to 0 in case of saturation on CAN Bus input buffer
 * 27     SBG_ECOM_CAN_TX_OK     Mask  Set to 0 in case of saturation on CAN Bus output buffer
 * 28-30  SBG_ECOM_CAN_BUS       Enum  Define the CAN Bus status
 * 
 * CAN Bus status enumeration
 * Value  Name                        Description
 *     0  SBG_ECOM_CAN_BUS_OFF        Bus OFF operation due to too much errors.
 *     1  SBG_ECOM_CAN_BUS_TX_RX_ERR  Transmit or received error.
 *     2  SBG_ECOM_CAN_BUS_OK         The CAN bus is working correctly.
 *     3  SBG_ECOM_CAN_BUS_ERROR      A general error has occurred on the CAN bus.
 * 
 * AIDING_STATUS definition -> Tells which aiding data is received.
 * Bit  Name                           Type  Description
 *  0   SBG_ECOM_AIDING_GPS1_POS_RECV  Mask  Set to 1 when valid GPS 1 position data is received
 *  1   SBG_ECOM_AIDING_GPS1_VEL_RECV  Mask  Set to 1 when valid GPS 1 velocity data is received
 *  2   SBG_ECOM_AIDING_GPS1_HDT_RECV  Mask  Set to 1 when valid GPS 1 true heading data is received
 *  3   SBG_ECOM_AIDING_GPS1_UTC_RECV  Mask  Set to 1 when valid GPS 1 UTC time data is received
 *  4   SBG_ECOM_AIDING_GPS2_POS_RECV  Mask  Set to 1 when valid GPS 2 position data is received
 *  5   SBG_ECOM_AIDING_GPS2_VEL_RECV  Mask  Set to 1 when valid GPS 2 velocity data is received
 *  6   SBG_ECOM_AIDING_GPS2_HDT_RECV  Mask  Set to 1 when valid GPS 2 true heading data is received
 *  7   SBG_ECOM_AIDING_GPS2_UTC_RECV  Mask  Set to 1 when valid GPS 2 UTC time data is received
 *  8   SBG_ECOM_AIDING_MAG_RECV       Mask  Set to 1 when valid Magnetometer data is received
 *  9   SBG_ECOM_AIDING_ODO_RECV       Mask  Set to 1 when Odometer pulse is received
 * 10   SBG_ECOM_AIDING_DVL_RECV       Mask  Set to 1 when valid DVL data is received
 * 11   SBG_ECOM_AIDING_USBL_RECV      Mask  Set to 1 when valid USBL data is received
 * 12   SBG_ECOM_AIDING_DEPTH_RECV     Mask  Set to 1 when valid Depth sensor data is received
 * 13   SBG_ECOM_AIDING_AIR_DATA_RECV  Mask  Set to 1 when valid altitude and/or airspeed is received
 */
const getGeneralStatus = (generalStatus: number): object => {
  return {
    mainPowerOK: bit_test(generalStatus, 0),
    imuPowerOK: bit_test(generalStatus, 1),
    gpsPowerOK: bit_test(generalStatus, 2),
    settingsOK: bit_test(generalStatus, 3),
    temperatureOK: bit_test(generalStatus, 4),
    dataloggerOK: bit_test(generalStatus, 5),
    cpuOK: bit_test(generalStatus, 6),
  }
}

enum CANBusStatus {
  SBG_ECOM_CAN_BUS_OFF = 'SBG_ECOM_CAN_BUS_OFF',
  SBG_ECOM_CAN_BUS_TX_RX_ERR = 'SBG_ECOM_CAN_BUS_TX_RX_ERR',
  SBG_ECOM_CAN_BUS_OK = 'SBG_ECOM_CAN_BUS_OK',
  SBG_ECOM_CAN_BUS_ERROR = 'SBG_ECOM_CAN_BUS_ERROR',
  UNKNOWN = 'UNKNOWN'
}

const getCANBusStatus = (comstatus: number) => {
  /** Value  Bit 30 Bit 29 Bit 28  State  
   *    0       0      0      0    SBG_ECOM_CAN_BUS_OFF  
   *    1       0      0      1    SBG_ECOM_CAN_BUS_TX_RX_ERR  
   *    2       0      1      0    SBG_ECOM_CAN_BUS_OK  
   *    3       1      0      0    SBG_ECOM_CAN_BUS_ERROR
   *  other     x      y      z    UNKNOWN  
   */
  const bit28 = bit_test(comstatus, 28)
  const bit29 = bit_test(comstatus, 29)
  const bit30 = bit_test(comstatus, 30)
  if (!bit28 && !bit29 && !bit30) return CANBusStatus.SBG_ECOM_CAN_BUS_OFF
  if (bit28 && !bit29 && !bit30) return CANBusStatus.SBG_ECOM_CAN_BUS_TX_RX_ERR
  if (!bit28 && bit29 && !bit30) return CANBusStatus.SBG_ECOM_CAN_BUS_OK
  if (!bit28 && !bit29 && bit30) return CANBusStatus.SBG_ECOM_CAN_BUS_ERROR
  return CANBusStatus.UNKNOWN
}

const getComStatus = (comStatus: number): object => {
  return {
    portAValid: bit_test(comStatus, 0),
    portBValid: bit_test(comStatus, 1),
    portCValid: bit_test(comStatus, 2),
    portDValid: bit_test(comStatus, 3),
    portEValid: bit_test(comStatus, 4),
    portARXOK: bit_test(comStatus, 5),
    portATXOK: bit_test(comStatus, 6),
    portBRXOK: bit_test(comStatus, 7),
    portBTXOK: bit_test(comStatus, 8),
    portCRXOK: bit_test(comStatus, 9),
    portCTXOK: bit_test(comStatus, 10),
    portDRXOK: bit_test(comStatus, 11),
    portDTXOK: bit_test(comStatus, 12),
    portERXOK: bit_test(comStatus, 13),
    portETXOK: bit_test(comStatus, 14),
    eth0Valid: bit_test(comStatus, 15),
    eth1Valid: bit_test(comStatus, 16),
    eth2Valid: bit_test(comStatus, 17),
    eth3Valid: bit_test(comStatus, 18),
    eth4Valid: bit_test(comStatus, 19),
    canValid: bit_test(comStatus, 25),
    canRXOK: bit_test(comStatus, 26),
    canTXOK: bit_test(comStatus, 27),
    canBus: getCANBusStatus(comStatus)
  }
}

const getAidingStatus = (aidingStatus: number): object => {
  return {
    gps1Position: bit_test(aidingStatus, 0),
    gps1Velocity: bit_test(aidingStatus, 1),
    gps1Heading: bit_test(aidingStatus, 2),
    gps1UTCTime: bit_test(aidingStatus, 3),
    gps2Position: bit_test(aidingStatus, 4),
    gps2Velocity: bit_test(aidingStatus, 5),
    gps2Heading: bit_test(aidingStatus, 6),
    gps2UTCTime: bit_test(aidingStatus, 7),
    magnetometer: bit_test(aidingStatus, 8),
    odometer: bit_test(aidingStatus, 9),
    dvl: bit_test(aidingStatus, 10),
    usbl: bit_test(aidingStatus, 11),
    depthSensor: bit_test(aidingStatus, 12),
    airData: bit_test(aidingStatus, 13),
  }
}

export const SBG_ECOM_LOG_STATUS = (payload: Buffer): SBGParsedData => {
  const name = 'SBG_ECOM_LOG_STATUS'
  const data = {
      timestamp: payload.readUIntLE(0, 4),
      generalStatus: payload.readUIntLE(4, 2),
      reserved1: payload.readUIntLE(6, 2),
      comStatus: payload.readUIntLE(8, 4),
      aidingStatus: payload.readUIntLE(12, 4),
      reserved2: payload.readUIntLE(16, 4),
      reserved3: payload.readUIntLE(20, 2),
      uptime: payload.readUIntLE(22, 4),
      metadata: {
        generalStatus: {},
        comStatus: {},
        aidingStatus: {}
      }
  }
  data.metadata = {
    generalStatus: getGeneralStatus(data.generalStatus),
    comStatus: getComStatus(data.comStatus),
    aidingStatus: getAidingStatus(data.aidingStatus)
  }
  return { name, data }
}
