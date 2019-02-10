const evaluator = require('expr-eval').Parser.evaluate

const Command = require('../../modules/command')
const { mathKey } = require('../utils.js').links

const data = {
  name: 'math',
  desc: `Solve a math equation | [Symbol Key](${mathKey})`,
  options: {
    args: [{ name: 'text', mand: true }]
  },
  action: ({ args: [text] }) => {
    if (text === '0/0') return "Imagine that you have zero cookies and you split them evenly among zero friends. How many cookies does each person get? See? It doesn't make sense. And Cookie Monster is sad that there are no cookies, and you are sad that you have no friends."
    let results
    try {
      results = evaluator(text.join(''))
    } catch (err) {
      throw Error('Invalid equation.')
    }
    return results
  }
}

module.exports = new Command(data)
