import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { convertBank } from '../src/convert.mjs';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const distractors = JSON.parse(read('src/distractors.json'));
const sources = ['viet', 'thong'].map(id => ({ id, data: JSON.parse(read(`cauhoi_${id}/questions.json`)) }));
const banks = sources.map(({ id, data }) => convertBank(id, data, distractors));
const all = banks.flatMap(b => b.questions);
const lookup = Object.fromEntries(all.map(q => [q.key, q]));
vm.runInThisContext(read('src/engine.js'));
const E = globalThis.QuizEngine;
const rng = () => 0.317;
const correct = q => q.choices.find(c => c.id === q.correctId).text;

test('all 595 original questions and all matching pairs are represented; original data is untouched', () => {
  assert.deepEqual(banks.map(b => [b.originalCount, b.questions.length]), [[241, 302], [354, 361]]);
  assert.equal(new Set(all.map(q => q.key)).size, 663);
  for (const { id, data } of sources) {
    assert.equal(data.count, data.questions.length);
    for (const source of data.questions) {
      const copies = all.filter(q => q.bank === id && q.sourceId === source.id);
      assert.equal(copies.length, source.type === 'matching' ? source.answer.length : 1);
      copies.forEach(q => {
        assert.deepEqual(q.originalAnswer, source.answer);
        assert.equal(q.prompt, source.prompt);
        assert.ok(q.choices.length >= 2);
        assert.equal(new Set(q.choices.map(c => JSON.stringify(c.text))).size, q.choices.length);
        if (q.figure) assert.ok(fs.existsSync(new URL(q.figure, root)));
      });
      if (source.type === 'single_choice' || source.type === 'fill_blank') assert.equal(correct(copies[0]), source.answer);
      if (source.type === 'true_false') assert.equal(/^(true|đúng)$/i.test(correct(copies[0])), source.answer);
      if (source.type === 'matching') copies.forEach((q, i) => assert.equal(correct(q), source.answer[i].right));
      if (source.type === 'multiple_choice') assert.deepEqual(new Set(correct(copies[0])), new Set(source.answer));
      if (source.type === 'numeric') {
        const q = copies[0], label = correct(q), number = Number(label.split(' ')[0]);
        if (source.display_answer !== undefined) assert.ok(label.startsWith(String(source.display_answer)));
        assert.ok(Math.abs(number - source.answer) <= Math.max(1e-6, Math.abs(source.answer) * 1e-6));
        assert.equal(new Set(q.choices.map(c => Number(c.text.split(' ')[0]))).size, 4);
        if (source.unit) assert.ok(q.choices.every(c => c.text.endsWith(source.unit)));
      }
    }
  }
});

test('wrong answers go to the tail, repeat until correct, and cannot be submitted twice', () => {
  const qs = all.slice(0, 3), map = Object.fromEntries(qs.map(q => [q.key, q]));
  const s = E.create(qs, 'test', rng);
  const first = E.current(s).key, wrong = map[first].choices.find(c => c.id !== map[first].correctId).id;
  assert.ok(E.answer(s, wrong, map));
  assert.equal(s.queue.at(-1), first);
  assert.equal(E.summary(s).retry, 1);
  assert.equal(E.answer(s, map[first].correctId, map), false);
  E.next(s, map, rng);
  while (E.current(s).key !== first) {
    const q = map[E.current(s).key]; E.answer(s, q.correctId, map); E.next(s, map, rng);
  }
  E.answer(s, wrong, map); E.next(s, map, rng);
  assert.equal(E.current(s).key, first);
  E.answer(s, map[first].correctId, map);
  assert.equal(E.summary(s).remaining, 0);
  assert.equal(E.summary(s).retry, 0);
  assert.ok(E.current(s), 'last feedback remains until next');
  E.next(s, map, rng);
  assert.equal(E.current(s), null);
  assert.equal(E.summary(s).mastered, 3);
});

test('previous/next only reviews history and preserves pending question and option order', () => {
  const qs = all.slice(0, 4), map = Object.fromEntries(qs.map(q => [q.key, q]));
  const s = E.create(qs, 'test', rng);
  assert.equal(E.previous(s), false);
  assert.equal(E.next(s, map), false);
  assert.equal(E.answer(s, 'invalid', map), false);
  E.answer(s, map[E.current(s).key].correctId, map);
  E.next(s, map, rng);
  const pending = structuredClone(E.current(s)), stats = E.summary(s), queue = [...s.queue];
  E.previous(s);
  assert.equal(E.answer(s, map[E.current(s).key].correctId, map), false);
  E.next(s, map, rng);
  assert.deepEqual(E.current(s), pending);
  assert.deepEqual(E.summary(s), stats);
  assert.deepEqual(s.queue, queue);
});

test('all modes finish after a full shuffled run with failures; saves restore at every stage', () => {
  for (const [mode, qs] of [...banks.map(b => [b.id, b.questions]), ['all', all]]) {
    const map = Object.fromEntries(qs.map(q => [q.key, q]));
    const s = E.create(qs, mode, rng), seen = new Set();
    let iterations = 0;
    while (E.current(s)) {
      const q = map[E.current(s).key];
      const fail = !seen.has(q.key) && iterations % 5 === 0;
      seen.add(q.key);
      const id = fail ? q.choices.find(c => c.id !== q.correctId).id : q.correctId;
      assert.ok(E.answer(s, id, map));
      if (iterations % 37 === 0) assert.ok(E.valid(JSON.parse(JSON.stringify(s)), qs, mode));
      assert.ok(E.next(s, map, rng));
      if (++iterations > qs.length * 2) assert.fail('Practice does not terminate');
    }
    assert.equal(s.mastered.length, qs.length);
    assert.equal(s.queue.length, 0);
    assert.ok(E.valid(s, qs, mode));
    assert.ok(E.previous(s));
    assert.ok(E.valid(s, qs, mode));
    assert.ok(E.next(s, map));
    assert.equal(E.current(s), null);
  }
});

test('malformed, stale and incompatible saved sessions are rejected', () => {
  const qs = all.slice(0, 3), s = E.create(qs, 'test', rng);
  assert.ok(E.valid(s, qs, 'test'));
  assert.equal(E.valid(s, qs, 'other'), false);
  assert.equal(E.valid(null, qs, 'test'), false);
  const broken = structuredClone(s); broken.queue[0] = 'unknown';
  assert.equal(E.valid(broken, qs, 'test'), false);
  const altered = structuredClone(s); altered.visits[0].order[0] = 'missing';
  assert.equal(E.valid(altered, qs, 'test'), false);
  const fake = structuredClone(s); fake.visits[0].selected = 'missing';
  assert.equal(E.valid(fake, qs, 'test'), false);
});

test('shuffle does not mutate source banks and offline HTML includes all 25 figures without remote dependencies', () => {
  const keys = ['a', 'b', 'c', 'd'], before = [...keys];
  assert.deepEqual(new Set(E.shuffle(keys, rng)), new Set(keys));
  assert.deepEqual(keys, before);
  const html = read('index.html');
  const match = html.match(/<script id="quiz-data" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const payload = JSON.parse(match[1]);
  assert.equal(payload.banks.flatMap(b => b.questions).length, 663);
  assert.equal(Object.keys(payload.images).length, 25);
  assert.ok(Object.values(payload.images).every(v => v.startsWith('data:image/png;base64,')));
  assert.equal(/<(script|link)[^>]+(?:src|href)="https?:/i.test(html), false);
  assert.equal(/fetch\s*\(/.test(html), false);
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => new vm.Script(script[1]));
});
