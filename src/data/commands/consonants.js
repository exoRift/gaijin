const Command = require('../../modules/command')
const { reference: { vowels } } = require('../utils')

const data = {
  name: 'consonants',
  desc: 'Remove all vowels from text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => text.split('').filter((e) => !vowels.includes(e.toLowerCase())).join('')
}

module.exports = new Command(data)
