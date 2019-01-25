const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'unmorse',
  desc: 'Convert Morse Code to text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'morse', 'base', { findDelim: ' ' })
}

module.exports = new Command(data)
