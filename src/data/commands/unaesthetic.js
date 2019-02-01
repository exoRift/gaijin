const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'unaesthetic',
  desc: 'Remove the ａｅｓｔｈｅｔｉｃ from text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'aesthetic', 'base')
}

module.exports = new Command(data)
