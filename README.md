# vue-bus-park

Vue.js plugin that allows you to use event buses throughout the application.

## Installation

Install from NPM

```
npm install vue-bus-park
```

Use `Vue.use` with event buses object

```javascript
import VueBusPark, { Bus } from 'vue-bus-park'

Vue.use(VueBusPark, {
  /* provided by nanoevents */
  bus1: new Bus(),
  /* native WebSocket */
  socket1: new WebSocket(url, options),
  /* socketio */
  socket2: socketio(url)
})
```

## Event buses logic

You can pass any object that have the following methods:

* Listening: `.on(evt, cb)` or `.addEventListener(evt, cb)`
* Emitting: `.emit(...args)` or `.send(...args)`

All event buses will have unified methods:

* `.on(evt, cb)` that returns function to unsubscribe
  * If bus has `.on()`
    * If bus has `.off()`, returns a function that will use `.off()`
    * Otherwise, just returns a function given by `.on()`
  * If bus has `.addEventListener()`, returns a function that will use `.removeEventListener()`
* `.emit(...args)` that sends events

## Plugin API

#### Listen to events

Instead of this:

```javascript
export default {
  created() {
    this.offSomeEvent = this.bus1.on('someEvent', data => {
      console.log(data)
    })

    this.socket.addEventListener('chat.message', message => {
      console.log(message)
    })
  },
  beforeDestroy() {
    this.offSomeEvent()
    this.socket.removeEventListener('chat.message')
  }
}
```

Just use this:

```javascript
export default {
  events: {
    bus1: {
      someEvent(data) {
        console.log(data)
      }
    },
    socket1: {
      'chat.message'(message) {
        console.log(message)
      }
    }
  }
}
```

#### Events emitting

Unified way to use different event buses

```javascript
this.$bus.bus1.emit('evt', data)
this.$bus.socket1.emit(data)
```

## License

MIT
