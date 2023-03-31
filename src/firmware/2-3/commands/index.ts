import { SBGFrameData, SBGFrameFormat, SBGFrameType } from "../../../types";

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  const sbgframedata: SBGFrameData = {
    name: 'command',
    type: SBGFrameType.CMD,
    format: SBGFrameFormat.STANDARD,
    data: {}
  }
  return sbgframedata
}