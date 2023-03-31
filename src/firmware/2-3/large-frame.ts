import { PAGES_LENGTH, PAGE_INDEX_LENGTH, TRANSMISSION_ID_LENGTH } from "../../constants";
import { SBGLargeFrameDataBuffer } from "../../types";


export const getSBGLargeFrameDataBuffer = (payload: Buffer): SBGLargeFrameDataBuffer => {
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