import { Parser, SBGParser, SBGResponse } from "./types"
import { getBufferData } from "./utils"
import { getFirmwares, getFirmareParser, isAvailableFirmware, throwFirmwareError } from "./firmware"

// Parsers
const getSBGParser = (firmware: any): Parser => {
  // Not supported Firmware
  const fn = getFirmareParser(firmware) as SBGParser
  if (!isAvailableFirmware(firmware)) throwFirmwareError()
  const parseData: Parser = (data: any): SBGResponse => {
    const buffer = getBufferData(data)
    return fn(buffer)
  }
  return parseData
}


export {
  getFirmwares as availableFirmwares,
  getSBGParser as getParser
}
