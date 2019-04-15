const Agent = require('./src/agent')

const {
  TOKEN,
  DATABASE_URL,
  DBL_TOKEN,
  PREFIX
} = process.env

const {
  dblWidget
} = require('./src/data/utils.js').links

const agent = new Agent(TOKEN, {
  connectionURL: DATABASE_URL,
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
  }]
}, {
  prefix: PREFIX,
  dblToken: DBL_TOKEN,
  dblWidget
})

agent.connect()
