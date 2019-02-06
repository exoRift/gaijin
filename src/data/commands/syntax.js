const Command = require('../../modules/command')

const data = {
  name: 'syntax',
  desc: 'View the valid syntax for date paramaters',
  action: () => 'YYYY-MM-DDTHH:MM\nExample: *2018-06-20T07:56*\n**Note**: *This uses 24-hour format*'
}

module.exports = new Command(data)
