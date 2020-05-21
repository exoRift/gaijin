const Eris = require('eris')
const { Agent } = require('cyclone')

const {
  TOKEN,
  DATABASE_URL,
  DBL_TOKEN,
  PREFIX
} = process.env

const agent = new Agent(Eris, TOKEN, require('./src/data'), {
  connectionURL: DATABASE_URL,
  client: 'pg',
  tables: [{
    name: 'users',
    columns: [
      {
        name: 'id',
        type: 'string',
        primary: true
      },
      {
        name: 'notes',
        type: 'text',
        default: '[]'
      },
      {
        name: 'reminders',
        type: 'text',
        default: '[]'
      }
    ]
  }],
  clearEmptyRows: true
}, {
  prefix: PREFIX,
  dblToken: DBL_TOKEN,
  checkFunction: async (agent) => {
    const users = await agent._knex.select('users')
    if (!users) return
    for (const user of users) {
      for (let i = 0; i < user.reminders; i++) {
        const reminder = user.reminders[i]
        if (Date.now() < new Date(reminder.date).getTime()) continue
        user.getDMChannel()
          .then((channel) => channel.createMessage(
            `__REMINDER__:\n**${reminder.name}**\n${reminder.desc}\n-*${new Date(reminder.date).toString()}*`
          ))
          .then(() => { user.reminders[i] = null })
          .catch((err) => console.error(`Could not dm user with id: ${user.id}: `, err))
      }
      const newReminders = user.reminders.filter((reminder) => reminder !== null)
      if (newReminders.length === user.reminders.length) continue
      agent._knex.update({
        table: 'users',
        where: {
          id: user.id
        },
        data: {
          reminders: newReminders
        }
      })
    }
  }
})

agent.connect()
