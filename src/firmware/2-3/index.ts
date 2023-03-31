
import { SYNC_FLAG, SYNC_LENTGH } from '../../constants'
import { SBGResponse } from '../../types'
import { getSBGFrameResponse } from './frame'

export const getSBGFrames = (data: Buffer): SBGResponse => {
  // Response
  const response: SBGResponse = {
    raw: data,
    frames: []
  }
  // Pivot index
  let pivot = 0
  // Routine
  while (true) {
    // Look for the first index
    const index = data.indexOf(SYNC_FLAG, pivot)
    if (index === -1) break
    // Get SBF Frame Response
    const subbuffer = data.subarray(index)
    const sbgFrame = getSBGFrameResponse(subbuffer)
    // Next iteration
    if (sbgFrame === null) {
      pivot = index + SYNC_LENTGH
      continue
    }
    // Add buffer info
    sbgFrame.buffer.startIndex = index
    sbgFrame.buffer.endIndex = sbgFrame.buffer.startIndex + sbgFrame.buffer.frame.length
    // Add frame
    response.frames.push(sbgFrame)
    // Next iteration
    pivot = index + sbgFrame.buffer.frame.length
  }
  // Response
  return response
}