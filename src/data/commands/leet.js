const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'leet',
  desc: 'Change leet-able characters to leet speak in text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'leetRef', 'leet')
}

module.exports = new Command(data)
