const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'morse',
  desc: 'Convert text to Morse Code',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text.toLowerCase(), 'base', 'morse', { delim: ' ' })
}

module.exports = new Command(data)
