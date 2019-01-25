const Command = require('../../modules/command')

const data = {
  name: 'noformat',
  desc: 'Return the last message sent by the bot in a codeblock for easy copying',
  action: ({ msg, agent }) => {
    return '```\n' + agent.lastMessage(msg.channel).content + '\n```'
  }
}

module.exports = new Command(data)
