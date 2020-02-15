const b10000000: number = 0x80
const b01111111: number = 0x3f
const b00001111: number = 0x0f
const b11110000: number = 0xf0

export default class MidiDEngine {
  constructor() {
    //
  }

  public parse(data: number[]) {
    const statusByte: number = data[0]
    const dataByte1: number = data[1]
    const dataByte2: number = data[2]
    const statusByteNibble1 = statusByte >> 4
    const statusByteNibble2 = statusByte & b00001111
    //console.log('midi event', e.target, e.data)
    console.log(statusByteNibble1, statusByteNibble2)

    const result = {
      binary: data,
      action: '',
      channel: 0,
      key: 0,
      intensity: 0
    }
    switch (statusByteNibble1) {
      case 0x08: {
        // note off
        result.channel = statusByte & b00001111
        result.key = dataByte2 >> 4
        result.intensity = dataByte2 & b00001111
        break
      }
      case 0x09: {
        // note on
        const channel = statusByte & b00001111
        const key = dataByte2 >> 4
        const intensity = dataByte2 & b00001111
        break
      }
    }
  }
}
