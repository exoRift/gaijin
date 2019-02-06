const Command = require('../../modules/command')

const data = {
  name: 'say',
  desc: 'Make the bot say whatever you want',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => text
}

module.exports = new Command(data)
