const Command = require('../../modules/command')
const { replace } = require('../utils')

const data = {
  name: 'deleet',
  desc: 'Turn leet speak into letters in text',
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => replace(text, 'leet', 'leetRef')
}

module.exports = new Command(data)
