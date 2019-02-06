const { join } = require('path')

const Command = require('../../modules/command')
const Await = require('../../modules/await')
const { prefix, help } = require('../links.json')

const data = {
  name: 'help',
  desc: 'Display this menu',
  options: {
    args: [{ name: 'page #' }]
  },
  action: function ({ client, commands, replacers, args: [num = 0] }) {
    const fields = ['']
    const pkg = require(join(process.cwd(), '/package.json'))
    for (const command of [...commands.values()]) {
      if (command.restricted) continue
      const content = command.info
      let index = fields.length - 1
      if ((fields[index] + content).length > 1024) {
        index++
        fields[index] = ''
      }
      fields[index] += (fields[index].length ? '\n' : '') + content
    }
    fields.push('**Replacers:**\n*Inserts live data values into commands. `|REPLACERNAME|` (IN requires a number)*\n\n' + [...replacers.values()].reduce((a, e) => `${a}**${e.key}** - *${e.description}*\n`, ''))
    const embed = {
      title: '*[Click for support]* Made by mets11rap\nDISCLAIMER: If you have an outdated computer, some symbols may not appear correctly. Also, some commands support all characters, while some only support some.',
      description: `${client.user.username} is a text manipulation bot, useful for basic text functions or tools. Click [here](${process.env.DBL_PAGE}) to add me to your server!\n**Note:** The dates used are EDT timezone. [Github](${pkg.repository.url.substring(4)})`,
      url: 'https://discord.gg/' + process.env.SUPPORT_SERVER,
      color: 33023,
      footer: {
        icon_url: prefix,
        text: `Prefix: "${process.env.PREFIX}" or mention | <> = Mandatory () = Optional`
      },
      thumbnail: {
        url: client.user.dynamicAvatarURL('png')
      },
      author: {
        name: `${client.user.username} ${pkg.version} Help`,
        icon_url: help
      },
      fields: [
        {
          name: `Commands Page ${parseInt(num) || 1} out of ${fields.length}`,
          value: fields[parseInt(num) - 1] || fields[0]
        }
      ]
    }

    const wait = new Await({
      check: ({ msg, prefix }) => msg.content.startsWith(prefix + 'help'),
      time: 15000,
      options: {
        args: [{ name: 'page #' }]
      },
      action: ({ msg, args: [num], lastResponse }) => {
        embed.fields = [
          {
            name: `Commands Page ${parseInt(num) || 1} out of ${fields.length}`,
            value: fields[parseInt(num) - 1] || fields[0]
          }
        ]
        lastResponse.edit({ embed })
        return { wait }
      }
    })

    return {
      embed,
      wait
    }
  }
}

module.exports = new Command(data)
