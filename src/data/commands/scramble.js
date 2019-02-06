const Command = require('../../modules/command')

const data = {
  name: 'scramble',
  desc: 'Scramble the letters of text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => {
    const split = text.split('')
    const length = split.length
    for (let i = length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1))
      const tmp = split[i]
      split[i] = split[rand]
      split[rand] = tmp
    }
    return split.join('')
  }
}

module.exports = new Command(data)
