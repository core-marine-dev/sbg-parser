export type SBGLargeFrameDataBuffer = {
  transmissionID: number,
  pageIndex: number,
  pages: number,
  data: Buffer
}

export interface SBGFrameNameData {
  name: string,
  data: SBGData,
}

export interface SBGFrameNameTypeData extends SBGFrameNameData {
  type: SBGFrameType
}

export interface SBGFrameData extends SBGFrameNameTypeData {
  format: SBGFrameFormat
}

export type SBGDataParser = (payload: Buffer) => SBGFrameNameData

export type SBGFrameParser = (messageClass: number,  messageID: number, payload: Buffer) => SBGFrameNameTypeData

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

export type SBGHeader = {
  sync: Buffer,
  messageID: number,
  messageClass: number,
  length: number
}

export type SBGData = object | null

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
  buffer: Buffer
}

export type SBGParser = (messageClass: number, messageID: number, payload: Buffer) => SBGFrameData

