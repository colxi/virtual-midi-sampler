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
    this._vmContext = _vmContext
    this._id = id
    this._patchId = 0
    this._redirect = false
    this._enabled = true
  }

  private readonly _vmContext: MachineContext
  private readonly _id: MidiChannelId
  private _patchId: MidiPatchId
  private _redirect: MidiChannelId | false
  private _enabled: boolean

  /** Midi Channel id */
  public get id(): MidiChannelId {
    return this._id
  }

  /** Midi Channel active patch reference */
  public get patch(): MidiPatch {
    return this._vmContext.patch[this._patchId]
  }

  /** Midi Channel volume */
  public get volume(): MidiVolume {
    return this._vmContext.audio.midiChannel[this._id].getVolume()
  }

  /** Midi Channel messages redirection */
  public get redirect(): MidiChannelId | false {
    return this._redirect
  }

  /** Midi Channel status */
  public get enabled(): boolean {
    return this._enabled
  }

  /** Midi Channel active voices  */
  public get activeVoices(): AudioVoicesActive {
    return this._vmContext.audio.midiChannel[this._id].activeVoices
  }

  /** Activate the Midi Channel */
  public enable(): void {
    this._enabled = true
    return
  }

  /** Deactivate the Midi Channel */
  public disable(): void {
    this._enabled = false
    return
  }

  /** Assign a patch id to the midi channel */
  public setPatch(patchId: MidiPatchId): void {
    this._patchId = patchId
    return
  }

  /** Set the volume for the midi Channel */
  public setVolume(volume: MidiVolume): void {
    this._vmContext.audio.midiChannel[this._id].setVolume(volume)
    return
  }

  /** Set the messages redirection for the midi Channel */
  public setRedirect(channelId: MidiChannelId | false): void {
    if (channelId === false || channelId === this._id) {
      this._redirect = false
      return
    }
    // prevent redirection loops
    const redirections: Array<MidiChannelId> = [this._id, channelId]
    let targetChannel: MidiChannelId | false = channelId
    while (true) {
      targetChannel = this._vmContext.channel[targetChannel].redirect
      if (targetChannel === false) break
      if (redirections.includes(targetChannel)) {
        throw new SamplerError('Redirection loop detected')
      }
      redirections.push(targetChannel)
    }
    this._redirect = channelId
    return
  }

  /** Play a note */
  public noteOn(
    midiNoteId: MidiNoteId,
    midiNoteVelocity?: MidiNoteVelocity
  ): void {
    if (!this._enabled) return
    if (this.redirect) {
      this._vmContext.channel[this.redirect].noteOn(
        midiNoteId,
        midiNoteVelocity
      )
    } else {
      this._vmContext.audio.midiChannel[this._id].createVoice(
        midiNoteId,
        this.patch.keymap[midiNoteId].audioBuffer,
        midiNoteVelocity
      )
    }
    return
  }

  /** Kill a playing note */
  public noteOff(midiNoteId: MidiNoteId): void {
    if (!this._enabled) return
    if (this.redirect) {
      this._vmContext.channel[this.redirect].noteOff(midiNoteId)
    } else {
      this._vmContext.audio.midiChannel[this._id].destroyVoice(midiNoteId)
    }
    return
  }
}
