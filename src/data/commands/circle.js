const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'circle',
  desc: 'Put all characters in the provided text in circles',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'base', 'circle')
}

module.exports = new Command(data)
