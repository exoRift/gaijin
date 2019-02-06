const fs = require('fs')
const templates = fs.readdirSync('./content/templates', 'utf8')
const commandNames = fs.readdirSync('../data/commands', 'utf8')
const commands = []
for (const command of commandNames) commands.push(require(`../data/commands/${command}.js`))
for (const template of templates) {
  if (template === 'DBLHTML') { // OTHER TEMPLATES NOT COMPLETE YET
    const settings = require(`./templates/${template}/settings.json`)
    const base = fs.readFileSync(`./content/templates/${template}/base.${settings.type}`, 'utf8')
    const replace = commands.reduce((a, e) => a + (a ? '\n' : '') +
      e.restricted
      ? ''
      : settings.template
        .replace('NAME', e.name)
        .replace('DESC', e.desc)
    , '')
    const result = base.replace('|REPLACEME|', replace)
    fs.writeFileSync(`./content/${template}.${settings.type}`, result)
  }
}
