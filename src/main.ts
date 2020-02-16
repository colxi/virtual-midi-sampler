/**
 *
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │   ◉ MIDI CLOCK                                   ╭━━━╮                    │
 * │   ◉ MIDI IN                                      ┃╭━╮┃╱╱╱╱╱╱╱╱╭╮////      │
 * │   ◎ MIDI OUT                                     ┃╰━━┳━━┳╮╭┳━━┫┃╭━━┳━╮    │
 * │   ◎ AUDIO OUT                                    ╰━━╮┃╭╮┃╰╯┃╭╮┃┃┃┃━┫╭╯    │
 * │                                                  ┃╰━╯┃╭╮┃┃┃┃╰╯┃╰┫┃━┫┃     │
 * │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           MIDI ╰━━━┻╯╰┻┻┻┫╭━┻━┻━━┻╯.js  │
 * │   │  ▶  | │  ■  | │  ▎▎ | │  ○  |          //////╱╱╱╱╱╱╱╱╱╱╰╯             │
 * │   └═════┘ └═════┘ └═════┘ └═════┘                                         │
 * │                                                                           │
 * │   16 MIDI Channels                  128 Soundbank patches         Master  │
 * │  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐ ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐ ┌┄┄┄┄┄┐  │
 * │  ┆  │  ┌───┐  │  ┌───┐  │  ┌───┐ ┆ ┆   ┌───┐   ┌───┐   ┌───┐   ┆ ┆  │  ┆  │
 * │  ┆ ▆▆▆ │ 0 | ▆▆▆ │ 1 | ▆▆▆ │ 2 | ┆ ┆ ▓ │ 0 | ▓ │ 1 | ▓ │ 2 |   ┆ ┆ ▆▆▆ ┆  │
 * │  ┆  │  └───┘  │  └───┘  │  └───┘ ┆ ┆   └───┘   └───┘   └───┘   │ ┆  │  ┆  │
 * │  ┆                               ┆ ┆                           ┆ ┆  │  ┆  │
 * │  ┆  │  ┌───┐  │  ┌───┐  │  ┌───┐ ┆ ┆   ┌───┐   ┌───┐   ┌───┐   ┆ ┆  │  ┆  │
 * │  ┆ ▆▆▆ │ 3 | ▆▆▆ │...| ▆▆▆ │15 | ┆ ┆ ▓ │ 4 | ▓ │...| ▓ │127|   ┆ ┆  │  ┆  │
 * │  ┆  │  └───┘  │  └───┘  │  └───┘ ┆ ┆   └───┘   └───┘   └───┘   ┆ ┆  ▀  ┆  │
 * │  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘ └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘ └┄┄┄┄┄┘  │
 * │   128 Keymaps / patch                                                     │
 * │  ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐  │
 * │  ┆                                                                     ┆  │
 * │  ┆    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    ┆  │
 * │  ┆    │  0  |  │  1  |  │  2  |  │  3  |  │  4  |  │  5  |  │  6  |    ┆  │
 * │  ┆    └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘    ┆  │
 * │  ┆                                                                     ┆  │
 * │  ┆    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    ┆  │
 * │  ┆    │  8  |  │  9  |  │ 10  |  │ 11  |  │ 12  |  │ 13  |  │ 14  |    ┆  │
 * │  ┆    └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘    ┆  │
 * │  ┆                                                                     ┆  │
 * │  ┆    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    ┆  │
 * │  ┆    │ 16  |  │ 17  |  │ 18  |  │ 19  |  │ 20  |  │[...]|  │ 127 |    ┆  │
 * │  ┆    └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘  └═════┘    ┆  │
 * │  ┆                                                                     ┆  │
 * │  └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘  │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 */

import MidiPatchInterface from '@/midi-patches/'
import AudioEngineInterface from '@/audio-engine/'
import MidiChannelsInterface from '@/midi-channels/'
import MidiDevicesInterface from '@/midi-devices/'
import MidiPortsInterface from '@/midi-ports/'

import { MidiSamplerOptions } from './types/'

// Create a global container to store the references to any virtual device
// of the family (vmd.js). This allows the virtual machines to detect each other
// in order to create connections between them
window.__MIDI_VIRTUAL_MACHINES__ = window.__MIDI_VIRTUAL_MACHINES__ || []

/**
 * Virtual MIDI Sampler main Class
 */
export default class MidiSampler {
  constructor(options: MidiSamplerOptions = {}) {
    this.#id = String(Math.round(Math.random() * 10000000000))
    this.#name = 'Virtual Midi Sampler Instrument'
    this.#type = 'vmi' // Virtual Midi Instrument JS
    this.#manufacturer = 'colxi'
    this.audio = new AudioEngineInterface(options.audioOutput)
    this.patch = new MidiPatchInterface(this)
    this.channel = new MidiChannelsInterface(this)
    this.devices = new MidiDevicesInterface(this)
    this.port = new MidiPortsInterface(this)

    window.__MIDI_VIRTUAL_MACHINES__.push(this)
    window.dispatchEvent(
      new CustomEvent('statechange-vmi', {
        detail: {
          device: this,
          state: 'connected'
        }
      })
    )
    /*
    this.port.watch().catch((e: Error) => {
      throw e
    })
    */

    // Prevent non typescript environments add or remove class members the class
  }

  #name: string
  readonly #id: string
  readonly #type: 'vmi'
  readonly #manufacturer: string
  public readonly channel: MidiChannelsInterface
  public readonly patch: MidiPatchInterface
  public readonly audio: AudioEngineInterface
  public readonly devices: MidiDevicesInterface
  public readonly port: MidiPortsInterface

  public get id(): string {
    return this.#id
  }

  public get name(): string {
    return this.#name
  }

  public get type(): 'vmi' {
    return this.#type
  }
  public get manufacturer(): string {
    return this.#manufacturer
  }

  public setName(name: string): void{
    this.#name= name
  }

  public send(data: number[] | Uint8Array, timestamp?: number): void {
    //
    for (const device of this.port.midiOut) {
      const outputDevice = device as any
      outputDevice.send(data, timestamp)
    }
  }
}


