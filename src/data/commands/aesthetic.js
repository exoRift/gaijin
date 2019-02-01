const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'aesthetic',
  desc: 'Give the text some ａｅｓｔｈｅｔｉｃ',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'base', 'aesthetic')
}

module.exports = new Command(data)
