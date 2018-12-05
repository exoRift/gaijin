class CommandHandler {
  constructor (client, adminID, knex) {
    this._client = client
    this._admin = adminID
    this._waits = {}
    this._knex = knex
  }

  async handle (msg, prefix) {
    // NOT THE PREFIX
    if (msg.content.substring(0, prefix.length) !== prefix) return

    // MESSAGE MANIPULATION
    // MENTION PREFIX
    msg.content = msg.content.replace(new RegExp(`^<@!?${this._client.user.id}> ?`), prefix)
    // KEYS
    msg.content = this._replaceKeys(msg, prefix)
    // FIND COMMAND OR AWAITED COMMAND
    let awaited = this._waits[msg.channel.id + msg.author.id]
    // IS THE AWAIT VALID?
    if (awaited) {
      if ((Date.now() - awaited.date > awaited.time || !awaited.check(msg)) && !awaited.used) {
        awaited = undefined
        delete this._waits[msg.channel.id + msg.author.id]
      }
    }
    const command = awaited || this._commands[msg.content.substring(prefix.length).split(' ')[0].toLowerCase()]
    // NO COMMAND FOUND
    if (!command) return
    // PRIVATE COMMAND
    if (command.private && msg.author.id !== this._admin) throw Error('This command is either temporarily disabled, or private.')
    // SPLIT ARGS
    const args = this._generateArgs(command, msg.content)
    // INVALID ARGS
    if (command.args && !args) throw Error('Invalid arguments. Reference the help menu.')
    // CREATE DB INDEX IF IT DOESN'T EXIST
    this._knex.insert({
      table: 'users',
      data: {
        id: msg.author.id
      }
    }).catch(ignore => ignore)
    // FETCH DB IF REQUIRED
    const user = !command.fetchDB || await this._knex.get({
      table: 'users',
      where: {
        id: msg.author.id
      }
    })
    // RUN COMMAND
    const result = await command.action.call(this, msg, !args || args.slice(1), {
      user,
      rsp: awaited ? msg.channel.messages.find(awaited.rspCheck) : undefined
    })
    if (typeof result === 'string' || result === undefined) return result
    const { content, embed, wait, file } = result
    // RESULT WAITS FOR A RESPONSE
    if (wait && !awaited) this._writeAwait(msg, wait)
    if (wait && !wait.refresh) this._waits[msg.channel.id + msg.author.id].used = true
    return content || embed || file ? { content, embed, file } : undefined
  }
  async registerCommands (commandFunction) {
    const commandObject = await commandFunction(this._client, this._knex)
    this._keys = commandObject.keys
    this._commands = commandObject.commands
    return this._commands
  }

  // PRIVATE FUNCS
  _replaceKeys (msg, prefix) {
    return msg.content.replace(/\${(.+?)}/g, (content, capture) => {
      const split = capture.split(' ')
      const key = this._keys.find(e => e.start && split.length > 1 ? e.key.startsWith(split[0]) : e.key === capture)
      return key ? key.action(msg, capture, prefix) : 'Invalid Key'
    })
  }
  _generateArgs (command, content) {
    return new RegExp(command.args
      ? command.args.reduce((a, e) => {
        const last = e.name === command.args[command.args.length - 1].name
        return a + `(.+${last ? '' : '?'})${e.mand ? '' : '?'}` +
          (last ? '' : '\\' + (e.delim || 's') + (e.mand ? '' : '?'))
      }, '')
      : ' ').exec(content.split(' ').slice(1).join(' '))
  }
  async _writeWait (msg, data) {
    data.date = Date.now()
    this._waits[msg.channel.id + msg.author.id] = data
    return data
  }
}

module.exports = CommandHandler
