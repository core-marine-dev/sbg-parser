import { readFileSync } from 'fs'
import { SBGParser, availableFirmwares} from '../src/index'

const SBG_FILE = 'test/sbg-raw.bin'

const content: Buffer = readFileSync(SBG_FILE)

// console.log(content.toString('ascii'))
const firmwares = Array.from(availableFirmwares())
console.log(`Available firmwares = ${firmwares.join(', ')}`)
const firmware = '2.3'

console.log('Leer el fichero')
const parser = new SBGParser()
parser.addData(content)
const response = parser.getFrames()
console.log('parsed')
// console.log(response)
console.log(`responses = ${response.length}`)
response.forEach(res => {
  if (res.name !== 'unknown') { console.dir(res) }
})