# random

Cryptographically secure random number generator using `/dev/urandom` with fallback to node's `crypto` and finally to `window.crypto || window.mscrypto`.

### Usage

```
// get random buffer of length 100
var buff = await randBuffer(100)

// get random, alphanumeric (default) string of length 100
var str = await randStr(100)

// get random, alphanumeric + special string of length 100
var str = await randStr(100, 'all')

// get random number less than or equal to 100
var num = await randInt(100)

// get random timestamp from within range of unix timestamps (seconds)
var time = randTimestamp(date.now()/1000 - 10000, date.now()/1000)
```

##### Node

```
import { haystack, randBuffer, randStr, randInt } from '../random/random.js'
```

### License

MIT Copyright isysd
