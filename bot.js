const Agent = require('./src/agent')
const {
  TOKEN,
  DATABASE_URL,
  TABLE,
  DBL_TOKEN,
  CONNECT_LIMIT,
  PREFIX
} = process.env

const agent = new Agent(TOKEN, {
  connectionURL: DATABASE_URL + '?ssl=true',
  tableName: TABLE
}, {
  prefix: PREFIX,
  connectRetryLimit: CONNECT_LIMIT,
  dblToken: DBL_TOKEN
})

agent.connect()
