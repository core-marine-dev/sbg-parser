import { SBGFrameData, SBGFrameFormat, SBGFrameType } from "../../../types";

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  const sbgframedata: SBGFrameData = {
    name: 'high-frquency',
    type: SBGFrameType.HIGH_FREQ,
    format: SBGFrameFormat.STANDARD,
    data: {}
  }
  return sbgframedata
}