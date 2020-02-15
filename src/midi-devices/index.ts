/*
 * Midi Devices interface
 * -----------------------------------------------------------------------------
 * Exposes a collection of discovered midi-devices, organized by input interface
 * and output interface. Performs live monitoring for new devices available,
 * or already registered devices going offline.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   Supported Devices :                                                     │
 * │                                                                           │
 * │  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐  │
 * │  ┆ VMI Devices (Virtual Midi Instrument JS)                            ┆  │
 * │  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘  │
 * │  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐  │
 * │  ┆ MIDI Devices (WebMidi API)                                          ┆  │
 * │  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘  │
 * │  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐  │
 * │  ┆ JAZZ-MIDI Devices (WebMidi Shim + Plugin)                           ┆  │
 * │  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘  │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 */

import MachineContext from '@/main'
import { SamplerError, MidiDeviceSupported } from '@/types'
import MidiDeviceInput from './midi-device-input'
import MidiDeviceOutput from './midi-device-output'

export default class MidiDevicesInterface {
  constructor(vmContext: MachineContext) {
    this.#vmContext = vmContext
    this.input = []
    this.output = []
    this.#onDeviceStateChange = this.#onDeviceStateChange.bind(this)
    this.#watchDevices().catch(e => {
      throw e
    })
  }

  readonly #vmContext: MachineContext
  public readonly input: MidiDeviceInput[]
  public readonly output: MidiDeviceOutput[]

  #watchDevices = async (): Promise<void> =>{
    // --- Virtual Midi Instrument Devices
    // register existing virtual devices
    for (const device of window.__MIDI_VIRTUAL_MACHINES__) {
      this.#registerDevice(device)
    }
    // listen for new connected virtual devices
    window.addEventListener('statechange-vmi', this.#onDeviceStateChange, false)

    // --- Physical Midi Instrument Devices
    const midiAccess: WebMidi.MIDIAccess = await navigator.requestMIDIAccess()
    // register existing virtual devices
    for (const device of midiAccess.inputs.values()) {
      this.#registerDevice(device)
    }
    for (const device of midiAccess.outputs.values()) {
      this.#registerDevice(device)
    }
    // listen for new connected virtual devices
    if (Object.prototype.hasOwnProperty.call(midiAccess, 'addEventListener')) {
      midiAccess.addEventListener(
        'statechange',
        this.#onDeviceStateChange,
        false
      )
    } else {
      // ...or JazzMidi plugin compatible syntax
      midiAccess.onstatechange = this.#onDeviceStateChange
    }

    // TODO: Remove listeners on instrument destroy
  }

  #onDeviceStateChange= (e: Event): void =>{
    let device: MidiDeviceSupported
    let state: string
    // --- Virtual Midi Instrument Devices
    if (e.type === 'statechange-vmi') {
      const eventData = (e as CustomEvent).detail
      device = eventData.device as MachineContext
      state = eventData.state
    }
    // --- Physical Midi Instrument Devices
    else if (e.type === 'statechange') {
      const eventData = e as WebMidi.MIDIConnectionEvent
      device = eventData.port as WebMidi.MIDIInput | WebMidi.MIDIOutput
      state = device.state
    }
    // --- Unknown Devices
    else throw new SamplerError('Unknown device detected')

    // block if device its self
    if (device.id === this.#vmContext.id) return
    // Register/unregister device
    if (state === 'connected') this.#registerDevice(device)
    else if (state === 'disconnected') this.#unregisterDevice(device)
    else throw new SamplerError('Unknown device state detected:' + state)
  }

  #registerDevice = (device: MidiDeviceSupported): void =>{
    console.log(device)
    // --- Virtual Midi Instrument Devices
    if (device.type === 'vmi') {
      if (this.input.filter(d => d.id === device.id).length) return
      this.input.push(new MidiDeviceInput(this.#vmContext, device))
      if (this.output.filter(d => d.id === device.id).length) return
      this.output.push(new MidiDeviceOutput(this.#vmContext, device))
    }
    // --- Physical Midi Instrument Devices
    else if (device.type === 'input') {
      if (this.input.filter(d => d.id === device.id).length) return
      this.input.push(new MidiDeviceInput(this.#vmContext, device))
    } else if (device.type === 'output') {
      if (this.output.filter(d => d.id === device.id).length) return
      this.output.push(new MidiDeviceOutput(this.#vmContext, device))
    }
    // --- Unknown Device type
    else throw new SamplerError('Cannot register unknown device')
  }

  #unregisterDevice = (device: MidiDeviceSupported): void => {
    console.log('unregistering', device)
    // TODO: unregister and disconnect if connections are active
  }
}
