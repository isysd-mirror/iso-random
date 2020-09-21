import { readRandom } from '../iso-read-random/read-random.js'
import { randomBytes } from '../iso-randombytes/randombytes.js'
import { Readable, Transform } from '../iso-stream/stream.js'
import global from '../always-global/global.js'
import { Process } from '../iso-process/process.js'
import { promisify } from '../iso-util/util.js'
global.process = Process.getProcess()

export const URAND_OS = [
  'linux',
  'x11',
  'ios',
  'android',
  'openbsd',
  'sunos',
  'mac_powerpc',
  'macintosh',
  'osx',
  'macos'
]
export const CHARS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  special: `~!@#$%^&*()-_+={}[]<>\\|:;'",.?`
}
CHARS.alphanumeric = CHARS.lower + CHARS.upper + CHARS.number
CHARS.all = CHARS.alphanumeric + CHARS.special
export const BYTESNEEDED = [
  256,
  65536,
  16777216,
  4294967296,
  1099511627776,
  281474976710656
]

export function randBufferStream (length = 256, device = '/dev/urandom') {
  if (process.release && process.release.name && process.release.name === 'node' && URAND_OS.indexOf(process.platform) !== -1) return readRandomStream(length, device)
  const readableStream = new Readable()
  const bytes = randomBytes(length)
  readableStream.push(bytes)
  return readableStream
}

export async function randBuffer (length = 256, device = '/dev/urandom') {
  if (process.release && process.release.name && process.release.name === 'node' && URAND_OS.indexOf(process.platform) !== -1) return readRandom(length, device)
  return randomBytes(length)
}

export function haystackStream (length = 256, charset = 'alphanumeric') {
  const readableStream = new Readable()
  haystack(length, charset).then(h => {
    readableStream.push(h)
  }).catch(e => {
    readableStream.emit('error', e.toString())
  })
  return readableStream
}

export async function haystack (length = 256, charset = 'alphanumeric') {
  var h = CHARS[charset]
  while (h <= 256 || h.length <= length || h.length % 256 !== 0) {
    h += CHARS[charset][await randInt(CHARS[charset].length - 1)]
  }
  return h
}

export function randStringStream (length = 256, charset = 'alphanumeric') {
  const readableStream = new Readable()
  randString(length, charset).then(s => {
    readableStream.push(s)
  }).catch(e => {
    readableStream.emit('error', e.toString())
  })
  return readableStream
}
export const randStrStream = randStringStream

export async function randString (length = 256, charset = 'alphanumeric') {
  var buff = await randBuffer(length)
  var rstr = ''
  var h = await haystack(length, charset)
  for (var b of buff.values()) {
    var i = b % h.length
    rstr += h[i]
  }
  return rstr
}
export const randStr = randString

export function intBytesNeeded (maximum = 255) {
  var bytes
  if (maximum < BYTESNEEDED[0]) bytes = 1
  else if (maximum < BYTESNEEDED[1]) bytes = 2
  else if (maximum < BYTESNEEDED[2]) bytes = 3
  else if (maximum < BYTESNEEDED[3]) bytes = 4
  else if (maximum < BYTESNEEDED[4]) bytes = 5
  else if (maximum < BYTESNEEDED[5]) bytes = 6
  else throw new RangeError(`maximum random number to generate is 281474976710656`)
  return bytes
}

export function randIntStream (maximum = 255) {
  const readableStream = new Readable()
  randInt(maximum).then(i => {
    readableStream.push(i)
  }).catch(e => {
    readableStream.emit('error', e.toString())
  })
  return readableStream
}

export async function randInt (maximum = 255) {
  var bytes = intBytesNeeded(maximum)
  var buff = await randBuffer(bytes)
  var r = buff.readUIntBE(0, bytes)
  if (r <= maximum) return r
  else return randInt(maximum) // outside of range, try again and do not modulo
}

export function randTimestampStream (begin, end) {
  const readableStream = new Readable()
  randTimestamp(begin, end).then(t => {
    readableStream.push(t)
  }).catch(e => {
    readableStream.emit('error', e.toString())
  })
  return readableStream
}

export async function randTimestamp (begin, end) {
  end = end || Math.floor(Date.now() / 1000) // default end time is now
  begin = begin || end - 65535 // default begin is ~3/4 days in the past
  var diff = end - begin
  var seed = await randInt(diff)
  return begin + seed
}

export default {
  haystack,
  randBuffer,
  randStr,
  randInt,
  randTimestamp,
}
