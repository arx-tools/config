import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatDuration } from '../src/formatDuration.ts'

void describe('formatDuration', () => {
  void it('prints the whole milliseconds below a second', () => {
    assert.equal(formatDuration(6.983), '6.983ms')
    assert.equal(formatDuration(56.83), '56.83ms')
    assert.equal(formatDuration(230.4), '230.4ms')
  })

  void it('prints the seconds with four significant digits above a second', () => {
    assert.equal(formatDuration(1990), '1.99s')
    assert.equal(formatDuration(123_500), '123.5s')
  })
})
