const QueryBuilder = require('simple-knex')
const DBLAPI = require('dblapi.js')

const {
  CustomEris,
  CommandHandler
} = require('../modules')

const {
  requireCommands
} = require('../data')

/**
 * Class representing a bot Agent.
 */
class Agent {
  /**
   * Create an Agent.
   * @param {String}          token           The token to log in to the Discord API with.
   * @param {DatabaseOptions} databaseOptions The info for the database.
   * @param {AgentOptions}    [agentOptions]  Options for the agent.
   */
  constructor (token, databaseOptions, agentOptions = {}) {
    const {
      connectionURL,
      tables
    } = databaseOptions
    const {
      connectRetryLimit = 5,
      prefix = '!',
      dblToken,
      remindersCheckInterval = 300000
    } = agentOptions
    /**
     * The eris Client.
     * @type {CustomEris.Client}
     */
    this._client = new CustomEris.Client(token)
    /**
     * The simple-knex QueryBuilder.
     * @type {QueryBuilder}
     */
    this._knex = new QueryBuilder({
      connectionInfo: connectionURL,
      client: 'pg',
      pool: {
        min: 1,
        max: 1
      }
    })
    /**
     * The dblapi.js DBLAPI (DiscordBotsList).
     * @type {DBLAPI}
     */
    this._dblAPI = dblToken ? new DBLAPI(dblToken, this._client) : null
    /**
     * The maximum number of times to retry connecting to the Discord API.
     * @type {Number}
     */
    this._connectRetryLimit = connectRetryLimit
    /**
     * The command prefix.
     * @type {String}
     */
    this._prefix = prefix

    // setup
    this._prepareDB(tables)
    this._bindEvents()
    this._setRemindersCheck(remindersCheckInterval)
  }
  /**
   * Connect to the Discord API. Will recursively retry this._connectRetryLimit number of times.
   * @param {Number} count The current number of connection attempts.
   */
  connect (count = 0) {
    if (count >= this._connectRetryLimit) return console.error('RECONNECTION LIMIT REACHED; RECONNECTION CANCELED')
    return this._client.connect().catch(() => this.connect(count + 1))
  }
  _prepareDB (tables) {
    tables.push({
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
    })
    Promise.all(tables.map(this._knex.createTable))
      .catch(ignored => ignored)
      .finally(() => this._knex.delete({
        table: 'users',
        where: {
          notes: '[]',
          reminders: '[]'
        }
      }))
      .then(() => console.log('Database set up!'))
  }
  _bindEvents () {
    this._client.on('ready', this._onReady.bind(this, this._client))
    this._client.on('messageCreate', this._onCreateMessage.bind(this, this._client))
    this._client.on('shardDisconnect', this._onShardReady.bind(this, this._client))
    this._client.on('shardDisconnect', this._onShardDisconnect.bind(this, this._client))
  }
  _setRemindersCheck (remindersCheckInterval) {
    setInterval(async () => {
      const users = await this._knex.select(this._knex.__tableName)
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
            .catch((err) => console.error(`could not dm user with id: ${user.id}: `, err))
        }
        const newReminders = user.reminders.filter((reminder) => reminder !== null)
        if (newReminders.length === user.reminders.length) continue
        this._knex.update({
          table: this._knex.__tableName,
          where: {
            id: user.id
          },
          data: {
            reminders: newReminders
          }
        })
      }
    }, remindersCheckInterval)
  }
  /**
   * Send an error message.
   * @private
   * @param  {Error}   err   The error
   * @param  {Message} msg   The original message from Discord.
   * @param  {*}       [res] The response from a command.
   */
  _showError (err, msg, res) {
    if (res && typeof response === 'string' && err.code === 50035) {
      msg.channel.createMessage({
        content: 'Text was too long, sent as a file instead.',
        file: {
          name: 'Gaijin Result',
          file: Buffer.from(res)
        }
      })
    } else {
      console.error(err)
      msg.channel.createMessage('ERR:```\n' + err.message + '```')
        .catch(() => msg.channel.createMessage('`ERROR, SEND TO A BOT ADMIN: `' + Date.now()))
        .catch((err) => console.error('error in error handler: ', err))
    }
  }
  _onCreateMessage (client, msg) {
    if (msg.author.bot) return

    this._commandHandler.handle(msg)
      .catch(err => this._showError(err, msg))
  }
  async _onReady (client) {
    this._commandHandler = new CommandHandler({
      prefix: this._prefix,
      client,
      ownerId: (await client.getOAuthApplication()).owner.id,
      knex: this._knex,
      replacers: new Map([
        ['LAST', {
          key: 'LAST',
          desc: 'Last message sent in channel by bot',
          action: ({ msg }) => {
            const lastMessage = msg.channel.lastMessage
            return lastMessage && lastMessage.content ? lastMessage.content : 'No previous message'
          }
        }], ['DATE', {
          key: 'DATE',
          desc: 'Current date',
          action: () => {
            const d = Date()
            // SWITCHING TO EDT
            const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
            return date.substring(0, date.length - 8)
          }
        }], ['IN', {
          key: 'IN',
          desc: 'The current date plus the number of hours inputted',
          start: true,
          action: ({ msg, key }) => {
            const num = key.split(' ')[1]
            if (isNaN(Number(num))) return 'Input is not a number'
            const d = new Date(Date.now() + (Number(num) * 3600000)).toString()
            // SWITCHING TO EDT
            const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
            return date.substring(0, date.length - 8)
          }
        }]
      ]),
      commands: (await requireCommands())
    })
  }
  _onShardReady (client, shard) {
    console.log(`Connected as ${client.user.username} on shard ${shard}`)
    client.shards.get(shard).editStatus({
      name: `Prefix: '${process.env.PREFIX}'`,
      type: 2
    })
    this._dblAPI.postStats(client.guilds.size, shard, client.shards.size)
  }
  _onShardDisconnect (shard) {
    console.log(`Shard ${shard} lost connection`)
    this.connect()
  }
}

module.exports = Agent
/**
 * @typedef  {Object}  DatabaseColumn
 * @property {String}  name            The name of the database column.
 * @property {String}  type            The data type of the database column.
 * @property {Boolean} [primary=false] Whether or not this column is the primary key of the table.
 * @property {*}       [default]       The default value of this column, should match this column's type.
 */
/**
 * @typedef  {Object}   DatabaseTable
 * @property {String}   name    The name of the table.
 * @property {Column[]} columns The columns of the table to store data in.
 */
/**
 * @typedef  {Object}  DatabaseOptions
 * @property {String}  connectionURL The database url.
 * @property {Table[]} tables        The tables to create in the database.
 */
/**
 * @typedef  {Object} AgentOptions
 * @property {Number} [connectRetryLimit=10]           The maximum number of times to retry connecting to the Discord API.
 * @property {String} [prefix='!']                     The command prefix.
 * @property {String} [dblToken]                       The token used with the DiscordBotsList API.
 * @property {Number} [remindersCheckInterval=3000000] The amoount of time to wait between checking on reminders.
 */