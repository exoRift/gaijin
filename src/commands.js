const evaluator = require('expr-eval').Parser.evaluate
const ascii = require('ascii-text-generator')
const links = require('./links.json')

// COMMANDS
module.exports = (client, knex) => {
  return {
    commands: {
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
