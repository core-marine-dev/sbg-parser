
import { SBGFrameMessageClass, SBGFrameNameTypeData, SBGFrameType } from "../../types";
import { getSBGFrameData as getCommand } from "./commands";
import { getSBGFrameData as getLog } from "./logs";
import { getSBGFrameData as getHighFrequency } from "./high-frequency";
import { getSBGFrameData as getNMEAStandard } from "./nmea-standard";
import { getSBGFrameData as getNMEAPropietary } from "./nmea-propietary";
import { getSBGFrameData as getThirdParty } from "./third-party";
import { UNKNOWN_SBG_FRAME_DATA } from "../../constants";
/** Message Class:
 * HEX  DEC  Type
 * 0x10  16  Command
 * 0x00   0  Logs
 * 0x01   1  High frequency output
 * 0x02   2  NMEA output logs
 * 0x03   3  Propietary NMEA output logs
 * 0x04   4  3rd party output
 */
export const getSBGFrame = (messageClass: number,  messageID: number, payload: Buffer): SBGFrameNameTypeData => {
  switch (messageClass) {
    case SBGFrameMessageClass.CMD:
      return {
        type: SBGFrameType.CMD,
        ...getCommand(messageID, payload)
      }
    case SBGFrameMessageClass.LOG:
      return {
        type: SBGFrameType.LOG,
        ...getLog(messageID, payload)
      }
    case SBGFrameMessageClass.HIGH_FREQ:
      return {
        type: SBGFrameType.HIGH_FREQ,
        ...getHighFrequency(messageID, payload)
      }
    case SBGFrameMessageClass.NMEA_STANDARD:
      return {
        type: SBGFrameType.NMEA_STANDARD,
        ...getNMEAStandard(messageID, payload)
      }
    case SBGFrameMessageClass.NMEA_PROPIETARY:
      return {
        type: SBGFrameType.NMEA_PROPIETARY,
        ...getNMEAPropietary(messageID, payload)
      }
    case SBGFrameMessageClass.THIRD_PARTY:
      return {
        type: SBGFrameType.THIRD_PARTY,
        ...getThirdParty(messageID, payload)
      }
  }
  return UNKNOWN_SBG_FRAME_DATA
}