(function () {
  'use strict';
  const data = JSON.parse(document.getElementById('quiz-data').textContent);
  const E = globalThis.QuizEngine;
  const all = data.banks.flatMap(b => b.questions);
  const lookup = Object.fromEntries(all.map(q => [q.key, q]));
  const main = document.getElementById('main');
  const help = document.getElementById('help-dialog');
  const bankNames = { viet: 'Quiz Việt', thong: 'Quiz Thông', all: 'Trộn tất cả' };
  const topics = { general: 'Đại cương', optical: 'Cảm biến quang', thermal: 'Cảm biến nhiệt', electromagnetic: 'Điện & từ', mechanical: 'Cảm biến cơ học', smart: 'Cảm biến thông minh', interface: 'Giao tiếp', gas: 'Cảm biến khí', electrical: 'Điện & từ', mems: 'MEMS' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
  const clean = value => String(value).replace(/^[a-z]\.\s+/i, '');
  const choiceMarkup = value => Array.isArray(value) ? `<ul>${value.map(v => `<li>${esc(clean(v))}</li>`).join('')}</ul>` : esc(clean(value));
  const getQuestions = mode => mode === 'all' ? all : data.banks.find(b => b.id === mode).questions;
  let hash = 2166136261;
  for (const c of JSON.stringify(data.banks)) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
  const prefix = `cambien-quiz-v1-${hash >>> 0}-`;
  let state = null, screen = 'home', storageAvailable = true, answeredAt = 0;
  function load(mode) {
    try {
      const raw = localStorage.getItem(prefix + mode);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      return E.valid(saved, getQuestions(mode), mode) ? saved : null;
    } catch { storageAvailable = false; return null; }
  }
  function save() {
    if (!state) return;
    try { localStorage.setItem(prefix + state.mode, JSON.stringify(state)); }
    catch { storageAvailable = false; }
  }
  function notice() { return storageAvailable ? '' : '<p class="save-notice" role="status">Trình duyệt đang chặn lưu tiến độ. Bạn vẫn có thể làm đầy đủ trong tab này; hãy giữ tab mở để tiếp tục.</p>'; }
  function focusHeading() {
    const heading = main.querySelector('h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }
  const art = `<svg class="hero-art" viewBox="0 0 220 180" fill="none" aria-hidden="true"><path d="M15 150H205M30 28V160M75 28V160M120 28V160M165 28V160M15 60H205M15 105H205" stroke="#dce5d7" stroke-dasharray="3 5"/><circle cx="115" cy="92" r="68" stroke="#d0dfc5"/><circle cx="115" cy="92" r="49" stroke="#bfd2b2"/><rect x="87" y="64" width="56" height="56" rx="15" fill="#e5eedc" stroke="#a9c096"/><rect x="99" y="76" width="32" height="32" rx="9" fill="#246447"/><path d="M105 93L112 99L125 85" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 56V48M116 56V48M128 56V48M104 136V128M116 136V128M128 136V128M79 80H71M79 92H71M79 104H71M159 80H151M159 92H151M159 104H151" stroke="#a1ba90" stroke-width="2" stroke-linecap="round"/><circle cx="180" cy="61" r="7" fill="#e2b67a"/><circle cx="59" cy="130" r="5" fill="#91af79"/><path d="M172 140L180 132M172 132L180 140" stroke="#8ba779" stroke-width="2" stroke-linecap="round"/></svg>`;
  function home() {
    screen = 'home';
    main.innerHTML = `<div class="home"><section class="hero"><div><div class="eyebrow">Kỹ thuật cảm biến · Tự học mỗi ngày</div><h1>Học chắc từng câu.<br><em>Tự tin hơn mỗi lượt.</em></h1><p>Chọn bộ đề, chạm đáp án và ôn lại những câu chưa đúng.<br>Một khoảng nhỏ mỗi ngày, một bước gần hơn đến nắm vững kiến thức.</p></div>${art}</section><div class="section-heading"><h2>Hôm nay, bạn muốn luyện bộ nào?</h2><p>${data.banks.reduce((n, b) => n + b.originalCount, 0)} câu gốc · Xáo trộn mỗi lượt</p></div><section class="decks" aria-label="Chọn bộ câu hỏi">${['viet', 'thong', 'all'].map((mode, i) => {
      const qs = getQuestions(mode), saved = state?.mode === mode ? state : load(mode), stats = saved && E.summary(saved);
      const originals = mode === 'all' ? data.banks.reduce((n, b) => n + b.originalCount, 0) : data.banks.find(b => b.id === mode).originalCount;
      const complete = saved && !saved.queue.length && !E.current(saved);
      return `<article class="deck ${i === 2 ? 'featured' : ''}"><div class="deck-top"><span class="deck-icon" aria-hidden="true">${['▤', '▥', '⤨'][i]}</span>${i === 2 ? '<span class="tag">TOÀN DIỆN</span>' : ''}</div><h3>${bankNames[mode]}</h3><p>${['Tập trung luyện ngân hàng câu hỏi Việt.', 'Khám phá trọn bộ ngân hàng câu hỏi Thông.', 'Kết hợp cả hai ngân hàng trong một lượt học.'][i]}</p><div class="deck-count"><strong>${qs.length}</strong> lượt chọn <span>từ ${originals} câu gốc</span></div>${saved ? `<div class="deck-progress" aria-label="Đã đúng ${stats.mastered} trên ${qs.length}"><i style="width:${stats.mastered / qs.length * 100}%"></i></div>` : ''}<button class="button ${i === 2 ? 'primary' : ''}" data-action="${saved ? 'resume' : 'start'}" data-mode="${mode}"><span>${saved ? (complete ? 'Xem kết quả' : `Tiếp tục · ${stats.mastered}/${qs.length} đã đúng`) : 'Bắt đầu luyện tập'}</span><span aria-hidden="true">↗</span></button>${saved ? `<button class="new-session" data-action="start" data-mode="${mode}">Bắt đầu lượt mới</button>` : ''}</article>`;
    }).join('')}</section><section class="how-it-works" aria-label="Cách luyện tập"><div class="step"><span class="step-number">01</span><div><strong>Chọn một đáp án</strong><p>Mỗi lượt một câu, chấm ngay sau khi chọn.</p></div></div><div class="step"><span class="step-number">02</span><div><strong>Sai cũng là một bước học</strong><p>Luôn thấy đáp án đúng. Câu sai trở lại ở cuối.</p></div></div><div class="step"><span class="step-number">03</span><div><strong>Tiếp tục đến khi nắm vững</strong><p>Chạm màn hình để sang câu; quay lại bất cứ lúc nào.</p></div></div></section><p class="muted small">Câu ghép được tách thành từng lượt chọn; câu nhiều đáp án dùng tổ hợp. Dữ liệu và hình ảnh có sẵn trong tệp, dùng được khi không có mạng.</p>${notice()}</div>`;
    focusHeading();
  }
  function start(mode, resume) {
    if (!bankNames[mode]) return;
    state = resume ? (state?.mode === mode ? state : load(mode)) : null;
    if (!state) state = E.create(getQuestions(mode), mode);
    save(); screen = 'quiz'; answeredAt = 0; render(); window.scrollTo(0, 0);
  }
  function render() {
    if (!state) return home();
    const v = E.current(state);
    if (!v) return complete();
    screen = 'quiz';
    const q = lookup[v.key], stats = E.summary(state), total = getQuestions(state.mode).length;
    const answered = v.selected !== null, history = state.cursor < state.visits.length - 1;
    const attemptsBefore = state.visits.slice(0, state.cursor).filter(x => x.key === q.key && x.selected !== null).length;
    const correctChoice = q.choices.find(c => c.id === q.correctId);
    const prompt = q.prompt.replace(/\s*Chỉ nhập số theo đơn vị yêu cầu, dùng dấu chấm thập phân\.?/g, '').replace(/\s*Chỉ điền phần còn thiếu\.?/g, '').replace(/\s*Điền thuật ngữ, không thêm dấu chấm cuối câu\.?/g, '').replace(/\s*\((câu hỏi )?nhiều đáp án\)/gi, '');
    main.innerHTML = `<div class="quiz"><div class="quiz-toolbar"><button class="text-button" data-action="home">← Chọn bộ đề</button><div class="session-label">${bankNames[state.mode]}<span>Câu hỏi được xáo trộn</span></div><button class="text-button" data-action="restart">Lượt mới ↻</button></div><div class="quiz-grid"><section class="question-area" aria-label="Câu hỏi hiện tại">${history ? '<p class="history-note">Bạn đang xem lại lịch sử. Đáp án và tiến độ được giữ nguyên.</p>' : ''}<article class="question-card"><div class="question-meta"><span class="pill ${q.bank === 'thong' ? 'blue' : ''}">${bankNames[q.bank]}</span><span>${esc(topics[q.topic] || 'Kỹ thuật cảm biến')}</span>${attemptsBefore ? `<span class="pill amber">Ôn lại · lần ${attemptsBefore + 1}</span>` : ''}<span class="question-code">${q.sourceId}${q.part ? ` · ${q.part}/${q.parts}` : ''} / Lượt ${state.cursor + 1}</span></div><h1>${esc(prompt)}</h1>${q.matchLabel ? `<div class="match-target"><span class="muted small">Chọn mô tả tương ứng với:</span><br>${esc(q.matchLabel)}</div>` : ''}${q.figure ? `<figure class="figure"><img src="${data.images[q.figure]}" alt="Hình minh họa của ${bankNames[q.bank]} ${q.sourceId}" decoding="async"></figure>` : ''}<p class="instruction">${q.conversion === 'multiple_choice' ? 'Chọn một tổ hợp chứa đầy đủ các ý đúng.' : q.conversion === 'numeric' ? 'Chọn giá trị đúng theo đơn vị trong đáp án.' : 'Chọn một đáp án phù hợp.'}</p><div class="choices">${v.order.map((id, i) => {
      const c = q.choices.find(x => x.id === id), correct = answered && id === q.correctId, wrong = answered && id === v.selected && !v.correct;
      return `<button class="choice ${answered ? 'locked' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-choice="${id}" aria-label="Đáp án ${String.fromCharCode(65 + i)}: ${esc(Array.isArray(c.text) ? c.text.join('; ') : clean(c.text))}${correct ? '. Đáp án đúng' : wrong ? '. Bạn đã chọn sai' : ''}" ${answered ? 'aria-disabled="true"' : ''}><span class="choice-label" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span class="choice-text">${choiceMarkup(c.text)}</span>${correct ? '<span class="choice-state">✓ Đúng</span>' : wrong ? '<span class="choice-state">× Đã chọn</span>' : ''}</button>`;
    }).join('')}</div>${answered ? `<div class="feedback ${v.correct ? '' : 'wrong'}" role="status" tabindex="-1"><span class="feedback-title">${v.correct ? '✓ Chính xác! Thêm một câu đã nắm vững.' : 'Chưa đúng — mình gặp lại câu này ở cuối nhé.'}</span><div><strong>Đáp án đúng${q.review ? ' theo bộ đề' : ''}:</strong> ${choiceMarkup(correctChoice.text)}</div>${!v.correct ? '<p>Câu này đã được đưa về cuối hàng chờ và sẽ lặp lại đến khi bạn chọn đúng.</p>' : ''}${q.note || q.review ? `<div class="source-note"><strong>${q.review ? 'Lưu ý từ ngân hàng gốc · Cần rà soát' : 'Ghi chú từ ngân hàng gốc'}</strong>${esc(q.note || 'Câu này được ngân hàng đánh dấu cần rà soát. Ứng dụng giữ nguyên đáp án đã lưu.')}${q.alternatives.length ? `<p>Phương án khác được nguồn ghi nhận: ${esc(q.alternatives.join('; '))}.</p>` : ''}</div>` : ''}</div>` : ''}</article><div class="question-nav"><button class="button" data-action="previous" ${state.cursor === 0 ? 'disabled' : ''}>← Câu trước</button><button class="button ${answered ? 'primary' : ''}" data-action="next" ${answered ? '' : 'disabled'}>${!state.queue.length && state.cursor === state.visits.length - 1 ? 'Xem kết quả' : 'Câu tiếp'} →</button></div><p class="next-hint ${answered ? 'ready' : ''}">${answered ? '↳ Nhấp bất kỳ đâu trên màn hình hoặc nhấn Enter để tiếp tục' : 'Phím 1–9 để chọn nhanh · ← để xem câu trước'}</p></section><aside class="quiz-aside" aria-label="Tiến độ luyện tập"><div class="progress-card"><div class="eyebrow">Từng bước nắm vững</div><div class="progress-number"><strong>${stats.mastered}</strong><span>/ ${total}</span></div><div class="progress-caption">lượt chọn đã trả lời đúng</div><div class="progress-bar" role="progressbar" aria-label="Số lượt chọn đã đúng" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${stats.mastered}"><i style="width:${100 * stats.mastered / total}%"></i></div><div class="progress-stats"><div class="stat-row"><span>Còn cần làm</span><strong>${stats.remaining}</strong></div><div class="stat-row"><span>Cần ôn lại</span><strong>${stats.retry}</strong></div><div class="stat-row"><span>Tổng lần trả lời</span><strong>${stats.attempts}</strong></div></div></div><div class="side-note"><strong>Học đến khi đúng, không vội.</strong><p>Câu sai quay về cuối hàng chờ. Khi trả lời đúng, câu đó hoàn thành và không lặp lại.</p><p style="margin-top:12px">${storageAvailable ? 'Tiến độ được tự động lưu trên trình duyệt này.' : 'Trình duyệt chặn lưu tiến độ. Hãy giữ tab này mở.'}</p><button class="text-button" data-action="help" style="margin-top:12px">Xem hướng dẫn & phím tắt ↗</button></div></aside></div>${notice()}</div>`;
    focusHeading();
  }
  function complete() {
    screen = 'complete';
    const stats = E.summary(state), total = getQuestions(state.mode).length;
    main.innerHTML = `<section class="complete"><div class="complete-icon" aria-hidden="true">✓</div><div class="eyebrow" style="justify-content:center">${bankNames[state.mode]} · Hoàn thành</div><h1>Bạn đã đúng tất cả!</h1><p>${total} lượt chọn đều đã được trả lời đúng. Những câu từng sai cũng đã được bạn chinh phục.</p><div class="result-stats"><div><strong>${stats.mastered}/${total}</strong><span>đã nắm vững</span></div><div><strong>${stats.attempts}</strong><span>lần trả lời</span></div><div><strong>${stats.wrong}</strong><span>lần chọn sai đã ôn lại</span></div></div><div class="complete-actions"><button class="button primary" data-action="restart">Luyện lại · Trộn lượt mới ↻</button><button class="button" data-action="home">Chọn bộ đề khác →</button></div><button class="text-button" data-action="previous">← Xem lại câu vừa làm</button>${notice()}</section>`;
    focusHeading();
  }
  function next() {
    if (state && E.next(state, lookup)) { save(); answeredAt = 0; render(); window.scrollTo(0, 0); }
  }
  function previous() {
    if (state && E.previous(state)) { save(); answeredAt = 0; render(); window.scrollTo(0, 0); }
  }
  function choose(id) {
    if (state && E.answer(state, id, lookup)) {
      answeredAt = Date.now(); save(); render();
      // Keep the correct answer visible even on a small screen with a tall figure.
      main.querySelector('.feedback')?.focus({ preventScroll: false });
    }
  }
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    const action = target.closest('[data-action]');
    if (action) {
      if (action.disabled) return;
      switch (action.dataset.action) {
        case 'home': save(); home(); window.scrollTo(0, 0); break;
        case 'start': start(action.dataset.mode, false); break;
        case 'resume': start(action.dataset.mode, true); break;
        case 'restart': start(state.mode, false); break;
        case 'next': if (Date.now() - answeredAt > 300) next(); break;
        case 'previous': previous(); break;
        case 'help': help.showModal(); break;
        case 'close-help': help.close(); break;
      }
      return;
    }
    if (help.open || screen !== 'quiz' || event.detail > 1 || window.getSelection()?.toString()) return;
    const option = target.closest('[data-choice]');
    const v = E.current(state);
    if (!v) return;
    if (v.selected === null) { if (option) choose(option.dataset.choice); }
    else if (!target.closest('a, input, select, textarea, summary') && Date.now() - answeredAt > 300) next();
  });
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || help.open || screen === 'home') return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); return; }
    if (screen !== 'quiz') return;
    const v = E.current(state);
    if (event.repeat) return;
    const focusedControl = event.target.closest?.('button, a, input, textarea, select');
    if (v.selected === null && /^[1-9]$/.test(event.key)) {
      const id = v.order[Number(event.key) - 1];
      if (id !== undefined) { event.preventDefault(); choose(id); }
    } else if (v.selected !== null && ['Enter', ' ', 'ArrowRight'].includes(event.key) && (!focusedControl || event.key === 'ArrowRight')) {
      event.preventDefault(); if (Date.now() - answeredAt > 300) next();
    }
  });
  // This public read-only snapshot helps inspect progress without exposing mutable state.
  globalThis.QuizApp = Object.freeze({ snapshot: () => state ? JSON.parse(JSON.stringify(state)) : null });
  home();
})();
