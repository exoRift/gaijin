const Command = require('../../modules/command')
const { pingIcon } = require('../utils.js').links

const data = {
  name: 'ping',
  desc: 'Check if the bot is online, display the bot\'s ping in ms, and view the amount of servers the bot\'s in',
  action: ({ client, msg }) => {
    const shard = msg.channel.type ? client.shards.get(0) : msg.channel.guild.shard
    const clientLatency = Date.now() - msg.timestamp
    return {
      embed: {
        title: 'Bot Status',
        description: `Pong! Client: **${clientLatency}ms** API: **${shard.latency}ms** | Servers: **${client.guilds.filter((g) => g.shard.id === shard.id).length}**`,
        color: clientLatency > 200 && clientLatency < 300 ? 16776960 : clientLatency > 300 ? 15933733 : 111111,
        author: {
          name: 'Ping',
          icon_url: pingIcon
        }
      }
    }
  }
}

module.exports = new Command(data)
