const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'double',
  desc: 'Change the font to a doubled font in the text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'base', 'double', { delim: ' ' })
}

module.exports = new Command(data)
