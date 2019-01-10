const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'flip',
  desc: 'Flip a string',
  options: {
    args: [{ name: 'type (vertical, horizontal, reverse)', mand: true }, { name: 'text', mand: true }]
  },
  action: ({ msg, args: [type, text] }) => {
    if (type.toLowerCase() === 'reverse') return text.split('').reverse().join('')
    return replace(text, 'base', type + 'Flip')
  }
}

module.exports = new Command(data)
