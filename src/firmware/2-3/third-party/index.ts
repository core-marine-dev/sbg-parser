import { SBGFrameData, SBGFrameFormat, SBGFrameType } from "../../../types";

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  const sbgframedata: SBGFrameData = {
    name: 'third-party',
    type: SBGFrameType.THIRD_PARTY,
    format: SBGFrameFormat.STANDARD,
    data: {}
  }
  return sbgframedata
}