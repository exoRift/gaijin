const Command = require('../../modules/command')
const { resources } = require('../utils')

const data = {
  name: 'resources',
  desc: 'List links to some useful websites',
  action: ({ args: [find, text] }) => '**Resources:**\n' + resources.reduce((a, r) => a + `${r.name}: <${r.link}>\n`, '')
}

module.exports = new Command(data)
