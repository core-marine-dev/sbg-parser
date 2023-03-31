import { CLASS_INDEX, CLASS_LENGTH, ID_INDEX, ID_LENGTH, LENGTH_INDEX, LENGTH_LENGTH, SYNC_LENTGH } from "../../constants"
import { SBGHeader } from "../../types"


export const getSBGHeader = (frame: Buffer): SBGHeader => {
    return {
        sync: frame.subarray(0, SYNC_LENTGH),
        messageID: frame.readUIntLE(ID_INDEX, ID_LENGTH),
        messageClass: frame.readUIntLE(CLASS_INDEX, CLASS_LENGTH),
        length: frame.readUIntLE(LENGTH_INDEX, LENGTH_LENGTH),
    }
}
