const Command = require('../../modules/command')
const { msgLinkCompile } = require('../utils')

const data = {
  name: 'reminders',
  desc: 'View, edit, and manage personal reminders which the bot will DM to you when the date is reached',
  options: {
    dbTable: 'users',
    args: [{ name: 'action (view, set, delete) (Nothing to list all)' }, { name: 'name', delim: '|' }, { name: 'content', delim: '|' }, { name: 'date' }]
  },
  action: ({ msg, knex, args: [action, name, content, date], users: [user] }) => {
    const reminder = user.reminders.find((r) => r.name === name)
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
          delete user.reminders[user.reminders.findIndex((r) => r.name === name)]
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
}

module.exports = new Command(data)
