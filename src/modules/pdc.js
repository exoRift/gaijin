const EventEmitter = require('events').EventEmitter

class PseudoDiscordClient extends EventEmitter {
  _recieveMessage (content, id) {
    this.emit('messageCreate', {
      content,
      author: {
        username: 'foo',
        id
      }
    })
  }
}

module.exports = PseudoDiscordClient
