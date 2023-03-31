import { SBGParser } from "../types"
import { getSBGFrames as getSBGFrames2_3 } from "./2-3"

// Firmwares
const firmwareParsers = new Map<string, SBGParser>()
// Add Firmwares
firmwareParsers.set('2.3', getSBGFrames2_3)


const getFirmwares = () => Array.from(firmwareParsers.keys())

const getFirmareParser = (firmare: any) => firmwareParsers.get(firmare)

const isAvailableFirmware = (firmware: any): boolean => firmwareParsers.has(firmware)

const throwFirmwareError = () => {
  // const fmws = new Intl.ListFormat('en', { type: 'unit' }).format(getFirmwares())
  const fmws = Array.from(getFirmwares()).join(', ')
  const error = `Supported firmwares are -> ${fmws}`
  throw new Error(error)
}


// Export
export {
  getFirmwares,
  getFirmareParser,
  isAvailableFirmware,
  throwFirmwareError
}