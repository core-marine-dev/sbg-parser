import { bit_test } from "../../../utils"

/* SOLUTION_STATUS definition -> Provide information on the internal Kalman filter status such as which aiding data is used to compute the solution and the provided solution mode.
 *  Bit  Type  Name                         Description
 * [0-3] Enum  SBG_ECOM_SOLUTION_MODE       Defines the Kalman filter computation mode (see the table 39 below)
 *   4   Mask  SBG_ECOM_SOL_ATTITUDE_VALID  Set to 1 if Attitude data is reliable (Roll/Pitch error < 0,5°)
 *   5   Mask  SBG_ECOM_SOL_HEADING_VALID   Set to 1 if Heading data is reliable (Heading error < 1°)
 *   6   Mask  SBG_ECOM_SOL_VELOCITY_VALID  Set to 1 if Velocity data is reliable (velocity error < 1.5 m/s)
 *   7   Mask  SBG_ECOM_SOL_POSITION_VALID  Set to 1 if Position data is reliable (Position error < 10m)
 *   8   Mask  SBG_ECOM_SOL_VERT_REF_USED   Set to 1 if vertical reference is used in solution
 *   9   Mask  SBG_ECOM_SOL_MAG_REF_USED    Set to 1 if magnetometer is used in solution
 *  10   Mask  SBG_ECOM_SOL_GPS1_VEL_USED   Set to 1 if GPS velocity is used in solution
 *  11   Mask  SBG_ECOM_SOL_GPS1_POS_USED   Set to 1 if GPS Position is used in solution
 *  13   Mask  SBG_ECOM_SOL_GPS1_HDT_USED   Set to 1 if GPS True Heading is used in solution
 *  14   Mask  SBG_ECOM_SOL_GPS2_VEL_USED   Set to 1 if GPS2 velocity is used in solution
 *  15   Mask  SBG_ECOM_SOL_GPS2_POS_USED   Set to 1 if GPS2 Position is used in solution
 *  17   Mask  SBG_ECOM_SOL_GPS2_HDT_USED   Set to 1 if GPS2 True Heading is used in solution
 *  18   Mask  SBG_ECOM_SOL_ODO_USED        Set to 1 if Odometer is used in solution
 *  19   Mask  SBG_ECOM_SOL_DVL_BT_USED     Set to 1 if DVL Bottom Tracking is used in solution
 *  20   Mask  SBG_ECOM_SOL_DVL_WT_USED     Set to 1 if DVL Water Layer is used in solution
 *  24   Mask  SBG_ECOM_SOL_USBL_USED       Set to 1 if USBL / LBL is used in solution.
 *  25   Mask  SBG_ECOM_SOL_AIR_DATA_USED   Set to 1 if an altitude or true airspeed is used in solution
 *  26   Mask  SBG_ECOM_SOL_ZUPT_USED       Set to 1 if a ZUPT is used in solution
 *  27   Mask  SBG_ECOM_SOL_ALIGN_VALID     Set to 1 if sensor alignment and calibration parameters are valid
 *  28   Mask  SBG_ECOM_SOL_DEPTH_USED      Set to 1 if Depth sensor (for subsea navigation) is used in solution
 * 
 * SBG_ECOM_SOLUTION_MODE enumeration
 * Value Name                             Description
 *   0   SBG_ECOM_SOL_MODE_UNINITIALIZED  The Kalman filter is not initialized and the returned data are all invalid.
 *   1   SBG_ECOM_SOL_MODE_VERTICAL_GYRO  The Kalman filter only rely on a vertical reference to compute roll and pitch angles. Heading and navigation data drift freely.
 *   2   SBG_ECOM_SOL_MODE_AHRS           A heading reference is available, the Kalman filter provides full orientation but navigation data drift freely.
 *   3   SBG_ECOM_SOL_MODE_NAV_VELOCITY   The Kalman filter computes orientation and velocity. Position is freely integrated from velocity estimation.
 *   4   SBG_ECOM_SOL_MODE_NAV_POSITION   Nominal mode, the Kalman filter computes all parameters (attitude, velocity, position). Absolute position is provided.
*/
enum SolutionMode {
  SBG_ECOM_SOL_MODE_UNINITIALIZED = 'SBG_ECOM_SOL_MODE_UNINITIALIZED',
  SBG_ECOM_SOL_MODE_VERTICAL_GYRO = 'SBG_ECOM_SOL_MODE_VERTICAL_GYRO',
  SBG_ECOM_SOL_MODE_AHRS = 'SBG_ECOM_SOL_MODE_AHRS',
  SBG_ECOM_SOL_MODE_NAV_VELOCITY = 'SBG_ECOM_SOL_MODE_NAV_VELOCITY',
  SBG_ECOM_SOL_MODE_NAV_POSITION = 'SBG_ECOM_SOL_MODE_NAV_POSITION',
  UNKNOWN = 'UNKNOWN'
}

const getSolutionMode = (num: number) => {
    const bit0 = bit_test(num, 0)
    const bit1 = bit_test(num, 1)
    const bit2 = bit_test(num, 2)
    const bit3 = bit_test(num, 3)
    if (!bit3 && !bit2 && !bit1 && !bit0) return 'SBG_ECOM_SOL_MODE_UNINITIALIZED'
    if (!bit3 && !bit2 && !bit1 &&  bit0) return 'SBG_ECOM_SOL_MODE_VERTICAL_GYRO'
    if (!bit3 && !bit2 &&  bit1 && !bit0) return 'SBG_ECOM_SOL_MODE_AHRS'
    if (!bit3 && !bit2 &&  bit1 &&  bit0) return 'SBG_ECOM_SOL_MODE_NAV_VELOCITY'
    if (!bit3 &&  bit2 && !bit1 && !bit0) return 'SBG_ECOM_SOL_MODE_NAV_POSITION'
    return 'UNKNOWN'
}
export const getSolutionStatus = (number: number) => {
  return {
      mode: getSolutionMode(number),
      attitude: bit_test(number, 4),
      heading: bit_test(number, 5),
      velocity: bit_test(number, 6),
      position: bit_test(number, 7),
      verticalReference: bit_test(number, 8),
      magnetometerReference: bit_test(number, 9),
      gps1Velocity: bit_test(number, 10),
      gps1Position: bit_test(number, 11),
      gps1Heading: bit_test(number, 13),
      gps2Velocity: bit_test(number, 14),
      gps2Position: bit_test(number, 15),
      gps2Heading: bit_test(number, 17),
      odometer: bit_test(number, 18),
      dvlBotom: bit_test(number, 19),
      dvlWater: bit_test(number, 20),
      usbl: bit_test(number, 24),
      airData: bit_test(number, 25),
      zupt: bit_test(number, 26),
      align: bit_test(number, 27),
      depth: bit_test(number, 28),
  }
}