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
 * Class representing Gaijin.
 */
class Gaijin {
  /**
   * Create a Gaijin
   * @param {String} token                                    The token to log in to the Discord API with.
   * @param {Object} databaseInfo                             The info for the PostgreSQL database.
   * @param {String} databaseInfo.connectionURL               The PostgreSQL database url.
   * @param {String} databaseInfo.tableName                   The name of the table we store user data in the PostgreSQL database.
   * @param {Object} [options={}]                             Options object.
   * @param {Number} [options.connectRetryLimit=5]            The maximum number of times to retry connecting to the Discord API.
   * @param {String} [options.prefix='!!!']                   The command prefix.
   * @param {String} [options.dblToken]                       The token used with the DiscordBotsList API.
   * @param {Number} [options.remindersCheckInterval=3000000] The amoount of time to wait between checking on reminders.
   */
  constructor (token, databaseInfo, options = {}) {
    const {
      connectionURL,
      tableName
    } = databaseInfo
    const {
      connectRetryLimit = 5,
      prefix = '!!!',
      dblToken,
      remindersCheckInterval = 300000
    } = options
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
    this._knex.__tableName = tableName
    /**
     * The dblapi.js DBLAPI.
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
    this._prepareDB(this._knex.__tableName)
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
  _prepareDB (tableName) {
    this._knex.createTable({
      name: tableName,
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
    }).catch((ignored) => true)
      .finally(() => this._knex.delete({
        table: tableName,
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
      .then(res => {
        if (!res) return
        const {
          content, embed, file
        } = (typeof res === 'string' ? { content: res } : res)

        msg.channel.createMessage({ content, embed }, file)
          .catch(err => this._showError(err, msg, res))
      })
      .catch(err => this._showError(err, msg))
  }
  async _onReady (client) {
    this._commandHandler = new CommandHandler(
      this._prefix,
      client,
      (await client.getOAuthApplication()).owner.id,
      this._knex,
      (await requireCommands())
    )
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

module.exports = Gaijin
