const Command = require('../../modules/command')

const data = {
  name: 'unbinary',
  desc: 'Convert Binary to text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => Buffer.from(text).toString('utf8')
}

module.exports = new Command(data)
