/*
 * Midi Patch
 * -----------------------------------------------------------------------------
 * Contains the patch keymap (127), and patch metadata (name, id, preset).
 * Provides methods to load presets and reset the patch current configuration
 *
 * [K-x]   = Patch KeyMap index
 * [N,S,B] = Name, Audio Source, AudioBuffer
 *
 *
 * ┌─────────────────┬───────────────────────┬─────────────────────────────────┐
 * │                 ┆                       ┆                                 │
 * │   id : 0-127    ┆  name : 'patchName'   ┆  preset : '../patch/to/preset'  │
 * │                 ┆                       ┆                                 │
 * │┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄│
 * │                                                                           │
 * │   Keymap :                                                                │
 * │                                                                           │
 * │   ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┐   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┃   K-0    ┃  N="Snare"  ┆  S="./audio/snare.mp3"  ┆  B=[]  ┆ ...   ┆   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┘   │
 * │                                                                           │
 * │   ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┐   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┃   K-1    ┃  N="Gong "  ┆  S="./audio/gong.mp3"   ┆  B=[]  ┆ ...   ┆   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┘   │
 * │                                                                           │
 * │   ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┐   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┃  [...]   ┃             ┆                         ┆        ┆       ┆   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┘   │
 * │                                                                           │
 * │   ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┐   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┃  K-127   ┃  N="Bell"   ┆  S="./audio/bell.mp3"   ┆  B=[]  ┆ ...   ┆   │
 * │   ┃          ┃             ┆                         ┆        ┆       ┆   │
 * │   ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┘   │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 */

import MachineContext from '@/main'
import MidiPatchKeymapCollection from './patch-keymap'
import { fetchJSON, splitArrayInChunks, pathJoin } from '../common'
import { SamplerError, MidiPatchId, MidiPatchPresetJSON } from '@/types/'

const LOAD_BATCH_SIZE = 5

function isValidPresetJSON(
  json: MidiPatchPresetJSON
): json is MidiPatchPresetJSON {
  if (!Array.isArray(json.keymap)) return false
  return true
}

export default class MidiPatch {
  constructor(_vmContext: MachineContext, id: MidiPatchId) {
    this._vmContext = _vmContext
    this._id = id
    this._name = 'Unnamed'
    this._preset = ''
    this.keymap = new MidiPatchKeymapCollection(_vmContext)
  }

  private readonly _vmContext: MachineContext
  private readonly _id: MidiPatchId
  private _name: string
  private _preset: string

  public readonly keymap: MidiPatchKeymapCollection

  /** Patch id */
  public get id(): MidiPatchId {
    return this._id
  }

  /** Patch  Name */
  public get name(): string {
    return this._name
  }

  /** Preset file location */
  public get preset(): string {
    return this._preset
  }

  /** Sets the patch name */
  public setName(name: string): void {
    this._name = name
    return
  }

  /** Load a patch preset from a JSON file */
  public async loadPreset(path: string): Promise<void> {
    // retrieve json
    const patchPresetFullPath = pathJoin(path, 'preset.json')
    let patchPreset: any
    try {
      patchPreset = await fetchJSON(patchPresetFullPath)
    } catch (e) {
      throw new SamplerError(
        `Missing or invalid patch preset JSON ("${patchPresetFullPath}")`
      )
    }
    // validate preset json
    if (!isValidPresetJSON(patchPreset)) {
      throw new SamplerError(
        `Unknown structure detected in preset JSON ("${patchPresetFullPath}")`
      )
    }
    // reset patch before loading a new preset
    this.reset()
    // Loading preset keymaps samples in batches
    const batches = splitArrayInChunks(patchPreset.keymap, LOAD_BATCH_SIZE)
    for (const batch of batches) {
      const requestsPromises: Promise<any>[] = []
      for (const keymapJSON of batch) {
        const fullPath = keymapJSON.source.trim()
          ? pathJoin(path, keymapJSON.source)
          : ''
        const loadPresetPromise = this.keymap[keymapJSON.key].loadPreset({
          ...keymapJSON,
          source: fullPath
        })
        requestsPromises.push(loadPresetPromise)
      }
      // handle preset load errors
      try {
        await Promise.all(requestsPromises)
      } catch (e) {
        // reset the patch if preset load fails
        this.reset()
        throw new SamplerError('Error loading Patch Preset :' + e.message)
      }
    }
    // set preset metadata
    this._name = patchPreset.name || ''
    this._preset = patchPresetFullPath
    // done
    return
  }

  /** Reset the Patch metadata and keymaps */
  public reset(): void {
    this._name = 'Unnamed'
    this._preset = ''
    for (const keymap of this.keymap) keymap.reset()
    return
  }
}
