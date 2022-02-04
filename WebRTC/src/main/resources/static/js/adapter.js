var youbora = require('youboralib')
var manifest = require('../manifest.json')

youbora.adapters.Html5 = youbora.Adapter.extend({
  getVersion: function () {
    return manifest.version + '-' + manifest.name + '-' + manifest.tech
  },

  getPlayhead: function () {
    return this.player.currentTime
  },

  getDuration: function () {
    return this.player.duration
  },

  getIsLive: function () {
    return this.player.duration === Infinity
  },

  getResource: function () {
    return this.player.currentSrc
  },

  getPlayrate: function() {
    return this.player.playbackRate
  },

  getPlayerName: function () {
    return 'html5'
  },

  registerListeners: function () {
    this.monitorPlayhead(true, false)

    this.references = {
      play: this.playListener.bind(this),
      timeupdate: this.timeupdateListener.bind(this),
      pause: this.pauseListener.bind(this),
      playing: this.playingListener.bind(this),
      error: this.errorListener.bind(this),
      seeking: this.seekingListener.bind(this),
      seeked: this.seekedListener.bind(this),
      ended: this.endedListener.bind(this),
      loadstart: this.endedListener.bind(this),
      waiting: this.bufferingListener.bind(this)
    }
    for (var key in this.references) {
      this.player.addEventListener(key, this.references[key])
    }
  },

  /** Unregister listeners to this.player. */
  unregisterListeners: function () {
    // Disable playhead monitoring
    if (this.monitor) this.monitor.stop()

    // unregister listeners
    if (this.player && this.references) {
      for (var key in this.references) {
        this.player.removeEventListener(key, this.references[key])
        delete this.references[key]
      }
    }
  },

  playListener: function (e) {
    this.fireStart()
  },

  timeupdateListener: function (e) {
    if (this.getPlayhead() > 0.1 && !this.player.error) {
      this.fireStart()
      this.fireJoin()
    }
  },

  pauseListener: function (e) {
    this.firePause()
  },

  playingListener: function (e) {
    this.fireResume()
    this.fireSeekEnd()
    if (this.flags.isBuffering && this.monitor && typeof this.monitor.canBeUsed === 'function' && !this.monitor.canBeUsed()){
      this.fireBufferEnd()
    }
  },

  errorListener: function (e) {
    var msg = null
    var code = null
    try {
      if (e && e.target && e.target.error) {
        code = e.target.error.code
        msg = e.target.error.message
      }
    } catch (err) {
      // nothing
    }
    this.fireError(code, msg)
  },

  seekingListener: function (e) {
    this.fireSeekBegin()
  },

  seekedListener: function (e) {
    this.fireSeekEnd()
  },

  endedListener: function (e) {
    this.fireStop()
  },

  bufferingListener: function(e) {
    if (this.monitor && typeof this.monitor.canBeUsed === 'function' && !this.monitor.canBeUsed()){
      this.fireBufferBegin()
    }
  }
})

module.exports = youbora.adapters.Html5
