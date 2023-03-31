import { crc16kermit } from 'crc'
import { CLASS_LENGTH, CRC_LENGTH, ID_INDEX, ID_LENGTH, LENGTH_LENGTH, STANDARD_FRAME_MAXIMUM_CLASS_BYTELENGTH } from './constants'

export const getBufferData = (data: any): Buffer => {
  if (Buffer.isBuffer(data)) return data
  if (typeof data === 'string') return Buffer.from(data, 'ascii')
  try {
    return Buffer.from(data)
  } catch (error) {
    console.error(error)
    throw new Error('Input data should be binary or string ascii data')
  }
}

export const isValidFrame = (frame: Buffer, payloadLength: number): boolean => {
    const dataIndex = ID_INDEX
    const crcIndex = dataIndex + ID_LENGTH + CLASS_LENGTH + LENGTH_LENGTH + payloadLength
    const data = frame.subarray(dataIndex, crcIndex)
    const computedCRC = crc16kermit(data)
    const crc = frame.readUIntLE(crcIndex, CRC_LENGTH)
    // console.debug(`CRC = ${crc} | calculated = ${computedCRC}`)
    return computedCRC === crc
}

export const bit_test = (num: number, bit: number): boolean => (num >> bit) % 2 != 0

export const isLargeFrame = (length: number) => length > STANDARD_FRAME_MAXIMUM_CLASS_BYTELENGTH