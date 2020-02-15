/*
 * Midi Patch Keymap
 * -----------------------------------------------------------------------------
 * Contains the metadata and audio data of a Patch keymap
 *
 * [K-x]   = Patch KeyMap index
 * [N,S,B] = Name, Audio Source, AudioBuffer
 *
 *
 *  ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┐
 *  ┃          ┃             ┆                         ┆        ┆       ┆
 *  ┃   K-0    ┃  N="Snare"  ┆  S="./audio/snare.mp3"  ┆  B=[]  ┆ ...   ┆
 *  ┃          ┃             ┆                         ┆        ┆       ┆
 *  ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┘
 *
 *
 */

import MachineContext from '@/main'
import { SamplerError, MidiKeymapId, MidiKeymapPresetJSON } from '@/types/'
import { fetchAudio } from '@/common'

export default class MidiPatchKeymap {
  constructor(_vmContext: MachineContext, id: MidiKeymapId) {
    this.#vmContext = _vmContext
    this.#id = id
    this.#name = 'Unnamed'
    this.#source = ''
    this.#audioBuffer = null
  }

  readonly #vmContext: MachineContext
  readonly #id: MidiKeymapId
  #name: string
  #source: string
  #audioBuffer: AudioBuffer | null

  /** Patch keymap id (0-127) */
  public get id(): MidiKeymapId {
    return this.#id
  }

  /** Patch keymap name */
  public get name(): string {
    return this.#name
  }

  /** Patch keymap audio source */
  public get source(): string {
    return this.#source
  }

  /** Patch keymap sample audio data */
  public get audioBuffer(): AudioBuffer | null {
    return this.#audioBuffer
  }

  /** Load and assign to the Patch keymap the the requested Sample */
  public async loadSample(path: string): Promise<void> {
    // fetch and decode sample
    let audioBuffer: AudioBuffer
    try {
      audioBuffer = await fetchAudio(path, this.#vmContext.audio)
    } catch (e) {
      throw new SamplerError(
        `Missing or invalid audio file ("${path}") : ${e.message}`
      )
    }
    // Assign the audio data to the patch keymap
    this.#audioBuffer = audioBuffer
    this.#source = path
    // done!
    return
  }

  /** Load and assign to the Patch keymap the the requested Keymap preset */
  public async loadPreset(presetOptions: MidiKeymapPresetJSON): Promise<void> {
    this.#name = presetOptions.name || 'Unnamed'
    if (presetOptions.source) return this.loadSample(presetOptions.source)
    return
  }

  /** Reset the Patch keymap configuration and audio data */
  public reset(): void {
    this.#name = 'Unnamed'
    this.#source = ''
    this.#audioBuffer = null
  }
}
