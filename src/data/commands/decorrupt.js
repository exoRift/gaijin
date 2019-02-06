const Command = require('../../modules/command')
const { reference: { corrupt } } = require('../utils')

const data = {
  name: 'decorrupt',
  desc: 'Remove the Zalgo characters from a string',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => text.replace(new RegExp(corrupt.reduce((a, e) => a + (a ? '|' : '') + e, ''), 'g'), '')
}

module.exports = new Command(data)
