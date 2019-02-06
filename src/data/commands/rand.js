const Command = require('../../modules/command')

const data = {
  name: 'rand',
  desc: 'Pick a random integer between 2 numbers',
  options: {
    args: [{ name: 'min', mand: true }, { name: 'max', mand: true }]
  },
  action: ({ args: [min, max] }) => {
    if (!parseInt(min) || !parseInt(max)) throw Error('One of the arguments is not a number.')
    return Math.round(Math.random() * (parseInt(max) - parseInt(min)) + parseInt(min))
  }
}

module.exports = new Command(data)
