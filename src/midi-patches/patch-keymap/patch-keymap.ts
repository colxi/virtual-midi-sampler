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
    this._vmContext = _vmContext
    this._id = id
    this._name = 'Unnamed'
    this._source = ''
    this._audioBuffer = null
  }

  private readonly _vmContext: MachineContext
  private readonly _id: MidiKeymapId
  private _name: string
  private _source: string
  private _audioBuffer: AudioBuffer | null

  /** Patch keymap id (0-127) */
  public get id(): MidiKeymapId {
    return this._id
  }

  /** Patch keymap name */
  public get name(): string {
    return this._name
  }

  /** Patch keymap audio source */
  public get source(): string {
    return this._source
  }

  /** Patch keymap sample audio data */
  public get audioBuffer(): AudioBuffer | null {
    return this._audioBuffer
  }

  /** Load and assign to the Patch keymap the the requested Sample */
  public async loadSample(path: string): Promise<void> {
    // fetch and decode sample
    let audioBuffer: AudioBuffer
    try {
      audioBuffer = await fetchAudio(path, this._vmContext.audio)
    } catch (e) {
      throw new SamplerError(
        `Missing or invalid audio file ("${path}") : ${e.message}`
      )
    }
    // Assign the audio data to the patch keymap
    this._audioBuffer = audioBuffer
    this._source = path
    // done!
    return
  }

  /** Load and assign to the Patch keymap the the requested Keymap preset */
  public async loadPreset(presetOptions: MidiKeymapPresetJSON): Promise<void> {
    this._name = presetOptions.name || 'Unnamed'
    if (presetOptions.source) return this.loadSample(presetOptions.source)
    return
  }

  /** Reset the Patch keymap configuration and audio data */
  public reset(): void {
    this._name = 'Unnamed'
    this._source = ''
    this._audioBuffer = null
  }
}
