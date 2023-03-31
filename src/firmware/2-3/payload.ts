import { CRC_LENGTH, EXT_FLAG, EXT_LENGTH, MINIMAL_FRAME_LENGTH, PAYLOAD_INDEX, SYNC_FLAG } from "../../constants";
import { SBGFramePayloadBuffer } from "../../types";
import { isValidFrame } from "../../utils";
import { getSBGFooter } from "./footer";
import { getSBGHeader } from "./header";

export const getSBGFramePayloadBuffer = (data: Buffer): SBGFramePayloadBuffer => {
  // NULL Response
  const response = {
    sbgFramePayload: null,
    frame: data
  }
  // Start Frame
  const startIndex = data.indexOf(SYNC_FLAG)
  if (startIndex === -1) {
    console.warn('getSBGFrame: There\'s no SBG Frame at the data')
    return response
  }
  let frame = data.subarray(startIndex)
  // Check if there is enough data
  if (frame.length < MINIMAL_FRAME_LENGTH) {
    console.warn('getSBGFrame: There\'s not enough data to parse')
    return response
  }
  // Header
  const header = getSBGHeader(frame)
  // Check if there is enough data
  if (frame.subarray(PAYLOAD_INDEX).length < (header.length + CRC_LENGTH + EXT_LENGTH)) {
    console.warn('getSBGFrame: SBG Frame is incomplete')
    return response
  }
  // Footer
  const footer = getSBGFooter(frame, header.length)
  if (footer.ext.readUInt8() !== EXT_FLAG.readUInt8()) {
    console.warn(`getSBGFrame: Invalid EXT Flag\nshould be ${EXT_FLAG} -> get it ${footer.ext}`)
    return response
  }
  const endIndex = PAYLOAD_INDEX + header.length + CRC_LENGTH + EXT_LENGTH
  frame = frame.subarray(0, endIndex)
  // Check CRC
  if (!isValidFrame(frame, header.length)) {
    console.warn('getSBGFrame: SBG Frame has invalid CRC')
    return response
  }
  // Get rest data of Standard or Large Frame
  const payload = frame.subarray(PAYLOAD_INDEX, PAYLOAD_INDEX + header.length)
  // Rest
  return {
    sbgFramePayload: { header, payload, footer },
    frame: frame
  }
}
