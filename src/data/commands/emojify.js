const Command = require('../../modules/command')
const { reference: { base } } = require('../utils')

const numbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]
const punc = {
  '.': 'radio_button',
  '!': 'exclamation',
  '?': 'question'
}

const data = {
  name: 'emojify',
  desc: 'Turn numbers and letters in the text into emojis',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => text.toLowerCase().split('').reduce((a, e) => {
    const index = base.indexOf(e)
    return a + ((punc[e] ? `:${punc[e]}:` : false) || (index !== -1 ? (index < 26 ? `:regional_indicator_${e}:` : index < 36 ? `:${numbers[e]}:` : e) : e))
  }, '')
}

module.exports = new Command(data)
