const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'unflip',
  desc: 'Unflip a string from any direction (Will not unreverse)',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ msg, args: [text] }) => replace(text, ['verticalFlip', 'horizontalFlip'], 'base')
}

module.exports = new Command(data)
