const Eris = require('eris')
/**
 * Custom version of Eris.
 * @extends Eris
 */
class CustomEris extends Eris {
  constructor () {
    super()
    this.TextChannel = CustomTextChannel
  }
}
/**
 * Custom version of Eris.TextChannel.
 * @extends Eris.TextChannel
 */
class CustomTextChannel extends Eris.TextChannel {
  /**
   * Get the last message sent by this bot in the channel.
   * @returns {Eris.Message} The last message sent by this bot in the channel.
   */
  get lastMessage () {
    const messages = this.messages.filter(m => m.author.id === this.guild.shard.client.user.id)
    return messages[messages.length - 1]
  }
}

module.exports = CustomEris
