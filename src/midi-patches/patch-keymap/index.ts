import MachineContext from '@/main'
import MidiPatchKeymap from './patch-keymap'
import { MidiKeymapId } from '@/types/'

export default class MidiPatchKeymapCollection {
  constructor(_vmContext: MachineContext) {
    for (let i = 0; i < 128; i++) {
      const keymapId = i as MidiKeymapId
      this[keymapId] = new MidiPatchKeymap(_vmContext, keymapId)
    }
  }
  public readonly '0': MidiPatchKeymap
  public readonly '1': MidiPatchKeymap
  public readonly '2': MidiPatchKeymap
  public readonly '3': MidiPatchKeymap
  public readonly '4': MidiPatchKeymap
  public readonly '5': MidiPatchKeymap
  public readonly '6': MidiPatchKeymap
  public readonly '7': MidiPatchKeymap
  public readonly '8': MidiPatchKeymap
  public readonly '9': MidiPatchKeymap
  public readonly '10': MidiPatchKeymap
  public readonly '11': MidiPatchKeymap
  public readonly '12': MidiPatchKeymap
  public readonly '13': MidiPatchKeymap
  public readonly '14': MidiPatchKeymap
  public readonly '15': MidiPatchKeymap
  public readonly '16': MidiPatchKeymap
  public readonly '17': MidiPatchKeymap
  public readonly '18': MidiPatchKeymap
  public readonly '19': MidiPatchKeymap
  public readonly '20': MidiPatchKeymap
  public readonly '21': MidiPatchKeymap
  public readonly '22': MidiPatchKeymap
  public readonly '23': MidiPatchKeymap
  public readonly '24': MidiPatchKeymap
  public readonly '25': MidiPatchKeymap
  public readonly '26': MidiPatchKeymap
  public readonly '27': MidiPatchKeymap
  public readonly '28': MidiPatchKeymap
  public readonly '29': MidiPatchKeymap
  public readonly '30': MidiPatchKeymap
  public readonly '31': MidiPatchKeymap
  public readonly '32': MidiPatchKeymap
  public readonly '33': MidiPatchKeymap
  public readonly '34': MidiPatchKeymap
  public readonly '35': MidiPatchKeymap
  public readonly '36': MidiPatchKeymap
  public readonly '37': MidiPatchKeymap
  public readonly '38': MidiPatchKeymap
  public readonly '39': MidiPatchKeymap
  public readonly '40': MidiPatchKeymap
  public readonly '41': MidiPatchKeymap
  public readonly '42': MidiPatchKeymap
  public readonly '43': MidiPatchKeymap
  public readonly '44': MidiPatchKeymap
  public readonly '45': MidiPatchKeymap
  public readonly '46': MidiPatchKeymap
  public readonly '47': MidiPatchKeymap
  public readonly '48': MidiPatchKeymap
  public readonly '49': MidiPatchKeymap
  public readonly '50': MidiPatchKeymap
  public readonly '51': MidiPatchKeymap
  public readonly '52': MidiPatchKeymap
  public readonly '53': MidiPatchKeymap
  public readonly '54': MidiPatchKeymap
  public readonly '55': MidiPatchKeymap
  public readonly '56': MidiPatchKeymap
  public readonly '57': MidiPatchKeymap
  public readonly '58': MidiPatchKeymap
  public readonly '59': MidiPatchKeymap
  public readonly '60': MidiPatchKeymap
  public readonly '61': MidiPatchKeymap
  public readonly '62': MidiPatchKeymap
  public readonly '63': MidiPatchKeymap
  public readonly '64': MidiPatchKeymap
  public readonly '65': MidiPatchKeymap
  public readonly '66': MidiPatchKeymap
  public readonly '67': MidiPatchKeymap
  public readonly '68': MidiPatchKeymap
  public readonly '69': MidiPatchKeymap
  public readonly '70': MidiPatchKeymap
  public readonly '71': MidiPatchKeymap
  public readonly '72': MidiPatchKeymap
  public readonly '73': MidiPatchKeymap
  public readonly '74': MidiPatchKeymap
  public readonly '75': MidiPatchKeymap
  public readonly '76': MidiPatchKeymap
  public readonly '77': MidiPatchKeymap
  public readonly '78': MidiPatchKeymap
  public readonly '79': MidiPatchKeymap
  public readonly '80': MidiPatchKeymap
  public readonly '81': MidiPatchKeymap
  public readonly '82': MidiPatchKeymap
  public readonly '83': MidiPatchKeymap
  public readonly '84': MidiPatchKeymap
  public readonly '85': MidiPatchKeymap
  public readonly '86': MidiPatchKeymap
  public readonly '87': MidiPatchKeymap
  public readonly '88': MidiPatchKeymap
  public readonly '89': MidiPatchKeymap
  public readonly '90': MidiPatchKeymap
  public readonly '91': MidiPatchKeymap
  public readonly '92': MidiPatchKeymap
  public readonly '93': MidiPatchKeymap
  public readonly '94': MidiPatchKeymap
  public readonly '95': MidiPatchKeymap
  public readonly '96': MidiPatchKeymap
  public readonly '97': MidiPatchKeymap
  public readonly '98': MidiPatchKeymap
  public readonly '99': MidiPatchKeymap
  public readonly '100': MidiPatchKeymap
  public readonly '101': MidiPatchKeymap
  public readonly '102': MidiPatchKeymap
  public readonly '103': MidiPatchKeymap
  public readonly '104': MidiPatchKeymap
  public readonly '105': MidiPatchKeymap
  public readonly '106': MidiPatchKeymap
  public readonly '107': MidiPatchKeymap
  public readonly '108': MidiPatchKeymap
  public readonly '109': MidiPatchKeymap
  public readonly '110': MidiPatchKeymap
  public readonly '111': MidiPatchKeymap
  public readonly '112': MidiPatchKeymap
  public readonly '113': MidiPatchKeymap
  public readonly '114': MidiPatchKeymap
  public readonly '115': MidiPatchKeymap
  public readonly '116': MidiPatchKeymap
  public readonly '117': MidiPatchKeymap
  public readonly '118': MidiPatchKeymap
  public readonly '119': MidiPatchKeymap
  public readonly '120': MidiPatchKeymap
  public readonly '121': MidiPatchKeymap
  public readonly '122': MidiPatchKeymap
  public readonly '123': MidiPatchKeymap
  public readonly '124': MidiPatchKeymap
  public readonly '125': MidiPatchKeymap
  public readonly '126': MidiPatchKeymap
  public readonly '127': MidiPatchKeymap;

  *[Symbol.iterator](): Generator<MidiPatchKeymap> {
    for (let i = 0; i < 128; i++) {
      const keymapId = i as MidiKeymapId
      yield this[keymapId]
    }
  }
}
