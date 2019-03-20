import test from 'ava'
import CommandHandler from '.'
import PDiscord from '../pdc.js'
import QueryBuilder from 'simple-knex'

const client = new PDiscord()
const knex = new QueryBuilder({
  connectionInfo: ,
  client: 'pg',
  pool: {
    min: 1,
    max: 1
  }
})

const mockCommandData = [
  ['command1', {
    name: 'command1'
  }],
  ['command2', {
    name: 'command2'
  }]
]
const mockCommands = new Map(mockCommandData)

const mockReplacerData = [
  ['replacer1', {
    name: 'replacer1'
  }],
  ['replacer2', {
    name: 'replacer2'
  }]
]
const mockReplacers = new Map(mockReplacerData)

const handler = new CommandHandler({
  agent: {},
  prefix: '!',
  client,
  ownerId: '456',
  knex,
  mockCommands,
  mockReplacers
})

test('prefixDetermination', (t) => {

})

test('commandDescrimination', (t) => {

})
