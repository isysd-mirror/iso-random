import assert from '../iso-assert/assert.js'
import { haystack, randBuffer, randStr, randInt } from './random.js'
import { finishTest } from '../iso-test/index.js'

(async () => {
  var str = await haystack(100, 'alphanumeric')
  assert.ok(str)
  assert.equal(str.length, 256)
  finishTest('pass 100 alphanumeric haystack')

  str = await haystack(254, 'alphanumeric')
  assert.ok(str)
  assert.equal(str.length, 256)
  finishTest('pass 254 alphanumeric haystack')

  str = await haystack(256, 'alphanumeric')
  assert.ok(str)
  assert.equal(str.length, 512)
  finishTest('pass 256 alphanumeric haystack')

  var buff = await randBuffer(100)
  assert.ok(buff)
  assert.equal(buff.length, 100)
  finishTest('pass 100 buffer')

  str = await randStr(100)
  assert.ok(str)
  assert.equal(str.length, 100)
  finishTest('pass 100 randstr')

  str = await randStr(300)
  assert.ok(str)
  assert.equal(str.length, 300)
  finishTest('pass 300 randstr')

  var num = await randInt(1)
  assert.ok(num <= 1)
  finishTest('pass 1 randint')

  finishTest('kill')
})().catch(e => {
  finishTest(e.toString())
})
