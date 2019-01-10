const { readdir } = require('fs').promises
const { join } = require('path')

async function requireCommands () {
  const commands = []
  const files = await readdir(__dirname)
  for (let i = 0; i < files.length; i++) {
    if (__filename.endsWith(files[i])) continue
    commands.push(require(join(__dirname, files[i])))
  }
  return commands
}

module.exports = requireCommands
