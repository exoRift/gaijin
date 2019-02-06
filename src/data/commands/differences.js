const Command = require('../../modules/command')

const data = {
  name: 'differences',
  desc: 'Find the differences between 2 given texts',
  options: {
    args: [{ name: 'type (exact, word)', mand: true }, { name: 'original', mand: true, delim: '|' }, { name: 'changed', mand: true, delim: '|' }]
  },
  action: ({ args: [type, original, changed] }) => {
    const exact = type.toLowerCase() === 'exact'
    const newText = changed.split(exact ? '' : ' ')
    let dif
    const split = original.split(exact ? '' : ' ')
    for (let i = 0; i < split.length; i++) {
      if (split[i] !== newText[i]) {
        newText[i] = dif ? newText[i] : '`' + newText[i]
        dif = true
      } else {
        newText[dif ? i - 1 : i] = dif ? newText[i - 1] + '`' : newText[i]
        dif = false
      }
    }
    return newText.join(exact ? '' : ' ') + '`'
  }
}

module.exports = new Command(data)
