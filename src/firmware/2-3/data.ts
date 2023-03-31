import { SBGFrameData, SBGFrameMessageClass } from "../../types";
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
export const getSBGData = (messageClass: number,  messageID: number, payload: Buffer): SBGFrameData => {
  switch (messageClass) {
    case SBGFrameMessageClass.CMD:
      return getCommand(messageID, payload)
    case SBGFrameMessageClass.LOG:
      return getLog(messageID, payload)
    case SBGFrameMessageClass.HIGH_FREQ:
      return getHighFrequency(messageID, payload)
    case SBGFrameMessageClass.NMEA_STANDARD:
      return getNMEAStandard(messageID, payload)
    case SBGFrameMessageClass.NMEA_PROPIETARY:
      return getNMEAPropietary(messageID, payload)
    case SBGFrameMessageClass.THIRD_PARTY:
      return getThirdParty(messageID, payload)
  }
  return UNKNOWN_SBG_FRAME_DATA
}