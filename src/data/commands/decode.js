const Command = require('../../modules/command')

const data = {
  name: 'decode',
  desc: 'Decode Base64 into utf8 text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => Buffer.from(text).toString('utf8')
}

module.exports = new Command(data)
