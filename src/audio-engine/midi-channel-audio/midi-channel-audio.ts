import AudioVoice from './audio-voice'
import {
  MidiChannelId,
  MidiVolume,
  MidiNoteId,
  MidiNoteVelocity,
  AudioVoicesActive
} from '@/types/'

export default class MidiChannelAudioInterface {
  public constructor(masterGain: GainNode, id: MidiChannelId) {
    this.#id = id
    this.#audioContext = masterGain.context as AudioContext
    this.#channelMasterVolumeNode = this.#audioContext.createGain()
    this.#channelMasterVolumeNode.connect(masterGain)
    this.activeVoices = {}
  }

  readonly #id: MidiChannelId
  readonly #audioContext: AudioContext
  readonly #channelMasterVolumeNode: GainNode
  public readonly activeVoices: AudioVoicesActive

  /** Midi Channel Audio Interface id */
  public get id(): MidiChannelId {
    return this.#id
  }

  /** Create a new voice with the provided audio buffer and note metadata */
  public createVoice(
    midiNoteId: MidiNoteId,
    audioBuffer: AudioBuffer | null,
    midiNoteVelocity?: MidiNoteVelocity
  ): void {
    // prevent same midiNote to be played more than once simultaneously
    this.destroyVoice(midiNoteId)
    // only create a  new voice if an AudioBuffer is provided
    if (audioBuffer) {
      new AudioVoice(
        midiNoteId,
        audioBuffer,
        midiNoteVelocity,
        this.#channelMasterVolumeNode,
        this.activeVoices
      )
    }
    return
  }

  /** Destroy the requested midiNote voice */
  public destroyVoice(midiNoteId: MidiNoteId): void {
    const voice = this.activeVoices[midiNoteId]
    if (voice) voice.destroy()
    return
  }

  /** returns the volume of the midi channel */
  public getVolume(): MidiVolume {
    // convert GainNode volume value to MidiVolume
    const volume = Math.round(
      this.#channelMasterVolumeNode.gain.value * 127
    ) as MidiVolume
    return volume
  }

  /** Set the volume of the midi channel (0-127) */
  public setVolume(channelVolume: MidiVolume): boolean {
    // set limits
    if (channelVolume < 0) channelVolume = 0
    if (channelVolume > 127) channelVolume = 127
    // convert  midi volume to GainNode volume
    const volume = channelVolume / 127
    this.#channelMasterVolumeNode.gain.setValueAtTime(
      volume,
      this.#audioContext.currentTime
    )
    return true
  }
}
