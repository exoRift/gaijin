const Command = require('../../modules/command')
const { reference: { corrupt } } = require('../utils')

const data = {
  name: 'corrupt',
  desc: 'Use the Zalgo method to corrupt characters',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ msg, args: [text] }) => text.split('').reduce((a, e) => {
    const rand = Math.floor(Math.random() * 3)
    for (let i = 0; i <= rand; i++) e += corrupt[Math.floor(Math.random() * corrupt.length)]
    return a + e
  }, '')
}

module.exports = new Command(data)
