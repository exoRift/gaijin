const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'undouble',
  desc: 'Undouble doubled characters in text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'double', 'base', { findDelim: ' ' })
}

module.exports = new Command(data)
