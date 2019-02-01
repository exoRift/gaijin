const Command = require('../../modules/command')
const { msgLinkCompile } = require('../utils')

const data = {
  name: 'notes',
  desc: 'View, edit, and manage personal notes',
  options: {
    dbTable: 'users',
    args: [{ name: 'action (view, set, delete) (Nothing to list all)' }, { name: 'name', delim: '|' }, { name: 'content' }]
  },
  action: ({ msg, knex, args: [action, name, content], users: [user] }) => {
    const note = user.notes.find((n) => n.name === name)
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
          table: 'users',
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
          delete user.notes[user.notes.findIndex((n) => n.name === name)]
          return knex.update({
            table: 'users',
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
}

module.exports = new Command(data)
