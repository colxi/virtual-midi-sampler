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
    this.#vmContext = vmContext
    this.#device = device
    this.#id = device.id
    this.#name = device.name || 'unnamed'
    this.#manufacturer = device.manufacturer || 'unknown'
    this.#type = device.type === 'vmi' ? 'vmi' : 'midi'
    this.#status = 'disconnected'

    if (!(this.#device instanceof MachineContext)) {
      this.#device.onmidimessage = (data): void => {
        console.log(data)
      }
    }
  }

  #vmContext: MachineContext
  #device: WebMidi.MIDIInput | MachineContext
  #id: string
  #name: string
  #manufacturer: string
  #type: MidiDeviceType
  #status: MidiDeviceStatus

  public get id(): string {
    return this.#id
  }

  public get name(): string {
    return this.#name
  }

  public get manufacturer(): string {
    return this.#manufacturer
  }

  public get port(): MidiDevicePort {
    return 'input'
  }

  public get type(): MidiDeviceType {
    return this.#type
  }

  public get status(): MidiDeviceStatus {
    return this.#status
  }

  public connect(): void {
    if (this.#status === 'connected') return
    try {
      this.#status = 'connected'
      if (this.#device instanceof MachineContext) {
        const device = this.#device.devices.input.find(
          d => d.id === this.#vmContext.id
        )
        if (device) device.connect()
        else throw new Error('Device not found')
      }
    } catch (e) {
      this.#status = 'disconnected'
      throw e
    }
  }

  public disconnect(): void {
    this.#status = 'disconnected'
  }
}
