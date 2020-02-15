/*
 * Midi Channel
 * -----------------------------------------------------------------------------
 * Holds the state of a channel
 *
 * [C-x]      = Channel Id
 * [volume]   = Channel Volume (GETTER/SETTER)
 * [enabled]  = Accepts/ignores midi signals
 * [patch]    = Reference to the patch object
 * [redirect] = Id of the Channel to route midi signals to
 *
 * ┏━━━━━━━━━━┓┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
 * ┃          ┃   │                     ┆   enabled  : boolean         ┆
 * ┃   C-x    ┃  ▆▆▆  volume            ┆   patch    : SoundBankPatch  ┆
 * ┃          ┃   │                     ┆   redirect : ChannelId       ┆
 * ┗━━━━━━━━━━┛┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
 *
 */

import MachineContext from '@/main'
import MidiPatch from '@/midi-patches/midi-patch'
import {
  MidiNoteId,
  MidiChannelId,
  MidiNoteVelocity,
  MidiPatchId,
  MidiVolume,
  SamplerError,
  AudioVoicesActive
} from '@/types/'

export default class MidiChannel {
  constructor(_vmContext: MachineContext, id: MidiChannelId) {
    this.#vmContext = _vmContext
    this.#id = id
    this.#patchId = 0
    this.#redirect = false
    this.#enabled = true
  }

  readonly #vmContext: MachineContext
  readonly #id: MidiChannelId
  #patchId: MidiPatchId
  #redirect: MidiChannelId | false
  #enabled: boolean

  /** Midi Channel id */
  public get id(): MidiChannelId {
    return this.#id
  }

  /** Midi Channel active patch reference */
  public get patch(): MidiPatch {
    return this.#vmContext.patch[this.#patchId]
  }

  /** Midi Channel volume */
  public get volume(): MidiVolume {
    return this.#vmContext.audio.midiChannel[this.#id].getVolume()
  }

  /** Midi Channel messages redirection */
  public get redirect(): MidiChannelId | false {
    return this.#redirect
  }

  /** Midi Channel status */
  public get enabled(): boolean {
    return this.#enabled
  }

  /** Midi Channel active voices  */
  public get activeVoices(): AudioVoicesActive {
    return this.#vmContext.audio.midiChannel[this.#id].activeVoices
  }

  /** Activate the Midi Channel */
  public enable(): void {
    this.#enabled = true
    return
  }

  /** Deactivate the Midi Channel */
  public disable(): void {
    this.#enabled = false
    return
  }

  /** Assign a patch id to the midi channel */
  public setPatch(patchId: MidiPatchId): void {
    this.#patchId = patchId
    return
  }

  /** Set the volume for the midi Channel */
  public setVolume(volume: MidiVolume): void {
    this.#vmContext.audio.midiChannel[this.#id].setVolume(volume)
    return
  }

  /** Set the messages redirection for the midi Channel */
  public setRedirect(channelId: MidiChannelId | false): void {
    if (channelId === false || channelId === this.#id) {
      this.#redirect = false
      return
    }
    // prevent redirection loops
    const redirections: Array<MidiChannelId> = [this.#id, channelId]
    let targetChannel: MidiChannelId | false = channelId
    while (true) {
      targetChannel = this.#vmContext.channel[targetChannel].redirect
      if (targetChannel === false) break
      if (redirections.includes(targetChannel)) {
        throw new SamplerError('Redirection loop detected')
      }
      redirections.push(targetChannel)
    }
    this.#redirect = channelId
    return
  }

  /** Play a note */
  public noteOn(
    midiNoteId: MidiNoteId,
    midiNoteVelocity?: MidiNoteVelocity
  ): void {
    if (!this.#enabled) return
    if (this.redirect) {
      this.#vmContext.channel[this.redirect].noteOn(
        midiNoteId,
        midiNoteVelocity
      )
    } else {
      this.#vmContext.audio.midiChannel[this.#id].createVoice(
        midiNoteId,
        this.patch.keymap[midiNoteId].audioBuffer,
        midiNoteVelocity
      )
    }
    return
  }

  /** Kill a playing note */
  public noteOff(midiNoteId: MidiNoteId): void {
    if (!this.#enabled) return
    if (this.redirect) {
      this.#vmContext.channel[this.redirect].noteOff(midiNoteId)
    } else {
      this.#vmContext.audio.midiChannel[this.#id].destroyVoice(midiNoteId)
    }
    return
  }
}
