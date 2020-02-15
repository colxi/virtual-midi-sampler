/*
 * Audio Engine Interface
 * -----------------------------------------------------------------------------
 * Representation of the resulting audio circuit :
 *
 * [Vx]  = Voice pseudo nodes (node pairs group)
 *         [S] - BufferSourceNode (Voice group member)
 *         [G] - GainNode (Voice group member)
 * [CHx] = Channel Volume (GainNode)
 * [M]   = Master Volume (GainNode)
 * [O]   = Output ( AudioContext | AudioNode )
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                                                                           │
 * │                              AUDIO CONTEXT                                │
 * │                                                                           │
 * │                                                                           │
 * │     V1           V2           V3           V4           V5       ...Vn    │
 * │ ┌┄┄┄┄┄┄┄┄┄┐  ┌┄┄┄┄┄┄┄┄┄┐  ┌┄┄┄┄┄┄┄┄┄┐  ┌┄┄┄┄┄┄┄┄┄┐  ┌┄┄┄┄┄┄┄┐  ┌┄┄┄┄┄┄┄┐  │
 * │ ┆ ┌─────┐ ┆  ┆ ┌─────┐ ┆  ┆ ┌─────┐ ┆  ┆ ┌─────┐ ┆  ┆       ┆  ┆       ┆  │
 * │ ┆ │  S  | ┆  ┆ │  S  | ┆  ┆ │  S  | ┆  ┆ │  S  | ┆  ┆       ┆  ┆       ┆  │
 * │ ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆       ┆  ┆       ┆  │
 * │ ┆    │    ┆  ┆    │    ┆  ┆    │    ┆  ┆    │    ┆  ┆ [...] ┆  ┆ [...] ┆  │
 * │ ┆ ┌──┴──┐ ┆  ┆ ┌──┴──┐ ┆  ┆ ┌──┴──┐ ┆  ┆ ┌──┴──┐ ┆  ┆       ┆  ┆       ┆  │
 * │ ┆ │  G  │ ┆  ┆ │  G  │ ┆  ┆ │  G  │ ┆  ┆ │  G  │ ┆  ┆       ┆  ┆       ┆  │
 * │ ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆ └──┬──┘ ┆  ┆       ┆  ┆       ┆  │
 * │ └┄┄┄┄┼┄┄┄┄┘  └┄┄┄┄┼┄┄┄┄┘  └┄┄┄┄┼┄┄┄┄┘  └┄┄┄┄┼┄┄┄┄┘  └┄┄┄┬┄┄┄┘  └┄┄┄┬┄┄┄┘  │
 * │      └──────┬─────┘            └────────────┼───────────┘          │      │
 * │             │                               │                   ┌──┘      │
 * │             │                               │                   │         │
 * │       ┌─────┴──────┐                  ┌─────┴──────┐      ┌─────┴──────┐  │
 * │       │            │                  │            │      │            │  │
 * │       │    CHx     │                  │    CHx     │      │    CHx     │  │
 * │       │            │                  │            │      │            │  │
 * │       └─────┬──────┘                  └─────┬──────┘      └─────┬──────┘  │
 * │             │                               │                   │         │
 * │             └─────────────────────────┬─────┴───────────────────┘         │
 * │                                       │                                   │
 * │                                       │                                   │
 * │                               ┌───────┴───────┐                           │
 * │                               │               │                           │
 * │                               │       M       │                           │
 * │                               │     Master    │                           │
 * │   OVERVIEW :                  │               │                           │
 * │   * Unlimited voices          └───────┬───────┘                           │
 * │   * 16 channels Gain          ┏━━━━━━━┻━━━━━━━┓                           │
 * │   * 1 Volume Master           ┃               ┃                           │
 * │   * 1 Output                  ┃       O       ┃                           │
 * │                               ┃     Output    ┃                           │
 * │                               ┃               ┃                           │
 * │                               ┗━━━━━━━━━━━━━━━┛                           │
 * │                                                                           │
 * │                                                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

import MidiChannelAudioInterfaceCollection from './midi-channel-audio'
import { MidiVolume } from '@/types'

export default class AudioEngineInterface {
  public constructor(audioOutput?: AudioContext | AudioNode) {
    // Define audio context
    if (!audioOutput) {
      this._isExternalAudioContext = false
      this._audioContext = new AudioContext()
    } else {
      this._isExternalAudioContext = true
      this._audioContext =
        audioOutput instanceof AudioContext
          ? audioOutput
          : (audioOutput.context as AudioContext)
    }
    // create Master Volume Node
    this._masterVolumeNode = this._audioContext.createGain()
    const destination: AudioDestinationNode | AudioNode =
      !audioOutput || audioOutput instanceof AudioContext
        ? this._audioContext.destination
        : audioOutput
    this._masterVolumeNode.connect(destination)
    // generate the Channel Audio interfaces Collection
    this.midiChannel = new MidiChannelAudioInterfaceCollection(
      this._masterVolumeNode
    )
  }

  private readonly _isExternalAudioContext: boolean
  private readonly _audioContext: AudioContext
  private readonly _masterVolumeNode: GainNode

  /** Midi Channels Audio Interfaces */
  public readonly midiChannel: MidiChannelAudioInterfaceCollection

  /** Returns the total count of voices */
  public get voiceCount(): number {
    let count = 0
    for (const midiChannel of this.midiChannel) {
      count += Object.keys(midiChannel.activeVoices).length
    }
    return count
  }

  /** Returns the audio context output latency (of -1 when not available) */
  public get outputLatency(): number {
    return this._audioContext.outputLatency || -1
  }

  /** Returns the audio context sample Rate (of -1 when not available) */
  public get sampleRate(): number {
    return this._audioContext.sampleRate || -1
  }

  /** Boolean flag to determine if using external audio context */
  public get isExternalAudioContext(): boolean {
    return this._isExternalAudioContext
  }

  /** Convert an Array buffer to an AudioBuffer */
  public async decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return await this._audioContext.decodeAudioData(arrayBuffer)
  }

  /** returns the volume of the master */
  public getVolume(): MidiVolume {
    // convert GainNode volume value to MidiVolume
    const volume = Math.round(
      this._masterVolumeNode.gain.value * 127
    ) as MidiVolume
    return volume
  }

  /** Set the volume of the master (0-127) */
  public setVolume(channelVolume: MidiVolume): boolean {
    // set limits
    if (channelVolume < 0) channelVolume = 0
    if (channelVolume > 127) channelVolume = 127
    // convert  midi volume to GainNode volume
    const volume = channelVolume / 127
    this._masterVolumeNode.gain.setValueAtTime(
      volume,
      this._audioContext.currentTime
    )
    return true
  }
}
