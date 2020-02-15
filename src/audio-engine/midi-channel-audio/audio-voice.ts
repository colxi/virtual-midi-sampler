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
    this._voiceId = voiceId
    // extract the audio context from the gain master node
    this._audioContext = channelVolumeMaster.context as AudioContext
    // Create an audio Source Node using the provided Audio Buffer
    this._audioSourceNode = this._audioContext.createBufferSource()
    this._audioSourceNode.buffer = audioBuffer
    // Create a gain note with  the provided volume (velocity)
    this._gainNode = this._audioContext.createGain()
    this._gainNode.gain.setValueAtTime(
      midiNoteVelocity / 127,
      this._audioContext.currentTime
    )
    // Perform the connections : AudioSource -> GainNode -> AudioMaster
    this._audioSourceNode.connect(this._gainNode)
    this._gainNode.connect(channelVolumeMaster)
    // Generate a bound listener (to prevent lose the context on callback time)
    this._onVoiceEndListener = this.destroy.bind(this)
    this._audioSourceNode.addEventListener('ended', this._onVoiceEndListener)
    // set the voice in the channel active voices collection
    this._activeVoices = activeVoices
    this._activeVoices[voiceId] = this
    // Done! Play the audio!
    this._audioSourceNode.start()
  }
  private readonly _audioContext: AudioContext
  private readonly _voiceId: MidiNoteId
  private readonly _audioSourceNode: AudioBufferSourceNode
  private readonly _gainNode: GainNode
  private readonly _activeVoices: AudioVoicesActive
  private readonly _onVoiceEndListener: () => void

  /** Destroys the Voice gracefully */
  public destroy(): void {
    // remove the on end event listener
    this._audioSourceNode.removeEventListener('ended', this._onVoiceEndListener)
    // delete the voice from the channel active voices collection
    delete this._activeVoices[this._voiceId]
    //  Avoid audio clipping by setting vol to 0 gradually, before destroying
    this._gainNode.gain.setTargetAtTime(
      0,
      this._audioContext.currentTime,
      FADE_OUT_SPEED
    )
    // stop and disconnect nodes to allow garbage collector discard the elements
    setTimeout(() => {
      this._audioSourceNode.stop()
      this._gainNode.disconnect()
      this._audioSourceNode.disconnect()
    }, DESTROY_VOICE_DELAY)
  }
}
