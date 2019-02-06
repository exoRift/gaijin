const Command = require('../../modules/command')

const data = {
  name: 'choose',
  desc: 'Choose 1 item from a list of items provided',
  options: {
    args: [{ name: 'item 1', mand: true }, { name: 'item 2', mand: true }, { name: 'more items' }]
  },
  action: ({ args }) => {
    if (args.length > 2) args = args.slice(0, 2).concat(args[2].split(' '))
    return args[Math.round(Math.random() * args.length)]
  }
}

module.exports = new Command(data)
