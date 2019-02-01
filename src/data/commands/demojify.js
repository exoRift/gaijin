/* NOTE: WORK IN PROGRESS */
const Command = require('../../modules/command')

const data = {
  name: 'demojify',
  desc: 'Turn emojis back into letters',
  options: {
    args: [{ name: 'text', mand: true }],
    restricted: true
  },
  action: ({ args: [text] }) => { }
}

module.exports = new Command(data)
