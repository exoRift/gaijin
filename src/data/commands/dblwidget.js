const Command = require('../../modules/command')
const { dblWidget } = require('../utils.js').links

const data = {
  name: 'dblwidget',
  desc: 'View a customized widget of the bot (Discord Bot List)',
  action: () => ({
    'embed': {
      'image': {
        'url': dblWidget
      }
    }
  })
}

module.exports = new Command(data)
