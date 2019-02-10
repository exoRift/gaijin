const Command = require('../../modules/command')
const { pingIcon } = require('../utils.js').links

const data = {
  name: 'shards',
  desc: 'View all shard latencies',
  action: ({ msg, client }) => {
    let averageLatency = 0
    const fields = []
    for (const shard of client.shards.values()) {
      averageLatency += shard.latency
      fields.push({
        name: `${!msg.channel.type ? (!shard.id ? '*' : '') : (shard.id === msg.channel.guild.shard.id ? '*' : '')}Shard ${shard.id}`,
        value: `${shard.ready ? '<a:Online:469626088579006464>' : '<a:DND:469626088612429824>'} ${(shard.ready ? shard.latency : 'OFFLINE')}ms`,
        inline: true
      })
    }
    averageLatency = averageLatency / client.shards.size
    return {
      embed: {
        color: averageLatency > 200 && averageLatency < 300 ? 16776960 : averageLatency > 300 ? 15933733 : 111111,
        author: {
          name: 'Pings (API)',
          icon_url: pingIcon
        },
        footer: {
          text: `Average ping is ${averageLatency}ms | Total Guilds: ${client.guilds.size}`
        },
        fields: fields
      }
    }
  }
}

module.exports = new Command(data)
