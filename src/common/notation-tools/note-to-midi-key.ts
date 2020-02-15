type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
// prettier-ignore
type MidiNoteId = |0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23
                  |24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43
                  |44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63
                  |64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83
                  |84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|101|102
                  |103|104|105|106|107|108|109|110|111|112|113|114|115|116|117
                  |118|119|120|121|122|123|124|125|126|127

// prettier-ignore
const NOTE_OFFSET = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
// prettier-ignore
const ACCIDENT_MODIFIER = { 'b': -1, '#': +1 }

const NOTE_EXTRACT_EXP = /^(?<note>[C|D|E|F|G|A|B])(?<accidents>[b|#]+)?(?<octave>-?\d+)$/
const MIDI_NOTE_C0 = 24
const OCTAVE_SEMI_TONES_COUNT = 12
const MIDI_KEY_FIRST_ID = 0
const MIDI_KEY_LAST_ID = 127

/**
 * Receives an absolute Note in standard notation (eg:"D#5") and returns
 * its corresponding MIDI Note ID (0-127).
 */
export default function noteToMidiKey(absoluteNoteName: string): MidiNoteId {
  // input type validation
  if (typeof absoluteNoteName !== 'string') {
    throw new Error('Note name must be a string. (eg : "C#7")')
  }

  // validate note name and extract note data groups
  const result = absoluteNoteName.match(NOTE_EXTRACT_EXP)
  if (!result || !result.groups) {
    throw new Error(
      'Unknown note. Allowed notation : <Note>[<Accidents]><Octave> (eg: "Cbb4")'
    )
  }
  // extract and normalize note meta data
  const name = result.groups.note as NoteName
  const octave = Number(result.groups.octave)
  const accidents = (result.groups.accidents || '').split('') as Array<
    keyof typeof ACCIDENT_MODIFIER
  >

  // calculate octave base-key id
  let midiNoteId: number = MIDI_NOTE_C0
  midiNoteId += octave * OCTAVE_SEMI_TONES_COUNT
  midiNoteId += NOTE_OFFSET[name]

  // apply accidents
  for (const accident of accidents) midiNoteId += ACCIDENT_MODIFIER[accident]

  // Trigger error if out of MIDI key range
  if (midiNoteId < MIDI_KEY_FIRST_ID || midiNoteId > MIDI_KEY_LAST_ID) {
    throw new Error('Invalid input. Resulting MIDI note out of range (0-127)')
  }

  // done!
  return midiNoteId as MidiNoteId
}
