const Command = require('../../modules/command')
const { indices } = require('../utils')

const data = {
  name: 'amount',
  desc: 'Return the amount of occurances a phrase has in the text provided',
  options: {
    args: [{ name: 'find', mand: true, delim: '|' }, { name: 'text', mand: true }]
  },
  action: ({ args: [find, text] }) => indices(text, find).length
}

module.exports = new Command(data)
