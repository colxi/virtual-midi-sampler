import noteToMidiKey from './note-to-midi-key'

describe('Note To Midi Key', () => {
  describe('Error handling', () => {
    it('Throws an error when input is not a string', () => {
      expect(() => noteToMidiKey((12 as unknown) as string)).toThrow(Error)
    })

    it('Throws an error when invalid notation is provided', () => {
      expect(() => noteToMidiKey('cB99')).toThrow(Error)
    })

    it('Throws an error when note out of MIDI range', () => {
      expect(() => noteToMidiKey('C99')).toThrow(Error)
    })
  })

  describe('Test some notes', () => {
    it('Returns 36 for C1', () => {
      expect(noteToMidiKey('C1')).toEqual(36)
    })

    it('Returns 12 for C-1', () => {
      expect(noteToMidiKey('C-1')).toEqual(12)
    })

    it('Returns 49 for C#2', () => {
      expect(noteToMidiKey('C#2')).toEqual(49)
    })

    it('Returns 50 for C##2', () => {
      expect(noteToMidiKey('C##2')).toEqual(50)
    })

    it('Returns 49 for C#b#2', () => {
      expect(noteToMidiKey('C#b#2')).toEqual(49)
    })
  })
})
