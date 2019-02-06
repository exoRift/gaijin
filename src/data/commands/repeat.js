const Command = require('../../modules/command')

const data = {
  name: 'repeat',
  desc: 'Repeat provided text (one message)',
  options: {
    args: [{ name: 'times', mand: true }, { name: 'text', mand: true }]
  },
  action: ({ args: [times, text] }) => text.repeat(times)
}

module.exports = new Command(data)
