const Replacer = require('../../modules/replacer')

const data = {
  key: 'LAST',
  desc: 'Last message sent in channel by bot',
  action: ({ msg }) => {
    const lastMessage = msg.channel.lastMessage
    return lastMessage && lastMessage.content ? lastMessage.content : 'No previous message'
  }
}

module.exports = new Replacer(data)
