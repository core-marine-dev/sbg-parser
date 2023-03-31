import { CRC_LENGTH, EXT_LENGTH, PAYLOAD_INDEX } from "../../constants"
import { SBGFooter } from "../../types"

export const getSBGFooter = (frame: Buffer, length: number): SBGFooter => {
    const startIndex = PAYLOAD_INDEX + length
    const endIndex = startIndex + CRC_LENGTH + EXT_LENGTH
    const footer = frame.subarray(startIndex, endIndex)
    return {
        crc: footer.readUIntLE(0, 2),
        ext: footer.subarray(-1)
    }
}
