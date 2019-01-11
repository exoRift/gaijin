const Eris = require('eris')

Object.defineProperty(Eris.TextChannel.prototype, 'lastMessage', {
  get () {
    const messages = this.messages.filter((m) => m.author.id === this.guild.shard.client.user.id)
    return messages[messages.length - 1]
  }
})

module.exports = Eris
