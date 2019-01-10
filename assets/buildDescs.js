const fs = require('fs')
const templates = fs.readdirSync('./content/templates', 'utf8')
for (const template of templates) {
  if (template === 'DBLHTML') { // OTHER TEMPLATES NOT COMPLETE YET
    const settings = require(`./templates/${template}/settings.json`)
    const base = fs.readFileSync(`./content/templates/${template}/base.${settings.type}`, 'utf8')
    const commands = (require('../data/commands.js'))().commands
    let replace = ''
    for (const command in commands) replace += commands[command].private ? '' : settings.template.replace('NAME', command).replace('DESC', commands[command].description)
    const result = base.replace('|REPLACEME|', replace)
    fs.writeFileSync(`./content/${template}.${settings.type}`, result)
  }
}
