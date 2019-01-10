const Command = require('../../modules/command')
const { reference: { vowels } } = require('../utils')

const data = {
  name: 'vowels',
  desc: 'Remove all consonants from text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ msg, args: [text] }) => text.split('').filter(e => vowels.includes(e.toLowerCase())).join('')
}

module.exports = new Command(data)
