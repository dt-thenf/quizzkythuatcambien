// Conversion is deterministic. Original JSON and answer fields are never rewritten.
function unique(values) { return [...new Set(values)]; }
function numericOptions(q) {
  const value = q.answer;
  if (!Number.isFinite(value)) throw new Error(`Invalid numeric answer: ${q.id}`);
  const shown = String(q.display_answer ?? (Number.isInteger(value) ? value : Number(value.toPrecision(7))));
  const decimals = q.rounding_decimals ?? (shown.includes('.') ? shown.split('.')[1].length : 0);
  const step = Math.max(Math.abs(value) * 0.15, 10 ** -decimals);
  const format = n => decimals ? n.toFixed(decimals) : String(Math.round(n));
  const labels = [shown];
  for (const factor of [-1, 1, 2, -2, 3, 5, -5]) {
    const label = format(value + step * factor);
    if (!labels.some(x => Number(x) === Number(label))) labels.push(label);
    if (labels.length === 4) break;
  }
  if (labels.length !== 4) throw new Error(`Insufficient numeric distractors: ${q.id}`);
  return labels.map(label => q.unit ? `${label} ${q.unit}` : label);
}
export function convertBank(id, source, distractors) {
  const questions = [];
  for (const q of source.questions) {
    const base = {
      key: `${id}:${q.id}`, bank: id, sourceId: q.id, sourceType: q.type,
      topic: q.topic, prompt: q.prompt, originalAnswer: q.answer,
      figure: q.figure ? `cauhoi_${id}/${q.figure}` : null,
      review: q.review_status === 'needs_review', note: q.source_note || '',
      alternatives: q.alternative_answers || [],
    };
    const add = (extra, labels, answerIndex = 0) => {
      if (labels.length < 2 || new Set(labels.map(x => JSON.stringify(x))).size !== labels.length) throw new Error(`Duplicate/insufficient choices: ${base.key}`);
      questions.push({ ...base, ...extra, choices: labels.map((text, i) => ({ id: String(i), text })), correctId: String(answerIndex) });
    };
    switch (q.type) {
      case 'true_false': {
        // Original language and order are preserved in the generated data.
        const labels = q.options || ['True', 'False'];
        const index = labels.findIndex(x => /^(true|đúng)$/i.test(x.trim()) === q.answer);
        if (index < 0) throw new Error(`Missing boolean answer ${base.key}`);
        add({}, labels, index);
        break;
      }
      case 'single_choice': {
        const labels = unique(q.options);
        if (!labels.includes(q.answer)) throw new Error(`Missing original answer ${base.key}`);
        add({}, labels, labels.indexOf(q.answer));
        break;
      }
      case 'numeric': add({ conversion: 'numeric' }, numericOptions(q)); break;
      case 'fill_blank': {
        const wrong = distractors[q.answer];
        if (!wrong || wrong.length < 3) throw new Error(`Missing curated distractors: ${base.key} ${q.answer}`);
        add({ conversion: 'fill_blank' }, [q.answer, ...wrong.slice(0, 3)]);
        break;
      }
      case 'matching': {
        q.answer.forEach((pair, i) => {
          const labels = unique([pair.right, ...(q.options || []), ...q.answer.map(p => p.right)]);
          add({ key: `${base.key}:${i + 1}`, matchLabel: pair.left, part: i + 1, parts: q.answer.length, conversion: 'matching' }, labels);
        });
        break;
      }
      case 'multiple_choice': {
        const options = unique(q.options);
        const correct = options.map((text, i) => q.answer.includes(text) ? i : -1).filter(i => i >= 0);
        if (correct.length !== q.answer.length || !correct.length) throw new Error(`Invalid multiple-choice answer: ${base.key}`);
        // Each radio choice is a complete set of original statements.
        const sets = [correct];
        for (let mask = 1; mask < 2 ** options.length; mask++) {
          const set = options.map((_, i) => mask & (1 << i) ? i : -1).filter(i => i >= 0);
          if (JSON.stringify(set) !== JSON.stringify(correct)) sets.push(set);
        }
        const wrong = sets.slice(1).sort((a, b) => Math.abs(a.length - correct.length) - Math.abs(b.length - correct.length) || a.join().localeCompare(b.join()));
        const selected = [correct, ...wrong.slice(0, 3)];
        add({ conversion: 'multiple_choice' }, selected.map(set => set.map(i => options[i])));
        break;
      }
      default: throw new Error(`Unsupported type ${q.type}`);
    }
  }
  return { id, name: id === 'viet' ? 'Quiz Việt' : 'Quiz Thông', originalCount: source.questions.length, questions };
}
