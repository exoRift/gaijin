const Command = require('../../modules/command')

const data = {
  name: 'encode',
  desc: 'Encode text into Base64',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => Buffer.from(text).toString('base64')
}

module.exports = new Command(data)
