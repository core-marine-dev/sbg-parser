import { SBGFrameData, SBGFrameFormat, SBGFrameType } from "../../../types";

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  const sbgframedata: SBGFrameData = {
    name: 'nmea-propietary',
    type: SBGFrameType.NMEA_PROPIETARY,
    format: SBGFrameFormat.STANDARD,
    data: {}
  }
  return sbgframedata
}