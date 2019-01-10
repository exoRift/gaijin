const args = [{ name: 'type (all, none, sentence, word, rand)', mand: true, delim: '|' }, { name: 'text', mand: true }]
const input = ['all|yellooooo', 'sdf']

const start = Date.now()

const chars = input.join(' ').split('')
const cleaned = []
for (let i = 0; i < args.length; i++) {
  const delim = args[i].delim || ' '
  if (!cleaned[i]) cleaned[i] = ''
  for (let j = cleaned.join(' ').length; j < chars.length; j++) {
    const ch = chars[j]
    if (i === args.length - 1) {
      cleaned[i] += ch
    } else {
      if (ch === delim) {
        break
      } else {
        cleaned[i] += ch
      }
    }
  }
  if (!cleaned[i]) cleaned.pop()
}

console.log('cleaned', cleaned)
console.log(Date.now() - start)
