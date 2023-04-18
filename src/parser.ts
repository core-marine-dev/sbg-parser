import { 
  SYNC_FLAG, SYNC_LENTGH,
  ID_INDEX, ID_LENGTH,
  CLASS_INDEX, CLASS_LENGTH,
  CRC_LENGTH,
  LENGTH_INDEX, LENGTH_LENGTH,
  PAYLOAD_INDEX,
  EXT_FLAG, EXT_LENGTH,
  MINIMAL_FRAME_LENGTH,
  TRANSMISSION_ID_LENGTH, PAGES_LENGTH, PAGE_INDEX_LENGTH,
  UNKNOWN_SBG_FRAME_DATA
} from "./constants"
import { getFirmareParser, getFirmwares, isAvailableFirmware, throwFirmwareError } from "./firmware"
import { SBGFrameFormat, SBGLargeFrameDataBuffer, SBGFrameData, SBGHeader, SBGFooter, SBGFrameResponse, SBGFrameParser } from "./types"
import { isLargeFrame, nextFrameIndex } from "./utils"

export class Parser {
  // Internal Buffer
  protected _buffer: Buffer = Buffer.from([])
  // Firmware
  protected _firmware: string = '2.3'
  protected _parser: SBGFrameParser = getFirmareParser('2.3')
  get firmware() { return this._firmware }
  set firmware(fw: string) {
    if (typeof fw !== 'string') throw new Error('firmware has to be a string')
    if (!isAvailableFirmware(fw)) throwFirmwareError()
    this._firmware = fw
    this._parser = getFirmareParser(fw)
  }
  // Memory
  protected _memory: boolean = false
  get memory() { return this._memory }
  set memory(mem: boolean) {
    if (typeof mem !== 'boolean') throw new Error('memory has to be boolean')
    this._memory = mem
  }

  constructor(firmware: string = '2.3', memory: boolean = false) {
    this.firmware = firmware
    this.memory = memory
  }

  getAvailableFirmwares(): string[] {
    return getFirmwares()
  }

  addData(data: Buffer) {
    if (!Buffer.isBuffer(data)) { throw new Error('data has to be a Buffer') }
    this._buffer = (this._memory)
      ? Buffer.concat([this._buffer, data])
      : data
  }

  getFrames(): SBGFrameResponse[] {
    let frames = [] as SBGFrameResponse[]
    do {
      // Get start of next frame
      const index = this._buffer.indexOf(SYNC_FLAG)
      if (index === -1) break
      // Refactor buffer
      this._buffer = this._buffer.subarray(index)
      // Check buffer has the minimun length
      if (this._buffer.length < MINIMAL_FRAME_LENGTH) break
      // Get frame
      const sbgframe = this.getSBGFrame()
      if (sbgframe === null) {
        this._buffer = this._buffer.subarray(SYNC_FLAG.length)
        continue
      }
      // Add frame
      frames.push(sbgframe)
      this._buffer = this._buffer.subarray(nextFrameIndex(sbgframe.frame.header.length))
    } while (true)
    return frames
  }

  protected getSBGFrame(): SBGFrameResponse | null {
    // HEADER
    const header = this.getHeader(this._buffer)
    // Check length
    if (this._buffer.subarray(PAYLOAD_INDEX).length < (header.length + CRC_LENGTH + EXT_LENGTH)) {
      console.warn('getSBGFrame: SBG Frame is incomplete')
      return null
    }
    // FOOTER
    const footer = this.getFooter(header.length)
    // Check ext
    if (Buffer.compare(footer.ext, EXT_FLAG) !== 0) {
      console.warn(`getSBGFrame: Invalid EXT Flag\nshould be ${EXT_FLAG} -> get it ${footer.ext}`)
      return null
    }
    // PAYLOAD
    const payload = this._buffer.subarray(PAYLOAD_INDEX, PAYLOAD_INDEX + header.length)
    // 1. Format -> Standard / Large Frame
    // 2. If Large, get metadata large and subpayload
    // 3. Get name + data from payload / subpayload

    const sbgdata = this.getPayloadData(header.length, header.messageClass, header.messageID, payload)
    // BUFFER
    const buffer = this.getBuffer(header.length)
    // RETURN
    return {
      name: sbgdata.name,
      type: sbgdata.type,
      format: sbgdata.format,
      frame: {
        header,
        data: sbgdata.data,
        footer
      },
      buffer
    }
  }

  protected getHeader(frame: Buffer): SBGHeader {
    return {
      sync: frame.subarray(0, SYNC_LENTGH),
      messageID: frame.readUIntLE(ID_INDEX, ID_LENGTH),
      messageClass: frame.readUIntLE(CLASS_INDEX, CLASS_LENGTH),
      length: frame.readUIntLE(LENGTH_INDEX, LENGTH_LENGTH),
    }
  }

  protected getFooter(length: number): SBGFooter {
    const startIndex = PAYLOAD_INDEX + length
    const endIndex = startIndex + CRC_LENGTH + EXT_LENGTH
    const footer = this._buffer.subarray(startIndex, endIndex)
    return {
      crc: footer.readUIntLE(0, 2),
      ext: footer.subarray(-1)
    }
  }

  protected getPayloadData(length: number, messageClass: number, messageID: number, payload: Buffer): SBGFrameData {
    const sbgFrame: SBGFrameData = UNKNOWN_SBG_FRAME_DATA
    if (isLargeFrame(length)) {
      const { data: subpayload, ...largedata } = this.getLargeFrameMetadata(payload)
      const { name, type, data } = this._parser(messageClass, messageID, payload)
      sbgFrame.name = name
      sbgFrame.format = SBGFrameFormat.LARGE
      sbgFrame.type = type
      sbgFrame.data = {...largedata, data }
      
    } else {
      const { name, type, data } = this._parser(messageClass, messageID, payload)
      sbgFrame.name = name
      sbgFrame.format = SBGFrameFormat.STANDARD
      sbgFrame.type = type
      sbgFrame.data = data
    }
    return sbgFrame
  }

  protected getLargeFrameMetadata(payload: Buffer): SBGLargeFrameDataBuffer {
    const transmissionIDIndex = 0
    const pageIndex = transmissionIDIndex + TRANSMISSION_ID_LENGTH
    const pagesIndex = pageIndex + PAGE_INDEX_LENGTH
    const dataIndex = pagesIndex + PAGES_LENGTH
    return {
      transmissionID: payload.readUIntLE(transmissionIDIndex, TRANSMISSION_ID_LENGTH),
      pageIndex: payload.readUIntLE(pageIndex, PAGE_INDEX_LENGTH),
      pages: payload.readUIntLE(pagesIndex, PAGES_LENGTH),
      data: payload.subarray(dataIndex)
    }
  }

  protected getBuffer(length: number): Buffer {
    return this._buffer.subarray(0, nextFrameIndex(length))
  }

}
