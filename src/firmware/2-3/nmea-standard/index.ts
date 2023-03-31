import { SBGFrameData, SBGFrameFormat, SBGFrameType } from "../../../types";

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  const sbgframedata: SBGFrameData = {
    name: 'nmea-standard',
    type: SBGFrameType.NMEA_STANDARD,
    format: SBGFrameFormat.STANDARD,
    data: {}
  }
  return sbgframedata
}