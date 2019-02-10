const Command = require('../../modules/command')

const data = {
  name: 'eval',
  desc: 'OWNER ONLY DEBUG COMMAND',
  options: {
    args: [{ name: 'code', mand: true }],
    restricted: true
  },
  action: async function ({ msg, client, args: [code] }) {
    let result = {
      output: null,
      color: 65280,
      type: null
    }
    try {
      const output = await eval(code) // eslint-disable-line
      const type = typeof output === 'object' ? output.constructor.name : typeof output
      result = {
        output: type === 'Promise' ? output : require('util').inspect(output).replace(new RegExp(client.token, 'g'), 'REDACTED'),
        color: 65280,
        type
      }
    } catch (err) {
      result = {
        output: err,
        color: 16711680,
        type: 'Error'
      }
    }
    return {
      embed: {
        color: result.color,
        footer: {
          text: 'Type: ' + result.type
        },
        author: {
          name: 'JS Evaluation',
          icon_url: msg.author.avatarURL
        },
        fields: [
          {
            name: 'Input',
            value: '```JS\n' + code + '```'
          },
          {
            name: result.type === 'Error' ? 'Error' : 'Output',
            value: '```JS\n' + result.output + '```'
          }
        ]
      }
    }
  }
}

module.exports = new Command(data)
