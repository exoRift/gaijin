const { readdir } = require('fs').promises
const { join } = require('path')

const reference = {
  base: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  vowels: 'aeiou'.split(''),
  corrupt: '҉̢̛̕͜͏̵̡͘͟͝͡'.split(''),
  verticalFlip: 'ɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇnʌʍxʎz0123456789ɐqɔpǝɟƃɥıɾʞןɯuodbɹsʇn𐌡ʍxʎz'.split(''),
  horizontalFlip: 'AdↄbɘꟻgHijklmᴎoqpᴙꙅTUvwxYz0123456789AdↃbƎꟻGHIJK⅃MᴎOꟼpᴙꙄTUVWXYZ'.split(''),
  leetRef: 'olizehasgtjbp'.split(''),
  leet: '0112344567789'.split(''),
  morse: '.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. ----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.'.split(' '),
  circle: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ0①②③④⑤⑥⑦⑧⑨ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'.split(''),
  aesthetic: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'.split(''),
  double: '𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫 𝟘 𝟙 𝟚 𝟛 𝟜 𝟝 𝟞 𝟟 𝟠 𝟡 𝔸 𝔹 ℂ 𝔻 𝔼 𝔽 𝔾 ℍ 𝕀 𝕁 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℚ ℝ 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏 𝕐 ℤ'.split(' ')
}

const resources = [
  {
    name: 'RGB Color Picker',
    link: 'https://www.rapidtables.com/web/color/RGB_Color.html'
  },
  {
    name: 'Hexadecimal Color Picker',
    link: 'https://www.w3schools.com/colors/colors_mixer.asp'
  },
  {
    name: 'Integer Color Picker',
    link: 'https://www.shodor.org/stella2java/rgbint.html'
  },
  {
    name: 'Text Fonts (Images)',
    link: 'http://www.flamingtext.com/Free-Logo-Designs'
  },
  {
    name: 'Discord Embed Creator',
    link: 'https://leovoel.github.io/embed-visualizer'
  },
  {
    name: 'JS/HTML Code Beautifier',
    link: 'http://jsbeautifier.org'
  },
  {
    name: 'Regex Tester',
    link: 'https://regex101.com'
  }
]

function indices (string, search) {
  const arr = []
  for (let i = string.indexOf(search); i >= 0; i = string.indexOf(search, i + 1)) arr.push(i)
  return arr
}

function replace (content, find, replace, { splitter = '', delim = '' } = {}) {
  const replacer = reference[replace]
  if (!Array.isArray(find)) find = [find]
  return find.reduce((cont, find) => {
    const finder = reference[find]
    return cont.split(splitter).reduce((cont, char) => cont + (!cont ? '' : delim) + (replacer[finder.indexOf(char)] || char), '')
  }, content)
}

function msgLinkCompile (msg) {
  return `https://discordapp.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`
}
// to use in index.js files
async function readAndRequireDir (path) {
  const content = []
  const files = await readdir(path)
  for (let i = 0; i < files.length; i++) {
    if (files[i].endsWith('index.js')) continue
    content.push(require(join(path, files[i])))
  }
  return content
}

module.exports = {
  reference,
  resources,
  indices,
  replace,
  msgLinkCompile,
  readAndRequireDir
}
