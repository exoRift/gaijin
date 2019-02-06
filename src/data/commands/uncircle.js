const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'uncircle',
  desc: 'Remove circles from the provided text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'circle', 'base')
}

module.exports = new Command(data)
