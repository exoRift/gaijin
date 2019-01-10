const Gaijin = require('./src/gaijin')
require('dotenv').load()
const {
  TOKEN,
  DATABASE_URL,
  TABLE,
  DBL_TOKEN,
  CONNECT_LIMIT,
  PREFIX
} = process.env

const goodBoy = new Gaijin(TOKEN, {
  connectionURL: {
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    database: 'scrimsbot'
  }, // DATABASE_URL + '?ssl=true',
  tableName: TABLE
}, {
  prefix: PREFIX,
  connectRetryLimit: CONNECT_LIMIT,
  dblToken: DBL_TOKEN
})

goodBoy.connect()
