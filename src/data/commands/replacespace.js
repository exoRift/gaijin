const Command = require('../../modules/command')

const data = {
  name: 'replacespace',
  desc: 'Replace all the spaces in the provided text with something',
  options: {
    args: [{ name: 'replace with', mand: true, delim: '|' }, { name: 'text', mand: true }]
  },
  action: ({ msg, args: [replace, text] }) => text.replace(/\s/g, replace)
}

module.exports = new Command(data)
