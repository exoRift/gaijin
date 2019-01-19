const Replacer = require('../../modules/replacer')

const data = {
  key: 'IN',
  desc: 'The current date plus the number of hours inputted',
  start: true,
  action: ({ msg, key }) => {
    const num = key.split(' ')[1]
    if (isNaN(Number(num))) return 'Input is not a number'
    const d = new Date(Date.now() + (Number(num) * 3600000)).toString()
    // SWITCHING TO EDT
    const date = new Date(d.substring(0, d.indexOf('GMT') + 4) + '0 (UTC)').toJSON()
    return date.substring(0, date.length - 8)
  }
}

module.exports = new Replacer(data)
