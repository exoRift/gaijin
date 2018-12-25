const { readdir } = require('fs').promises
const { join } = require('path')

async function requireCommands () {
  const commands = {}
  const files = await readdir(__dirname)
  for (let i = 0; i < files.length; i++) {
    const command = require(join(__dirname, files[i]))
    commands[command.name] = command
  }
  return commands
}

module.exports = requireCommands()
