'use strict'

import MachineContext from '@/main'
import MidiPatch from './midi-patch'
import { MidiPatchId } from '@/types/'

export default class MidiPatchCollection {
  public constructor(_vmContext: MachineContext) {
    for (let i = 0; i < 128; i++) {
      const patchId = i as MidiPatchId
      this[patchId] = new MidiPatch(_vmContext, patchId)
    }
  }
  public readonly '0': MidiPatch
  public readonly '1': MidiPatch
  public readonly '2': MidiPatch
  public readonly '3': MidiPatch
  public readonly '4': MidiPatch
  public readonly '5': MidiPatch
  public readonly '6': MidiPatch
  public readonly '7': MidiPatch
  public readonly '8': MidiPatch
  public readonly '9': MidiPatch
  public readonly '10': MidiPatch
  public readonly '11': MidiPatch
  public readonly '12': MidiPatch
  public readonly '13': MidiPatch
  public readonly '14': MidiPatch
  public readonly '15': MidiPatch
  public readonly '16': MidiPatch
  public readonly '17': MidiPatch
  public readonly '18': MidiPatch
  public readonly '19': MidiPatch
  public readonly '20': MidiPatch
  public readonly '21': MidiPatch
  public readonly '22': MidiPatch
  public readonly '23': MidiPatch
  public readonly '24': MidiPatch
  public readonly '25': MidiPatch
  public readonly '26': MidiPatch
  public readonly '27': MidiPatch
  public readonly '28': MidiPatch
  public readonly '29': MidiPatch
  public readonly '30': MidiPatch
  public readonly '31': MidiPatch
  public readonly '32': MidiPatch
  public readonly '33': MidiPatch
  public readonly '34': MidiPatch
  public readonly '35': MidiPatch
  public readonly '36': MidiPatch
  public readonly '37': MidiPatch
  public readonly '38': MidiPatch
  public readonly '39': MidiPatch
  public readonly '40': MidiPatch
  public readonly '41': MidiPatch
  public readonly '42': MidiPatch
  public readonly '43': MidiPatch
  public readonly '44': MidiPatch
  public readonly '45': MidiPatch
  public readonly '46': MidiPatch
  public readonly '47': MidiPatch
  public readonly '48': MidiPatch
  public readonly '49': MidiPatch
  public readonly '50': MidiPatch
  public readonly '51': MidiPatch
  public readonly '52': MidiPatch
  public readonly '53': MidiPatch
  public readonly '54': MidiPatch
  public readonly '55': MidiPatch
  public readonly '56': MidiPatch
  public readonly '57': MidiPatch
  public readonly '58': MidiPatch
  public readonly '59': MidiPatch
  public readonly '60': MidiPatch
  public readonly '61': MidiPatch
  public readonly '62': MidiPatch
  public readonly '63': MidiPatch
  public readonly '64': MidiPatch
  public readonly '65': MidiPatch
  public readonly '66': MidiPatch
  public readonly '67': MidiPatch
  public readonly '68': MidiPatch
  public readonly '69': MidiPatch
  public readonly '70': MidiPatch
  public readonly '71': MidiPatch
  public readonly '72': MidiPatch
  public readonly '73': MidiPatch
  public readonly '74': MidiPatch
  public readonly '75': MidiPatch
  public readonly '76': MidiPatch
  public readonly '77': MidiPatch
  public readonly '78': MidiPatch
  public readonly '79': MidiPatch
  public readonly '80': MidiPatch
  public readonly '81': MidiPatch
  public readonly '82': MidiPatch
  public readonly '83': MidiPatch
  public readonly '84': MidiPatch
  public readonly '85': MidiPatch
  public readonly '86': MidiPatch
  public readonly '87': MidiPatch
  public readonly '88': MidiPatch
  public readonly '89': MidiPatch
  public readonly '90': MidiPatch
  public readonly '91': MidiPatch
  public readonly '92': MidiPatch
  public readonly '93': MidiPatch
  public readonly '94': MidiPatch
  public readonly '95': MidiPatch
  public readonly '96': MidiPatch
  public readonly '97': MidiPatch
  public readonly '98': MidiPatch
  public readonly '99': MidiPatch
  public readonly '100': MidiPatch
  public readonly '101': MidiPatch
  public readonly '102': MidiPatch
  public readonly '103': MidiPatch
  public readonly '104': MidiPatch
  public readonly '105': MidiPatch
  public readonly '106': MidiPatch
  public readonly '107': MidiPatch
  public readonly '108': MidiPatch
  public readonly '109': MidiPatch
  public readonly '110': MidiPatch
  public readonly '111': MidiPatch
  public readonly '112': MidiPatch
  public readonly '113': MidiPatch
  public readonly '114': MidiPatch
  public readonly '115': MidiPatch
  public readonly '116': MidiPatch
  public readonly '117': MidiPatch
  public readonly '118': MidiPatch
  public readonly '119': MidiPatch
  public readonly '120': MidiPatch
  public readonly '121': MidiPatch
  public readonly '122': MidiPatch
  public readonly '123': MidiPatch
  public readonly '124': MidiPatch
  public readonly '125': MidiPatch
  public readonly '126': MidiPatch
  public readonly '127': MidiPatch;

  *[Symbol.iterator](): Generator<MidiPatch> {
    for (let i = 0; i < 128; i++) {
      const patchId = i as MidiPatchId
      yield this[patchId]
    }
  }
}
