const Command = require('../../modules/command')
const { ping } = require('../links.json')

const data = {
  name: 'shards',
  desc: 'View all shard latencies',
  action: ({ msg, client }) => {
    const shards = client.shards.map(s => s)
    const latencies = shards.map(s => s.latency)
    const average = latencies.reduce((a, e) => a + e, 0) / latencies.length
    const fields = []
    for (const item of shards) {
      fields.push({
        name: `${!msg.channel.type ? (!item.id ? '*' : '') : (item.id === msg.channel.guild.shard.id ? '*' : '')}Shard ${item.id}`,
        value: `${item.ready ? '<a:Online:469626088579006464>' : '<a:DND:469626088612429824>'} ${(item.ready ? item.latency : 'OFFLINE')}ms`,
        inline: true
      })
    }
    return {
      embed: {
        color: average > 200 && average < 300 ? 16776960 : average > 300 ? 15933733 : 111111,
        author: {
          name: 'Pings (API)',
          icon_url: ping
        },
        footer: {
          text: `Average ping is ${average}ms | Total Guilds: ${client.guilds.size}`
        },
        fields: fields
      }
    }
  }
}

module.exports = new Command(data)
