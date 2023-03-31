import { UNKNOWN_SBG_FRAME_DATA } from "../../../constants";
import { SBGData, SBGFrameData, SBGFrameFormat, SBGFrameNameData, SBGFrameType } from "../../../types";
import { isLargeFrame } from "../../../utils";
import { getSBGLargeFrameDataBuffer } from '../large-frame'
import { logs } from "./parser";

const isLog = (messageID: number) => logs.has(messageID)

const getNameData = (messageID: number, payload: Buffer): SBGFrameNameData => {
  const parser = logs.get(messageID)
  if (parser) return parser(payload)
  return UNKNOWN_SBG_FRAME_DATA
}

const getNameLargeData = (messageID: number, payload: Buffer): SBGFrameNameData => {
  const largeFrameDataBuffer = getSBGLargeFrameDataBuffer(payload)
  const {name, data} = getNameData(messageID, largeFrameDataBuffer.data)
  return {
    name,
    data: { ...largeFrameDataBuffer, data }
  }
}

export const getSBGFrameData = (messageID: number, payload: Buffer): SBGFrameData => {
  if (!isLog(messageID)) return UNKNOWN_SBG_FRAME_DATA
  const type = SBGFrameType.LOG
  const [format, getter] = (isLargeFrame(payload.length)) ? [SBGFrameFormat.LARGE, getNameLargeData] : [SBGFrameFormat.STANDARD, getNameData]
  const { name, data } = getter(messageID, payload)
  return { name, type, format, data }
}
