export type SBGLargeFrameDataBuffer = {
  transmissionID: number,
  pageIndex: number,
  pages: number,
  data: Buffer
}
export type SBGLargeFrameData = {
  transmissionID: number,
  pageIndex: number,
  pages: number,
  data: null | object
}

export type SBGPayload = Buffer

export type SBGFramePayload = {
  header: SBGHeader,
  payload: SBGPayload,
  footer: SBGFooter
}

export type SBGFramePayloadBuffer = {
  sbgFramePayload: SBGFramePayload | null,
  frame: Buffer
}

export type SBGParsedData = {
  name: string,
  data: object
}

export type SBGDataParser = (payload: Buffer) => SBGParsedData

export type SBGFrameNameData = {
  name: string,
  data: SBGData,
}

export type SBGFrameData = {
  name: string,
  type: SBGFrameType,
  format: SBGFrameFormat,
  data: SBGData,
}

export enum SBGFrameMessageClass {
  CMD = 0x10,
  LOG = 0x00,
  HIGH_FREQ = 0x01,
  NMEA_STANDARD = 0x02,
  NMEA_PROPIETARY = 0x03,
  THIRD_PARTY = 0x04,
}

export enum SBGFrameType {
  CMD = 'command',
  LOG = 'log',
  HIGH_FREQ = 'high-frequency',
  NMEA_STANDARD = 'nmea-standard',
  NMEA_PROPIETARY = 'nmea-propietary',
  THIRD_PARTY = 'thid-party',
  UNKNOWN = 'unknown'
}

export enum SBGFrameFormat {
  STANDARD = 'standard',
  LARGE = 'large'
}

export type SBGBufferFrame = {
  startIndex?: number,
  endIndex?: number,
  frame: Buffer
}

export type SBGHeader = {
  sync: Buffer,
  messageID: number,
  messageClass: number,
  length: number
}

export type SBGData = null | object | SBGLargeFrameData

export type SBGFooter = {
  crc: number,
  ext: Buffer
}

export type SBGFrame = {
  header: SBGHeader,
  data: SBGData,
  footer: SBGFooter
}

export type SBGFrameResponse = {
  name: string,
  type: SBGFrameType,
  format: SBGFrameFormat,
  frame: SBGFrame,
  buffer: SBGBufferFrame
}

// SBFResponse -> Union type of all supported firmware Frames
export type SBGResponse = {
  raw: Buffer,
  frames: SBGFrameResponse[]
}

export type SBGParser = (data: Buffer) => SBGResponse

export type Parser = (data: any) => SBGResponse