const Command = require('../../modules/command')

const data = {
  name: 'tempconvert',
  desc: 'Convert from Fahrenheit to Celsius and vice versa',
  options: {
    args: [{ name: 'unit', mand: true }, { name: 'temperature', mand: true }]
  },
  action: ({ args: [unit, temp] }) => {
    let conversion
    let newUnit
    switch (unit.toLowerCase()) {
      case 'f':
        conversion = (value) => ((value - 32) * (5 / 9) * 100)
        newUnit = 'C'
        break
      case 'c':
        conversion = (value) => ((value * (9 / 5) + 32) * 100)
        newUnit = 'F'
        break
      default: throw Error('Invalid unit provided.')
    }
    return Math.round(conversion(parseInt(temp))) / 100 + '°' + newUnit
  }
}

module.exports = new Command(data)
