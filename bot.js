const Agent = require('./src/agent')

const {
  TOKEN,
  DATABASE_URL,
  DBL_TOKEN,
  PREFIX
} = process.env

const agent = new Agent(TOKEN, {
  connectionURL: DATABASE_URL
}, {
  prefix: PREFIX,
  dblToken: DBL_TOKEN
})

agent.connect()
