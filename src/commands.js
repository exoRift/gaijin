// DEFINITIONS
const fs = require('fs')
const evaluator = require('expr-eval').Parser.evaluate
const ascii = require('ascii-text-generator')
const path = require('path')
const links = require('./links.json')

const reference = {
  base: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  vowels: 'aeiou'.split(''),
  corrupt: '҉̢̛̕͜͏̵̡͘͟͝͡'.split(''),
  verticalFlip: 'ɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz0123456789ɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇn𐌡ʍxʎz'.split(''),
  horizontalFlip: 'AdↄbɘꟻgHijklmᴎoqpᴙꙅTUvwxYz0123456789AdↃbƎꟻGHIJK⅃MᴎOꟼpᴙꙄTUVWXYZ'.split(''),
  leetRef: 'olizehasgtjbp'.split(''),
  leet: '0112344567789'.split(''),
  morse: '.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. ----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.'.split(' '),
  circle: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ0①②③④⑤⑥⑦⑧⑨ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'.split(''),
  aesthetic: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'.split(''),
  double: '𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫 𝟘 𝟙 𝟚 𝟛 𝟜 𝟝 𝟞 𝟟 𝟠 𝟡 𝔸 𝔹 ℂ 𝔻 𝔼 𝔽 𝔾 ℍ 𝕀 𝕁 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℚ ℝ 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏 𝕐 ℤ'.split(' ')
}
const resources = [
  {
    name: 'RGB Color Picker',
    link: 'https://www.rapidtables.com/web/color/RGB_Color.html'
  },
  {
    name: 'Hexadecimal Color Picker',
    link: 'https://www.w3schools.com/colors/colors_mixer.asp'
  },
  {
    name: 'Integer Color Picker',
    link: 'https://www.shodor.org/stella2java/rgbint.html'
  },
  {
    name: 'Text Fonts (Images)',
    link: 'http://www.flamingtext.com/Free-Logo-Designs'
  },
  {
    name: 'Discord Embed Creator',
    link: 'https://leovoel.github.io/embed-visualizer'
  },
  {
    name: 'JS/HTML Code Beautifier',
    link: 'http://jsbeautifier.org'
  },
  {
    name: 'Regex Tester',
    link: 'https://regex101.com'
  }
]

