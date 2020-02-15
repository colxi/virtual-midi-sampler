import MachineContext from '@/main'
import MidiChannel from './midi-channel'
import { MidiChannelId } from '@/types/'

export default class MidiChannelCollection {
  constructor(_vmContext: MachineContext) {
    for (let i = 0; i < 16; i++) {
      const channelId = i as MidiChannelId
      this[channelId] = new MidiChannel(_vmContext, channelId)
    }
  }
  public readonly '0': MidiChannel
  public readonly '1': MidiChannel
  public readonly '2': MidiChannel
  public readonly '3': MidiChannel
  public readonly '4': MidiChannel
  public readonly '5': MidiChannel
  public readonly '6': MidiChannel
  public readonly '7': MidiChannel
  public readonly '8': MidiChannel
  public readonly '9': MidiChannel
  public readonly '10': MidiChannel
  public readonly '11': MidiChannel
  public readonly '12': MidiChannel
  public readonly '13': MidiChannel
  public readonly '14': MidiChannel
  public readonly '15': MidiChannel;

  *[Symbol.iterator](): Generator<MidiChannel> {
    for (let i = 0; i < 16; i++) {
      const channelId = i as MidiChannelId
      yield this[channelId]
    }
  }
}
