const Replacer = require('../../modules/replacer')

const data = {
  key: 'DATE',
  desc: 'Current date',
  action: () => {
    const d = Date()
    // SWITCHING TO EDT
    const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
    return date.substring(0, date.length - 8)
  }
}

module.exports = new Replacer(data)
