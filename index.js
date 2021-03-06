export default function VueBusPark(Vue, busesList) {
  const buses = {}

  const addBus = (name, bus) => {
    buses[name] = bus
    bus.on = function(evt, cb) {
      if (buses[name].on) {
        const offByOn = bus.on(evt, cb)
        const offByOff = () => {
          bus.off(evt, cb)
        }
        return bus.off ? offByOff : offByOn
      }
      bus.addEventListener(evt, cb)
      return () => {
        bus.removeEventListener(evt, cb)
      }
    }
    bus.emit = bus.emit || bus.send
  }

  const createControls = vm => {
    const $events = vm.$options.events
    const controls = {
      add(name, bus) {
        controls.listeners[name] = {}
        addBus(name, bus)
        if (!$events || !$events[name]) return
        Object.entries($events[name]).forEach(([evt, cb]) => {
          controls.listeners[name][evt] = (
            controls.listeners[name][evt] || []
          ).concat(buses[name].on(evt, cb.bind(vm)))
        })
      },

      remove(name) {
        if (!controls.listeners[name]) return
        Object.entries(controls.listeners[name]).forEach(([evt, cbs]) => {
          cbs.forEach(off => off())
        })
      },

      listeners: {}
    }
    return controls
  }

  Object.entries(busesList).forEach(([name, bus]) => {
    addBus(name, bus)
  })

  Vue.mixin({
    created() {
      this.$bus = buses
      this.$buses = createControls(this)
      if (!this.$options.events) return
      Object.keys(this.$options.events).forEach(name => {
        if (buses[name]) {
          this.$buses.add(name, buses[name])
        }
      })
    },

    beforeDestroy() {
      if (!this.$options.events) return
      Object.keys(this.$options.events).forEach(name => {
        this.$buses.remove(name)
      })
    }
  })
}

export { default as Bus } from 'nanoevents'
