import MachineContext from '@/main'
import { MidiDeviceSupported, SamplerError } from '@/types'

type MidiDevicePort = 'input' | 'output'
type MidiDeviceType = 'vmi' | 'midi'
type MidiDeviceStatus = 'connected' | 'disconnected'

export default class MidiDeviceInput {
  constructor(
    vmContext: MachineContext,
    device: WebMidi.MIDIInput | MachineContext
  ) {
    this._vmContext = vmContext
    this._device = device
    this._id = device.id
    this._name = device.name || 'unnamed'
    this._manufacturer = device.manufacturer || 'unknown'
    this._type = device.type === 'vmi' ? 'vmi' : 'midi'
    this._status = 'disconnected'

    if (!(this._device instanceof MachineContext)) {
      this._device.onmidimessage = data => {
        console.log(data)
      }
    }
  }

  private _vmContext: MachineContext
  private _device: WebMidi.MIDIInput | MachineContext
  private _id: string
  private _name: string
  private _manufacturer: string
  private _type: MidiDeviceType
  private _status: MidiDeviceStatus

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get manufacturer(): string {
    return this._manufacturer
  }

  public get port(): MidiDevicePort {
    return 'input'
  }

  public get type(): MidiDeviceType {
    return this._type
  }

  public get status(): MidiDeviceStatus {
    return this._status
  }

  public connect(): void {
    if (this._status === 'connected') return
    try {
      this._status = 'connected'
      if (this._device instanceof MachineContext) {
        const device = this._device.devices.input.find(
          d => d.id === this._vmContext.id
        )
        if (device) device.connect()
        else throw new Error('Device not found')
      }
    } catch (e) {
      this._status = 'disconnected'
      throw e
    }
  }

  public disconnect(): void {
    this._status = 'disconnected'
  }

  public send?: (data: number[] | Uint8Array, timestamp?: number) => void
  private _send(data: number[] | Uint8Array, timestamp?: number): void {
    if (this._status === 'disconnected') {
      throw new SamplerError(
        'Device is disconnected. To send a messages connect it first.'
      )
    }
    const device = this._device as WebMidi.MIDIOutput | MachineContext
    device.send(data, timestamp)
  }
}
