import test from 'ava'

import {
  Command
} from '..'

const commandMock = {
  name: 'test-command-name',
  desc: 'test-command-desc',
  action: () => { }
}

test.before((t) => {
  t.context.Command = new Command(commandMock)
})
// FIXME: command should have args and stuff to see if that works properly.
test('Command info', (t) => {
  const expected = '**test-command-name ** - *test-command-desc*'
  t.is(t.context.Command.info, expected)
})
