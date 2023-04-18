import { SBGFrameFormat, SBGFrameType } from "./types"

// ALL FRAMES
export const SYNC_FLAG     = Buffer.from([0xff, 0x5a])
export const SYNC_INDEX    = 0
export const SYNC_LENTGH   = 2

export const ID_INDEX      = 2
export const ID_LENGTH     = 1

export const CLASS_INDEX   = 3
export const CLASS_LENGTH  = 1

export const LENGTH_INDEX  = 4
export const LENGTH_LENGTH = 2

export const PAYLOAD_INDEX = 6

export const CRC_LENGTH = 2

export const EXT_FLAG = Buffer.from([0x33])
export const EXT_LENGTH = 1

export const MINIMAL_FRAME_LENGTH = SYNC_LENTGH + ID_LENGTH + CLASS_LENGTH + LENGTH_LENGTH + CRC_LENGTH + EXT_LENGTH
// LARGE FRAME
export const STANDARD_FRAME_MAXIMUM_CLASS_BYTELENGTH = 4096
export const LARGE_FRAME_MINIMUM_CLASS = Buffer.from([0x80]).readUInt8()
export const TRANSMISSION_ID_INDEX = 6

export const TRANSMISSION_ID_LENGTH = 1

export const PAGE_INDEX_INDEX = 7
export const PAGE_INDEX_LENGTH = 2

export const PAGES_INDEX = 9
export const PAGES_LENGTH = 2

export const DATA_INDEX = 11

// UNKOWN MESSAGE
export const UNKNOWN_SBG_FRAME_DATA = {
  name: 'unknown',
  type: SBGFrameType.UNKNOWN,
  format: SBGFrameFormat.STANDARD,
  data: null
}
