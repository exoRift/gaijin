const Command = require('../../modules/command')

const data = {
  name: 'replace',
  desc: 'Find something in text and replace it with something else',
  options: {
    args: [{ name: 'find', mand: true, delim: '|' }, { name: 'replace', mand: true, delim: '|' }, { name: 'text', mand: true }]
  },
  action: ({ args: [find, replace, text] }) => text.replace(new RegExp(find, 'g'), replace)
}

module.exports = new Command(data)
