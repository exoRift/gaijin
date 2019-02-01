const ascii = require('ascii-text-generator')

const Command = require('../../modules/command')

const data = {
  name: 'ascii',
  desc: 'Make the bot say whatever you want',
  options: {
    args: [{ name: 'type (1, 2, 3)', mand: true }, { name: 'text', mand: true }]
  },
  action: ({ args: [type, text] }) => '```\n' + ascii(text, ['1', '2', '3'].includes(type) ? type : '2') + '```'
}

module.exports = new Command(data)
