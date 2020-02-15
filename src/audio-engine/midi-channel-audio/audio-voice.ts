import { MidiNoteId, MidiNoteVelocity, AudioVoicesActive } from '@/types/'

const FADE_OUT_SPEED = 0.015
const DESTROY_VOICE_DELAY = 500

export default class AudioVoice {
  constructor(
    voiceId: MidiNoteId,
    audioBuffer: AudioBuffer,
    midiNoteVelocity: MidiNoteVelocity = 127,
    channelVolumeMaster: GainNode,
    activeVoices: AudioVoicesActive
  ) {
    this.#voiceId = voiceId
    // extract the audio context from the gain master node
    this.#audioContext = channelVolumeMaster.context as AudioContext
    // Create an audio Source Node using the provided Audio Buffer
    this.#audioSourceNode = this.#audioContext.createBufferSource()
    this.#audioSourceNode.buffer = audioBuffer
    // Create a gain note with  the provided volume (velocity)
    this.#gainNode = this.#audioContext.createGain()
    this.#gainNode.gain.setValueAtTime(
      midiNoteVelocity / 127,
      this.#audioContext.currentTime
    )
    // Perform the connections : AudioSource -> GainNode -> AudioMaster
    this.#audioSourceNode.connect(this.#gainNode)
    this.#gainNode.connect(channelVolumeMaster)
    // Generate a bound listener (to prevent lose the context on callback time)
    this.#onVoiceEndListener = this.destroy.bind(this)
    this.#audioSourceNode.addEventListener('ended', this.#onVoiceEndListener)
    // set the voice in the channel active voices collection
    this.#activeVoices = activeVoices
    this.#activeVoices[voiceId] = this
    // Done! Play the audio!
    this.#audioSourceNode.start()
  }

  readonly #audioContext: AudioContext
  readonly #voiceId: MidiNoteId
  readonly #audioSourceNode: AudioBufferSourceNode
  readonly #gainNode: GainNode
  readonly #activeVoices: AudioVoicesActive
  readonly #onVoiceEndListener: () => void

  /** Destroys the Voice gracefully */
  public destroy(): void {
    // remove the on end event listener
    this.#audioSourceNode.removeEventListener('ended', this.#onVoiceEndListener)
    // delete the voice from the channel active voices collection
    delete this.#activeVoices[this.#voiceId]
    //  Avoid audio clipping by setting vol to 0 gradually, before destroying
    this.#gainNode.gain.setTargetAtTime(
      0,
      this.#audioContext.currentTime,
      FADE_OUT_SPEED
    )
    // stop and disconnect nodes to allow garbage collector discard the elements
    setTimeout(() => {
      this.#audioSourceNode.stop()
      this.#gainNode.disconnect()
      this.#audioSourceNode.disconnect()
    }, DESTROY_VOICE_DELAY)
  }
}
