const Command = require('../../modules/command')

const data = {
  name: 'dblwidget',
  desc: 'View a customized widget of the bot (Discord Bot List)',
  action: ({ agent: { dblWidget } }) => ({
    'embed': {
      'image': {
        'url': dblWidget
      }
    }
  })
}

module.exports = new Command(data)
