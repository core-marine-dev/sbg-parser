import { SBGFrame, SBGFrameData, SBGFrameResponse } from '../../types'
import { getSBGData } from './data'
import { getSBGFramePayloadBuffer } from './payload'

export const getSBGFrameResponse = (data: Buffer): SBGFrameResponse | null => {
    // Frame in buffer without parsing payload
    const { frame, sbgFramePayload } = getSBGFramePayloadBuffer(data)
    if (sbgFramePayload === null) return null
    // Data from Payload
    const { messageID, messageClass } = sbgFramePayload.header
    const sbgdata: SBGFrameData = getSBGData(messageClass, messageID, sbgFramePayload.payload)
    // SBG Frame
    const sbgframe: SBGFrame = {
        header: sbgFramePayload.header,
        data: sbgdata?.data || null,
        footer: sbgFramePayload.footer
    }
    // Response
    const sbgframeRespose: SBGFrameResponse = {
        name: sbgdata?.name,
        type: sbgdata?.type,
        format: sbgdata?.format,
        frame: sbgframe,
        buffer: {
            frame
        }
    }
    return sbgframeRespose
}