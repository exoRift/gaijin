const Command = require('../../modules/command')

const data = {
  name: 'length',
  desc: 'Return the length of the given text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => text.length
}

module.exports = new Command(data)
