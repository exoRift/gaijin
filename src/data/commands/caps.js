const Command = require('../../modules/command')

const data = {
  name: 'caps',
  desc: 'Manipulate the capitalization of text',
  options: {
    args: [{ name: 'type (all, none, sentence, word, rand)', mand: true }, { name: 'text', mand: true }]
  },
  action: ({ msg, args: [type, text] }) => {
    switch (type) {
      case 'all': return text.toUpperCase()
      case 'none': return text.toLowerCase()
      case 'sentence': return text.replace(/(^|\.|\?|!)(\s+.|.)/g, match => match.toUpperCase())
      case 'word': return text.split(' ').map(e => e.slice(-1).toUpperCase() + e.slice(1)).join(' ')
      case 'rand': return text.split('').map(e => Math.round(Math.random()) ? e.toUpperCase() : e.toLowerCase()).join('')
      default: throw Error('Invalid Type.')
    }
  }
}

module.exports = new Command(data)
