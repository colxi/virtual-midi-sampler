import MachineContext from '@/main'
import { SamplerError } from '@/types'
import MidiDeviceInput from '@/midi-devices/midi-device-input'
import MidiDeviceOutput from '@/midi-devices/midi-device-output'

const CYCLIC_CONNECTION_TEST_DURATION = 500

export default class MidiPortsInterface {
  constructor(vmContext: MachineContext) {
    this._vmContext = vmContext
    this.cyclicConnectionsTestRunning = false
    this.cyclicConnectionsDetected = false
    return
  }

  private readonly _vmContext: MachineContext

  public get midiIn(): MidiDeviceInput[] {
    return Object.values(this._vmContext.devices.input).filter(
      d => d.status === 'connected'
    )
  }

  public get midiOut(): MidiDeviceOutput[] {
    return Object.values(this._vmContext.devices.output).filter(
      d => d.status === 'connected'
    )
  }

  public get midiThru(): any /* MidiDeviceOutput */ {
    return true
    //return Object.values(this._vmContext.devices.output).filter(
    //  d => d.status === 'connected'
    //)
  }
  public cyclicConnectionsTestRunning: boolean
  public cyclicConnectionsDetected: boolean

  private async _startCyclicConnectionTest(): Promise<boolean> {
    return new Promise(resolve => {
      /*
      this.cyclicConnectionsTestRunning = true
      this.cyclicConnectionsDetected = false
      this.midiOut.broadcast([0xfe])
      setTimeout(() => {
        const result = this.cyclicConnectionsDetected
        this.cyclicConnectionsTestRunning = false
        this.cyclicConnectionsDetected = false
        resolve(result)
      }, CYCLIC_CONNECTION_TEST_DURATION)
      */
    })
  }

  public async connectDevice(
    device: MidiDeviceInput | MidiDeviceOutput
  ): Promise<void> {
    /*
    if (device.type === 'input' && !this.connected.includes(device)) {
      this.connected.push(device)
      // Web MIDI API Shim does not support addEventListener
      if (device.addEventListener) {
        device.addEventListener('midimessage', this.onMessageListener)
      } else device.onmidimessage = this.onMessageListener
      if (await this._vmContext.port._startCyclicConnectionTest()) {
        this.disconnectDevice(device)
        console.warn(
          `Warning: circular Loop detected when connecting device ${device.id}. Device disconnected.`
        )
      }
    }
    */
  }

  public disconnectDevice(device: WebMidi.MIDIInput): void {
    /*
    if (this.connected.includes(device)) {
      const index = this.connected.indexOf(device)
      this.connected.splice(index, 1)
      // Web MIDI API Shim does not support removeEventListener
      if (device.removeEventListener) {
        device.removeEventListener('midimessage', this.onMessageListener)
      } else
        device.onmidimessage = () => {
          //
        }
    }
    */
  }
}
