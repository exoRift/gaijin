const Command = require('../../modules/command')
const { indices } = require('../utils')

const data = {
  name: 'indices',
  desc: 'Return a list of all the indices of occurances a phrase has in the given text',
  options: {
    args: [{ name: 'find', mand: true, delim: '|' }, { name: 'text', mand: true }]
  },
  action: ({ args: [find, text] }) => indices(text, find).toString()
}

module.exports = new Command(data)