function indices (string, search) {
  const arr = []
  for (let i = string.indexOf(search); i >= 0; i = string.indexOf(search, i + 1)) arr.push(i)
  return arr
}
function replace (content, find, replace, { splitter = '', delim = '' } = {}) {
  const replacer = reference[replace]
  if (!Array.isArray(find)) find = [find]
  return find.reduce((cont, find) => {
    const finder = reference[find]
    return cont.split(splitter).reduce((cont, char) => cont + (!cont ? '' : delim) + (replacer[finder.indexOf(char)] || char), '')
  }, content)
}
function msgLinkCompile (msg) {
  return `https://discordapp.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
}

// COMMANDS
module.exports = (client, knex) => {
  return {
    keys: [
      {
        key: 'LAST',
        desc: 'Last message sent in channel by bot',
        action: msg => {
          const lastMessage = msg.channel.lastMessage
          return lastMessage && lastMessage.content ? lastMessage.content : 'No previous message'
        }
      },
      {
        key: 'DATE',
        desc: 'Current date',
        action: () => {
          const d = Date()
          // SWITCHING TO EDT
          const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
          return date.substring(0, date.length - 8)
        }
      },
      {
        key: 'IN',
        desc: 'The current date plus the number of hours inputted',
        start: true,
        action: (msg, key) => {
          const num = key.split(' ')[1]
          if (isNaN(Number(num))) return 'Input is not a number'
          const d = new Date(Date.now() + (Number(num) * 3600000)).toString()
          // SWITCHING TO EDT
          const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
          return date.substring(0, date.length - 8)
        }
      }
    ],
    commands: {
      shards: {
        desc: 'View all shard latencies',
        action: msg => {
          const shards = client.shards.map(s => s)
          const latencies = shards.map(s => s.latency)
          const average = latencies.reduce((a, e) => a + e, 0) / latencies.length
          const fields = []
          for (const item of shards) {
            fields.push({
              name: `${!msg.channel.type ? (!item.id ? '*' : '') : (item.id === msg.channel.guild.shard.id ? '*' : '')}Shard ${item.id}`,
              value: `${item.ready ? '<a:Online:469626088579006464>' : '<a:DND:469626088612429824>'} ${(item.ready ? item.latency : 'OFFLINE')}ms`,
              inline: true
            })
          }
          return {
            embed: {
              color: average > 200 && average < 300 ? 16776960 : average > 300 ? 15933733 : 111111,
              author: {
                name: 'Pings (API)',
                icon_url: links.ping
              },
              footer: {
                text: `Average ping is ${average}ms | Total Guilds: ${client.guilds.size}`
              },
              fields: fields
            }
          }
        }
      },
      help: {
        desc: 'Display this menu',
        args: [{ name: 'page #' }],
        action: function (msg, [num]) {
          const fields = ['']
          const pkg = require(path.join(process.cwd(), '/package.json'))
          for (const item in this._commands) {
            // PRIVATE COMMAND CHECK
            if (!this._commands[item].private) {
              const args = this._commands[item].args
              // NAME
              const content = `**${item}` +
              // ARG COMPILER
                (args
                  ? args.reduce((a, e) => {
                    const content = a + (e.mand ? `<${e.name}>` : `(${e.name})`) + (e.delim || ' ')
                    return e.name === args[args.length - 1].name ? content.slice(0, -1 * (e.delim ? e.delim.length : 1)) : content
                  }, ' ')
                  // DESCRIPTION
                  : '') + `** - *${this._commands[item].desc}*`
              const tern = fields[fields.length - 1].length + content.length > 1024 ? fields.length : fields.length - 1
              if (!fields[tern]) fields[tern] = ''
              fields[tern] = fields[tern].concat(fields[tern].length ? '\n' : '', content)
            }
          }
          fields.push('**Keys:**\n*Inputs key values into command `|KEYNAME|` (IN requires a number)*\n\n' + this._keys.reduce((a, e) => `${a}**${e.key}** - *${e.description}*\n`, ''))
          const embed = {
            title: '*[Click for support]* Made by mets11rap\nDISCLAIMER: If you have an outdated computer, some symbols may not appear correctly. Also, some commands support all characters, while some only support some.',
            description: `${client.user.username} is a text manipulation bot, useful for basic text functions or tools. Click [here](${process.env.DBL_PAGE}) to add me to your server!\n**Note:** The dates used are EDT timezone. [Github](${pkg.repository.url.substring(4)})`,
            url: 'https://discord.gg/' + process.env.SUPPORT_SERVER,
            color: 33023,
            footer: {
              icon_url: links.prefix,
              text: `Prefix: "${process.env.PREFIX}" or mention | <> = Mandatory () = Optional`
            },
            thumbnail: {
              url: client.user.dynamicAvatarURL('png')
            },
            author: {
              name: `${client.user.username} ${pkg.version} Help`,
              icon_url: links.help
            },
            fields: [
              {
                name: `Commands Page ${parseInt(num) || 1} out of ${fields.length}`,
                value: fields[parseInt(num) - 1] || fields[0]
              }
            ]
          }
          return {
            embed,
            wait: {
              check: m => m.content.startsWith(process.env.PREFIX + 'help'),
              rspCheck: m => m.embeds[0] && m.embeds[0].description && m.embeds[0].description.startsWith(client.user.username),
              time: 15000,
              args: [{ name: 'page #' }],
              action: (msg, [num], { rsp }) => {
                embed.fields = [
                  {
                    name: `Commands Page ${parseInt(num) || 1} out of ${fields.length}`,
                    value: fields[parseInt(num) - 1] || fields[0]
                  }
                ]
                rsp.edit({ embed })
                return { wait: { refresh: true } }
              }
            }
          }
        }
      },
      syntax: {
        desc: 'View the valid syntax for date paramaters',
        action: () => 'YYYY-MM-DDTHH:MM\nExample: *2018-06-20T07:56*\n**Note**: *This uses 24-hour format*'
      },
      space: {
        desc: 'Space out text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text.split('').join(' ')
      },
      vowels: {
        desc: 'Remove all consonants from text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text.split('').filter(e => this._reference[4].includes(e.toLowerCase())).join('')
      },
      consonants: {
        desc: 'Remove all vowels from text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text.split('').filter(e => !this._reference[4].includes(e.toLowerCase())).join('')
      },
      corrupt: {
        desc: 'Use the Zalgo method to corrupt characters',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => {
          return text.split('').reduce((accum, element) => {
            const rand = Math.floor(Math.random() * 3)
            for (let i = 0; i <= rand; i++) element += this._reference[1][Math.floor(Math.random() * this._reference[1].length)]
            return accum + element
          }, '')
        }
      },
      decorrupt: {
        desc: 'Remove the Zalgo characters from a string',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text.replace(new RegExp(this._reference[1].reduce((a, e) => a + (a ? '|' : '') + e, ''), 'g'), '')
      },
      flip: {
        desc: 'Flip a string',
        args: [{ name: 'type (vertical, horizontal, reverse)', mand: true }, { name: 'text', mand: true }],
        action: (msg, [type, text]) => {
          if (type.toLowerCase() === 'reverse') return text.split('').reverse().join('')
          return replace(text, 'base', type + 'Flip')
        }
      },
      unflip: {
        desc: 'Unflip a string from any direction (Will not unreverse)',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, ['verticalFlip', 'horizontalFlip'], 'base')
      },
      leet: {
        desc: 'Change leet-able characters to leet speak in text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'leetRef', 'leet')
      },
      deleet: {
        desc: 'Turn leet speak into letters in text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'leet', 'leetRef')
      },
      morse: {
        desc: 'Convert text to Morse Code',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text.toLowerCase(), 'base', 'morse', { delim: ' ' })
      },
      unmorse: {
        desc: 'Convert More Code to text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'morse', 'base', { findDelim: ' ' })
      },
      binary: {
        desc: 'Convert text to Binary',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => Buffer.from(text).toString('binary')
      },
      unbinary: {
        desc: 'Convert Binary to text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => Buffer.from(text).toString('utf8')
      },
      encode: {
        desc: 'Encode text into Base64',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => Buffer.from(text).toString('base64')
      },
      decode: {
        desc: 'Decode Base64 into utf8 text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => Buffer.from(text).toString('utf8')
      },
      circle: {
        desc: 'Put all characters in the provided text in circles',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'base', 'circle')
      },
      uncircle: {
        desc: 'Remove circles from the provided text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'circle', 'base')
      },
      aesthetic: {
        desc: 'Give the text some ａｅｓｔｈｅｔｉｃ',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'base', 'aesthetic')
      },
      unaesthetic: {
        desc: 'Remove the ａｅｓｔｈｅｔｉｃ from text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'aesthetic', 'base')
      },
      double: {
        desc: 'Change the font to a doubled font in the text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'base', 'double', { delim: ' ' })
      },
      undouble: {
        desc: 'Undouble doubled characters in text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => replace(text, 'double', 'base', { findDelim: ' ' })
      },
      emojify: {
        desc: 'Turn numbers and letters in the text into emojis',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => {
          const numbers = [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine'
          ]
          const punc = {
            '.': 'radio_button',
            '!': 'exclamation',
            '?': 'question'
          }
          return text.toLowerCase().split('').reduce((a, e) => {
            const index = this._reference.base.indexOf(e)
            return a + ((punc[e] ? `:${punc[e]}:` : false) || (index !== -1 ? (index < 26 ? `:regional_indicator_${e}:` : index < 36 ? `:${numbers[e]}:` : e) : e))
          }, '')
        }
      },
      /* NOTE: WORK IN PROGRESS */
      demojify: {
        private: true,
        desc: 'Turn emojis back into letters',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => {

        }
      },
      say: {
        desc: 'Make the bot say whatever you want',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text
      },
      ascii: {
        desc: 'Create ASCII text',
        args: [{ name: 'type (1, 2, 3)', mand: true }, { name: 'text', mand: true }],
        action: (msg, [type, text]) => '```\n' + ascii(text, ['1', '2', '3'].includes(type) ? type : '2') + '```'
      },
      math: {
        desc: `Solve a math equation | [Symbol Key](${links.mathKey})`,
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => {
          if (text === '0/0') return "Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn't make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends."
          let results
          try {
            results = evaluator(text.join(''))
          } catch (err) {
            throw Error('Invalid equation.')
          }
          return results
        }
      },
      rand: {
        desc: 'Pick a random integer between 2 numbers',
        args: [{ name: 'min', mand: true }, { name: 'max', mand: true }],
        action: (msg, [min, max]) => {
          if (!parseInt(min) || !parseInt(max)) throw Error('One of the arguments is not a number.')
          return Math.round(Math.random() * (parseInt(max) - parseInt(min)) + parseInt(min))
        }
      },
      replace: {
        desc: 'Find something in text and replace it with something else',
        args: [{ name: 'find', mand: true, delim: '|' }, { name: 'replace', mand: true, delim: '|' }, { name: 'text', mand: true }],
        action: (msg, [find, replace, text]) => text.replace(new RegExp(find, 'g'), replace)
      },
      scramble: {
        desc: 'Scramble the letters of text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => {
          const split = text.split('')
          const length = split.length
          for (let i = length - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * (i + 1))
            const tmp = split[i]
            split[i] = split[rand]
            split[rand] = tmp
          }
          return split.join('')
        }
      },
      indices: {
        desc: 'Return a list of all the indices of occurances a phrase has in the given text',
        args: [{ name: 'find', mand: true, delim: '|' }, { name: 'text', mand: true }],
        action: (msg, [find, text]) => indices(text, find).toString()
      },
      amount: {
        desc: 'Return the amount of occurances a phrase has in the text provided',
        args: [{ name: 'find', mand: true, delim: '|' }, { name: 'text', mand: true }],
        action: (msg, [find, text]) => indices(text, find).length
      },
      length: {
        desc: 'Return the length of the given text',
        args: [{ name: 'text', mand: true }],
        action: (msg, [text]) => text.length
      },
      differences: {
        desc: 'Find the differences between 2 given texts',
        args: [{ name: 'type (exact, word)', mand: true }, { name: 'original', mand: true, delim: '|' }, { name: 'changed', mand: true, delim: '|' }],
        action: (msg, [method, original, changed]) => {
          const exact = method.toLowerCase() === 'exact'
          let newText = changed.split(exact ? '' : ' ')
          let dif
          original.split(exact ? '' : ' ').forEach((element, index, array) => {
            if (element !== newText[index]) {
              newText[index] = dif ? newText[index] : '`' + newText[index]
              dif = true
              if (index === array.length - 1) newText[index] += '`'
            } else {
              newText[dif ? index - 1 : index] = dif ? newText[index - 1] + '`' : newText[index]
              dif = false
            }
          })
          return newText.join(exact ? '' : ' ')
        }
      },
      choose: {
        desc: 'Choose 1 item from a list of items provided',
        args: [{ name: 'item 1', mand: true }, { name: 'item 2', mand: true }, { name: 'more items' }],
        action: (msg, args) => {
          if (args.length > 2) args = args.slice(0, 2).concat(args[2].split(' '))
          return args[Math.round(Math.random() * args.length)]
        }
      },
      resources: {
        desc: 'List links to some useful websites',
        action: () => '**Resources:**\n' + resources.reduce((a, r) => a + `${r.name}: <${r.link}>\n`, '')
      },
      repeat: {
        desc: 'Repeat provided text (one message)',
        args: [{ name: 'times', mand: true }, { name: 'text', mand: true }],
        action: (msg, [times, text]) => text.repeat(times)
      },
      tempconvert: {
        desc: 'Convert from Fahrenheit to Celsius and vice versa',
        args: [{ name: 'unit', mand: true }, { name: 'temperature', mand: true }],
        action: (msg, [unit, temp]) => {
          let conversion
          let newUnit
          switch (unit.toLowerCase()) {
            case 'f':
              conversion = (value) => ((value - 32) * (5 / 9) * 100)
              newUnit = 'C'
              break
            case 'c':
              conversion = (value) => ((value * (9 / 5) + 32) * 100)
              newUnit = 'F'
              break
            default: throw Error('Invalid unit provided.')
          }
          return Math.round(conversion(parseInt(temp))) / 100 + '°' + newUnit
        }
      },
      noformat: {
        desc: 'Return the last message sent by the bot in a codeblock for easy copying',
        action: msg => '`' + msg.channel.lastMessage.content + '`'
      },
      dblwidget: {
        desc: 'View a customized widget of the bot (Discord Bot List)',
        action: () => {
          return {
            'embed': {
              'image': {
                'url': process.env.DBL_WIDGET
              }
            }
          }
        }
      },
      notes: {
        desc: 'View, edit, and manage personal notes',
        args: [{ name: 'action (view, set, delete) (Nothing to list all)' }, { name: 'name', delim: '|' }, { name: 'content' }],
        fetchDB: true,
        action: (msg, [action, name, content], { user }) => {
          const note = user.notes.find(n => n.name === name)
          switch (action) {
            case 'view':
              if (note) return `*${note.name}*\n${note.desc}`
              else throw Error('Note doesn\'t exist.')
            case 'set':
              if (content === undefined) throw Error('Invalid content supplied.')
              user.notes.push({
                name: name,
                desc: content,
                defMsg: msgLinkCompile(msg)
              })
              knex.update({
                table: process.env.TABLE,
                where: {
                  id: msg.author.id
                },
                data: {
                  notes: user.notes
                }
              })
              if (note) return 'Done! Edited note. (Previous Definition Command:' + note.defMsg + ')'
              else return 'Done! Created note.'
            case 'delete':
              if (note) {
                delete user.notes[user.notes.findIndex(n => n.name === name)]
                return knex.update({
                  table: process.env.TABLE,
                  where: {
                    id: msg.author.id
                  },
                  data: {
                    notes: user.notes
                  }
                }).then(() => 'Note deleted!\n**Definition Command**: ' + note.defMsg)
              } else throw Error('Note does not exist.')
            default: return user.notes.length ? user.notes.reduce((a, n) => a + (a ? '\n' : '') + n.name, '') : 'You have no notes.'
          }
        }
      },
      reminders: {
        desc: 'View, edit, and manage personal reminders which the bot will DM to you when the date is reached',
        args: [{ name: 'action (view, set, delete) (Nothing to list all)' }, { name: 'name', delim: '|' }, { name: 'content', delim: '|' }, { name: 'date' }],
        fetchDB: true,
        action: (msg, [action, name, content, date], { user }) => {
          const reminder = user.reminders.find(r => r.name === name)
          switch (action) {
            case 'view':
              if (reminder) return `*${reminder.name}*\n${reminder.desc}\n**${new Date(reminder.date).toString()}**`
              else throw Error('Reminder doesn\'t exist.')
            case 'set':
              if (content === undefined || (date instanceof Date ? isNaN(date.getTime()) : true)) throw Error('Invalid content or date supplied.')
              user.reminders.push({
                name: name,
                desc: content,
                date: date,
                defMsg: msgLinkCompile(msg)
              })
              knex.update({
                table: process.env.TABLE,
                where: {
                  id: msg.author.id
                },
                data: {
                  reminders: user.reminders
                }
              })
              if (reminder) return 'Done! Edited reminder. (Previous Definition Command:' + reminder.defMsg + ')'
              else return 'Done! Created reminder.'
            case 'delete':
              if (reminder) {
                delete user.reminders[user.reminders.findIndex(r => r.name === name)]
                return knex.update({
                  table: process.env.TABLE,
                  where: {
                    id: msg.author.id
                  },
                  data: {
                    reminders: user.reminders
                  }
                }).then(() => 'Reminder deleted!\n**Definition Command**: ' + reminder.defMsg)
              } else throw Error('Reminder does not exist.')
            default: return user.reminders.length ? user.reminders.reduce((a, r) => `${a}${(a ? '\n' : '')}${r.name} **${r.date}**`, '') : 'You have no reminders.'
          }
        }
      },
      eval: {
        private: true,
        desc: 'OWNER ONLY DEBUG COMMAND',
        args: [{ name: 'code', mand: true }],
        action: async function (msg, [code]) {
          let result
          try {
            result = await eval(code) // eslint-disable-line
          } catch (err) {
            result = err
          }
          return {
            'embed': {
              'color': (result instanceof Error ? 16711680 : 65280),
              'footer': {
                'text': 'Type: ' + (result instanceof Array ? 'array' : result instanceof Error ? 'error' : typeof result)
              },
              'author': {
                'name': 'JS Evaluation',
                'icon_url': msg.author.avatarURL
              },
              'fields': [
                {
                  'name': 'Input',
                  'value': '```JS\n' + code + '```'
                },
                {
                  'name': (result instanceof Error ? 'Error' : 'Output'),
                  'value': '```JS\n' + (result instanceof Error || result instanceof Promise ? result : require('util').inspect(result).replace(new RegExp(client.token, 'g'), 'REDACTED')) + '```'
                }
              ]
            }
          }
        }
      }
    }
  }
}
