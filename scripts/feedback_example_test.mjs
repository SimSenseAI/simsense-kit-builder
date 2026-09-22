import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = JSON.parse(readFileSync(new URL('../plugins/simsense-kit-builder/skills/kit-automation-design/references/feedback-kit.json', import.meta.url), 'utf8'));
const html = source.files.find(file => file.path === 'feedback.html').content;
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

async function render(sdk) {
  const elements = new Map();
  let nextId = 0;
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, {
        value: '', textContent: '', disabled: false, listeners: {},
        addEventListener(event, listener) { this.listeners[event] = listener; },
        focus() {},
      });
      return elements.get(id);
    },
  };
  runInNewContext(script, {
    document, window: { SimSense: sdk }, SimSense: sdk,
    crypto: { randomUUID: () => `synthetic-submission-${++nextId}` },
    setInterval() {},
  });
  await new Promise(resolve => setImmediate(resolve));
  return id => document.getElementById(id);
}

test('sample interaction never reports a saved submission', async () => {
  const element = await render(undefined);
  element('thought').value = 'A quieter corner';
  await element('send').listeners.click();
  assert.match(element('notice').textContent, /not saved/);
  assert.match(element('mode').textContent, /Sample preview/);
  assert.equal(element('thought').value, 'A quieter corner');
});

test('failed delivery retains text and retry reuses the submission ID', async () => {
  const calls = [];
  const element = await render({
    async emit(type, data) {
      calls.push({ type, data });
      if (calls.length === 1) throw new Error('simulated lost response');
    },
  });
  element('thought').value = 'More plants';
  await element('send').listeners.click();
  assert.equal(element('thought').value, 'More plants');
  assert.match(element('notice').textContent, /could not confirm/);
  assert.equal(element('send').disabled, false);
  await element('send').listeners.click();
  assert.equal(calls[0].type, 'feedback.submitted');
  assert.equal(calls[1].data.id, calls[0].data.id);
  assert.equal(element('thought').value, '');
  assert.match(element('notice').textContent, /Feedback saved/);
  element('thought').value = 'Longer opening hours';
  await element('send').listeners.click();
  assert.notEqual(calls[2].data.id, calls[1].data.id);
});

test('refresh failures retain the last summary with an explicit failure message', async () => {
  let refresh;
  let fail = false;
  const element = await render({
    async getAll(namespace) {
      assert.equal(namespace, 'summary');
      if (fail) throw new Error('simulated read failure');
      return { result: { text: 'Visitors mentioned quieter seating.', scope: 'Latest 100 feedback events', generatedAt: new Date(Date.now() - 30 * 60000).toISOString() } };
    },
    subscribe(namespace, callback) { assert.equal(namespace, 'summary'); refresh = callback; },
  });
  assert.equal(element('summary').textContent, 'Visitors mentioned quieter seating.');
  assert.match(element('age').textContent, /may need an update/);
  fail = true;
  refresh();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(element('summary').textContent, 'Visitors mentioned quieter seating.');
  assert.match(element('scope').textContent, /could not refresh/);
});

for (const generatedAt of ['not-a-date', Date.now(), new Date(Date.now() + 600000).toISOString()]) {
  test(`invalid summary timestamp is not rendered: ${generatedAt}`, async () => {
    const element = await render({
      async getAll() { return { result: { text: 'Misleading update', scope: 'Latest 100 feedback events', generatedAt } }; },
    });
    assert.equal(element('summary').textContent, '');
    assert.equal(element('age').textContent, '');
  });
}
