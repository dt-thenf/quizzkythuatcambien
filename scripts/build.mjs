// No dependencies. Rebuild the single-file offline app with: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertBank } from '../src/convert.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const distractors = JSON.parse(read('src/distractors.json'));
const banks = ['viet', 'thong'].map(id => {
  const source = JSON.parse(read(`cauhoi_${id}/questions.json`));
  return convertBank(id, source, distractors);
});
const images = {};
for (const bank of banks) {
  for (const q of bank.questions) {
    if (q.figure && !images[q.figure]) {
      const absolute = path.resolve(root, q.figure);
      if (!absolute.startsWith(root + path.sep)) throw new Error('Invalid figure path');
      images[q.figure] = 'data:image/png;base64,' + fs.readFileSync(absolute).toString('base64');
    }
  }
}
const payload = { version: 1, banks, images };
// Escape script boundaries and JS line separators in user-authored bank text.
const json = JSON.stringify(payload).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const engine = read('src/engine.js');
const app = read('src/app.js');
const html = read('src/template.html')
  .replace('/* INLINE_CSS */', read('src/styles.css'))
  .replace('/* INLINE_DATA */', json)
  .replace('/* INLINE_ENGINE */', engine)
  .replace('/* INLINE_APP */', app);
fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');
console.log(JSON.stringify({ file: 'index.html', bytes: Buffer.byteLength(html), banks: banks.map(b => ({ id: b.id, original: b.originalCount, practice: b.questions.length })), figures: Object.keys(images).length }, null, 2));
