const Command = require('../../modules/command')

const data = {
  name: 'space',
  desc: 'Space out text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ msg, args: [text] }) => text.split('').join(' ')
}

module.exports = new Command(data)
