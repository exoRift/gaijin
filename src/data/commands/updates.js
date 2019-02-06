const { readFileSync } = require('fs')
const { join } = require('path')
const Command = require('../../modules/command')

const data = {
  name: 'updates',
  desc: 'View the current or a past version\'s changes',
  options: {
    args: [{ name: 'version' }]
  },
  action: ({ args: [ver] }) => {
    const updates = readFileSync('src/data/updates.txt', 'utf8')
    const version = ver && (ver.match(/\./g) || []).length >= 2 ? ver : require(join(process.cwd(), './package.json')).version
    return '```Swift\n' + updates.substring(updates.indexOf(version), updates.indexOf('|', updates.indexOf(version))) + '```'
  }
}

module.exports = new Command(data)
