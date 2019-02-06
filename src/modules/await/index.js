const Command = require('../command')

class Await extends Command {
  constructor (data) {
    super(data)
    const {
      options = {}
    } = data
    const {
      timeout = 15000,
      check = () => true
    } = options
    this.timeout = timeout
    this.check = check
  }
}

module.exports = Await
