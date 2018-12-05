// DEFINITIONS
const Eris = require('./data/customModules/ErisMods.js')
const client = new Eris(process.env.TOKEN)
const QueryBuilder = require('simple-knex')
const knex = new QueryBuilder({
  connectionInfo: process.env.DATABASE_URL + '?ssl=true',
  client: 'pg',
  pool: {
    min: 1,
    max: 1
  }
})
const CommandHandler = require('./data/customModules/commandHandler.js')
const commandClient = new CommandHandler(client, process.env.ADMIN, knex)
const dbl = new (require('dblapi.js'))(process.env.DBLTOKEN, client)

function showError (err, msg, response) {
  console.log(err) // DEBUG
  if (response && typeof response === 'string' && err.code === 50035) {
    msg.channel.createMessage({
      content: 'Text was too long, sent as a file instead.',
      file: {
        name: 'Gaijin Result',
        file: Buffer.from(response)
      }
    })
  } else msg.channel.createMessage('ERR:```\n' + err.message + '```').catch(() => msg.channel.createMessage('`ERROR, SEND TO A BOT ADMIN: `' + Date.now()))
}
function connect (count) {
  if (count >= process.env.CONNECT_LIMIT) return console.error('RECONNECTION LIMIT REACHED; RECONNECTION CANCELED')
  return client.connect().catch(() => connect(count))
}

// SETUPS
(async function () {
  await knex.createTable({
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
  }).catch(ignore => ignore)
  commandClient.registerCommands(require('./data/commands.js'))

  // DB CLEAN
  knex.delete({
    table: 'users',
    where: {
      notes: '[]',
      reminders: '[]'
    }
  }).then(console.log('Database cleaned'))
})()

// SHARD READY
client.on('shardReady', shard => {
  console.log(`Connected as ${client.user.username} on shard ${shard}`)
  client.shards.get(shard).editStatus({
    name: `Prefix: '${process.env.PREFIX}'`,
    type: 2
  })
  dbl.postStats(client.guilds.size, shard, client.shards.size)
})

// MESSAGE RECIEVED
client.on('messageCreate', msg => {
  // PREVENTING BOT LOOPING
  if (msg.author.bot) return
  // HANDLE
  commandClient.handle(msg, process.env.PREFIX, knex).then(res => {
    if (!res) return
    const { content, embed, file } = (typeof res === 'string' ? { content: res } : res)
    msg.channel.createMessage({ content, embed }, file).catch(err => showError(err, msg, res))
  }).catch(err => showError(err, msg))
})

// SHARD DISCONNECT
client.on('shardDisconnect', shard => {
  console.log(`Shard ${shard} lost connection`)
  connect()
})

// REMINDERS CHECK
setInterval(() => {
  knex.select('users').then(users => {
    if (!users) return
    (async function (users) {
      users.forEach((user, row) => {
        user.reminders.forEach((reminder, index) => {
          if (Date.now() >= new Date(reminder.date).getTime()) {
            client.users.get(user.id).getDMChannel().then(channel => channel.createMessage(`__REMINDER__:\n**${reminder.name}**\n${reminder.desc}\n-*${new Date(reminder.date).toString()}*`)).then(() => {
              delete user.reminders[index]
              knex.update({
                table: 'users',
                where: {
                  id: user.id
                },
                data: {
                  reminders: user.reminders
                }
              })
            })
          }
        })
      })
    })(users)
  })
}, 300000)

connect()
