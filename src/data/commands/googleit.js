const Command = require('../../modules/command')

const data = {
  name: 'data',
  desc: 'Is someone being clueless by not using Google? Use this to teach them',
  options: {
    args: [{ name: 'search', mand: true }]
  },
  action: ({ args: [search] }) => 'https://lmgtfy.com?q=' + search
}

module.exports = new Command(data)
