import MidiChannelAudioInterface from './midi-channel-audio'
import { MidiChannelId } from '@/types/'

export default class MidiChannelAudioInterfaceCollection {
  constructor(masterGain: GainNode) {
    for (let i = 0; i < 16; i++) {
      const channelId = i as MidiChannelId
      this[channelId] = new MidiChannelAudioInterface(masterGain, channelId)
    }
  }
  public readonly '0': MidiChannelAudioInterface
  public readonly '1': MidiChannelAudioInterface
  public readonly '2': MidiChannelAudioInterface
  public readonly '3': MidiChannelAudioInterface
  public readonly '4': MidiChannelAudioInterface
  public readonly '5': MidiChannelAudioInterface
  public readonly '6': MidiChannelAudioInterface
  public readonly '7': MidiChannelAudioInterface
  public readonly '8': MidiChannelAudioInterface
  public readonly '9': MidiChannelAudioInterface
  public readonly '10': MidiChannelAudioInterface
  public readonly '11': MidiChannelAudioInterface
  public readonly '12': MidiChannelAudioInterface
  public readonly '13': MidiChannelAudioInterface
  public readonly '14': MidiChannelAudioInterface
  public readonly '15': MidiChannelAudioInterface;

  *[Symbol.iterator](): Generator<MidiChannelAudioInterface> {
    for (let i = 0; i < 16; i++) {
      const channelId = i as MidiChannelId
      yield this[channelId]
    }
  }
}
