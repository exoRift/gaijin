const Gaijin = require('./src/gaijin')

const {
  TOKEN,
  DATABASE_URL,
  TABLE,
  DBL_TOKEN,
  CONNECT_LIMIT,
  PREFIX
} = process.env

const goodBoy = new Gaijin(TOKEN, {
  connectionURL: DATABASE_URL + '?ssl=true',
  tableName: TABLE
}, {
  prefix: PREFIX,
  connectRetryLimit: CONNECT_LIMIT,
  dblToken: DBL_TOKEN
})

goodBoy.connect()
