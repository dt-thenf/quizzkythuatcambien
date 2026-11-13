(function (global) {
  'use strict';
  function shuffle(items, rng = Math.random) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function visit(key, lookup, rng) {
    return { key, order: shuffle(lookup[key].choices.map(c => c.id), rng), selected: null, correct: null };
  }
  function create(questions, mode, rng = Math.random) {
    if (!questions.length) throw new Error('Empty question bank');
    const lookup = Object.fromEntries(questions.map(q => [q.key, q]));
    const queue = shuffle(questions.map(q => q.key), rng);
    return { version: 1, mode, queue, mastered: [], visits: [visit(queue[0], lookup, rng)], cursor: 0, startedAt: Date.now() };
  }
  function current(state) { return state.visits[state.cursor] || null; }
  function answer(state, choiceId, lookup) {
    const item = current(state);
    if (!item || item.selected !== null || state.cursor !== state.visits.length - 1) return false;
    const q = lookup[item.key];
    if (!q.choices.some(c => c.id === choiceId) || state.queue[0] !== item.key) return false;
    item.selected = choiceId;
    item.correct = choiceId === q.correctId;
    state.queue.shift();
    if (item.correct) state.mastered.push(item.key);
    else state.queue.push(item.key);
    return true;
  }
  function next(state, lookup, rng = Math.random) {
    const item = current(state);
    if (!item || item.selected === null) return false;
    if (state.cursor < state.visits.length - 1) { state.cursor++; return true; }
    if (state.queue.length) state.visits.push(visit(state.queue[0], lookup, rng));
    state.cursor++;
    return true;
  }
  function previous(state) {
    if (state.cursor <= 0) return false;
    state.cursor--;
    return true;
  }
  function summary(state) {
    const answered = state.visits.filter(v => v.selected !== null);
    const wrong = answered.filter(v => !v.correct);
    const retry = new Set(wrong.map(v => v.key).filter(key => state.queue.includes(key)));
    return { attempts: answered.length, wrong: wrong.length, mastered: state.mastered.length, remaining: state.queue.length, retry: retry.size, accuracy: answered.length ? Math.round(100 * (answered.length - wrong.length) / answered.length) : 0 };
  }
  function valid(state, questions, mode) {
    // Replay stored answers against this exact bank; malformed/stale saves are ignored.
    try {
      const lookup = Object.fromEntries(questions.map(q => [q.key, q]));
      const keys = questions.map(q => q.key);
      if (state.version !== 1 || state.mode !== mode || !Number.isInteger(state.cursor) || !Number.isFinite(state.startedAt)) return false;
      if (!Array.isArray(state.queue) || !Array.isArray(state.mastered) || !Array.isArray(state.visits) || !state.visits.length) return false;
      if (state.cursor < 0 || state.cursor > state.visits.length) return false;
      if (state.cursor === state.visits.length && state.queue.length) return false;
      const pending = [...state.queue, ...state.mastered];
      if (pending.length !== keys.length || new Set(pending).size !== keys.length || pending.some(k => !lookup[k])) return false;
      const mastered = new Set();
      for (let i = 0; i < state.visits.length; i++) {
        const v = state.visits[i], q = lookup[v.key];
        if (!q || mastered.has(v.key) || !Array.isArray(v.order) || new Set(v.order).size !== q.choices.length || v.order.length !== q.choices.length || v.order.some(id => !q.choices.some(c => c.id === id))) return false;
        if (v.selected === null) {
          if (i !== state.visits.length - 1 || v.correct !== null || state.queue[0] !== v.key) return false;
        } else {
          if (!v.order.includes(v.selected) || v.correct !== (v.selected === q.correctId)) return false;
          if (v.correct) mastered.add(v.key);
        }
      }
      if (mastered.size !== state.mastered.length || state.mastered.some(k => !mastered.has(k))) return false;
      if (state.cursor === state.visits.length && state.visits.at(-1).selected === null) return false;
      return true;
    } catch { return false; }
  }
  global.QuizEngine = Object.freeze({ shuffle, create, current, answer, next, previous, summary, valid });
})(globalThis);
