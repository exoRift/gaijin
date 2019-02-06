const Command = require('../../modules/command')

const data = {
  name: 'binary',
  desc: 'Convert text to Binary',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => Buffer.from(text).toString('binary')
}

module.exports = new Command(data)
