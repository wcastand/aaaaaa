const { channel, drain, select, take, put } = require('@paybase/csp')
const fetch = require('node-fetch')
const channels = new Map()

const timeout = t => new Promise(r => setTimeout(r, t))

module.exports = {
  Query: {
    operatesub: async (_, { sid, operation }, ...d) => {
      const chans = channels.get(sid)
      if (!chans) return false
      const { signal, message } = chans

      switch (operation) {
        case 'reset':
          put(signal, { reset: true })
          break
        case 'stop':
          put(signal, { stop: true })
          break
        default:
          return false
      }
      return true
    },
    photos: async (_, params) => {
      const chans = channels.get(params.sid)
      if (!chans) return false
      const { signal, message } = chans
      const mmm = channel()
      const set = new Set([signal, mmm])
      const photos = await fetch(
        `http://jsonplaceholder.typicode.com/photos?_start=${params.offset ||
          0}&_limit=${params.limit || 25}`,
      ).then(r => r.json())

      photos.forEach(async (photo, i) => {
        await timeout(i * 2000)
        put(mmm, photo)
      })

      for await (const [chan, msg] of select(set)) {
        switch (chan) {
          case signal:
            switch (Object.keys(msg)[0]) {
              case 'reset':
              case 'stop':
                return true
            }
            break
          default:
            put(message, { createsub: msg })
            break
        }
      }
      return true
    },
  },

  Subscription: {
    createsub: {
      subscribe: async (_, params) => {
        try {
          const signal = channel()
          const message = channel()
          const chans = new Set([signal, message])
          channels.set(params.sid, { signal, message })
          return {
            async *[Symbol.asyncIterator]() {
              yield { createsub: { subscribed: true, sid: params.sid } }
              for await (const [chan, msg] of select(chans)) {
                switch (chan) {
                  case signal:
                    if (Object.keys(msg)[0] === 'stop') return
                    break
                    return
                  default:
                    yield msg
                    break
                }
              }
              return
            },
          }
        } catch (e) {
          throw e
        }
      },
    },
  },
  SubResponse: {
    __resolveType(obj, context, info) {
      if (obj.id) return 'Photo'
      return 'SubReady'
    },
  },
}
