import MachineContext from '@/main'
import { MidiDeviceSupported, SamplerError } from '@/types'

type MidiDevicePort = 'input' | 'output'
type MidiDeviceType = 'vmi' | 'midi'
type MidiDeviceStatus = 'connected' | 'disconnected'

export default class MidiDeviceOutput {
  constructor(
    vmContext: MachineContext,
    device: WebMidi.MIDIOutput | MachineContext
  ) {
    this.#vmContext = vmContext
    this.#device = device
    this.#id = device.id
    this.#name = device.name || 'unnamed'
    this.#manufacturer = device.manufacturer || 'unknown'
    this.#port = 'output'
    this.#type = device.type === 'vmi' ? 'vmi' : 'midi'
    this.#status = 'disconnected'
  }

  #vmContext: MachineContext
  #device: WebMidi.MIDIOutput | MachineContext
  #id: string
  #name: string
  #manufacturer: string
  #port: MidiDevicePort
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
    return this.#port
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
        const device = this.#device.devices.output.find(
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

  public send(data: number[] | Uint8Array, timestamp?: number): void {
    if (this.#status === 'disconnected') {
      throw new SamplerError(
        'Device is disconnected. To send a messages connect it first.'
      )
    }
    this.#device.send(data, timestamp)
  }
}
