const tasks = [
  { name: 'Banana', file: 'banana', easy: 'I want a banana.', hard: 'I need a healthy snack.' },
  { name: 'Can', file: 'cococola', easy: 'I want a can.', hard: 'I am thirsty. What can I drink?' },
  { name: 'Screwdriver', file: 'screwdriver', easy: 'I need a screwdriver.', hard: 'What can I use to tighten the screw?' },
  { name: 'Hammer', file: 'hammer', easy: 'I want a hammer.', hard: 'I need to drive a nail.' },
  { name: 'Pot', file: 'pot', easy: 'I need a pot.', hard: 'I want to cook. What can you give me?' },
  { name: 'Mouse', file: 'mouse', easy: 'Give me the mouse.', hard: 'What can I use to control the cursor?' },
  { name: 'Ball', file: 'circle', easy: 'Hand me the ball.', hard: 'Give me something round to play with.' },
  { name: 'Scoop', file: 'scoop', easy: 'I want a scoop.', hard: 'We need to serve soup. What can I use?' },
  { name: 'Knife', file: 'knife', easy: 'Hand me the knife.', hard: 'What can I use to cut food?' },
  { name: 'Glove', file: 'glove', easy: 'Hand me the glove.', hard: 'What can protect my hand?' }
];

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  const useFallback = () => {
    const fallback = image.dataset.fallback;
    if (fallback && image.getAttribute('src') !== fallback) image.src = fallback;
  };
  image.addEventListener('error', useFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) useFallback();
});

const taskGrid = document.getElementById('taskGrid');
const cards = [];

function sourceFor(task, mode) {
  return `../static/真机视频_web/${task.file}_${mode}.mp4`;
}

function setCardMode(card, mode, reset = true) {
  const task = tasks[Number(card.dataset.taskIndex)];
  const video = card.querySelector('video');
  card.dataset.mode = mode;
  card.querySelector('[data-context]').textContent = mode.toUpperCase();
  card.querySelector('[data-instruction]').textContent = task[mode];
  card.querySelectorAll('[data-local-mode]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.localMode === mode);
  });
  if (reset) {
    video.pause();
    video.querySelector('source').src = sourceFor(task, mode);
    video.load();
    video.playbackRate = 2;
  }
}

tasks.forEach((task, index) => {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.dataset.taskIndex = index;
  card.dataset.mode = 'easy';
  card.innerHTML = `<div class="task-media"><video loop muted playsinline preload="metadata" controls aria-label="${task.name} instruction"><source src="${sourceFor(task, 'easy')}" type="video/mp4"></video><span class="speed-badge">2×</span></div><div class="task-body"><div class="task-head"><b>${String(index + 1).padStart(2, '0')} · ${task.name}</b><span data-context>EASY</span></div><p><strong>Instruction:</strong> <span data-instruction>${task.easy}</span></p><div class="local-switch"><button class="is-active" data-local-mode="easy">Easy</button><button data-local-mode="hard">Hard</button></div></div>`;
  taskGrid.appendChild(card);
  const video = card.querySelector('video');
  video.defaultPlaybackRate = 2;
  video.playbackRate = 2;
  video.muted = true;
  card.querySelectorAll('[data-local-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      setCardMode(card, button.dataset.localMode);
      activeRow = null;
      requestAnimationFrame(updatePlayback);
    });
  });
  cards.push(card);
});

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
    cards.forEach((card) => setCardMode(card, button.dataset.mode));
    activeRow = null;
    requestAnimationFrame(updatePlayback);
  });
});

const visibility = new Map();
let activeRow = null;

function updatePlayback() {
  const rows = new Map();
  cards.forEach((card) => {
    const rowKey = Math.round(card.offsetTop);
    if (!rows.has(rowKey)) rows.set(rowKey, { cards: [], score: 0 });
    rows.get(rowKey).cards.push(card);
    rows.get(rowKey).score += visibility.get(card) || 0;
  });

  const rankedRows = [...rows.entries()]
    .filter(([, row]) => row.score > .18)
    .sort((a, b) => b[1].score - a[1].score);
  const nextRow = rankedRows.length ? rankedRows[0][0] : null;
  if (nextRow === activeRow) return;

  activeRow = nextRow;
  cards.forEach((card) => {
    const video = card.querySelector('video');
    const shouldPlay = activeRow !== null && Math.round(card.offsetTop) === activeRow;
    card.classList.toggle('is-playing', shouldPlay);
    if (shouldPlay) {
      video.playbackRate = 2;
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visibility.set(entry.target, entry.intersectionRatio));
    updatePlayback();
  }, { threshold: [0, .2, .5, .8] });
  cards.forEach((card) => observer.observe(card));
}

const copyButton = document.getElementById('copyBtn');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('bibtex').innerText);
    copyButton.textContent = 'Copied';
  } catch {
    copyButton.textContent = 'Select text';
  }
  setTimeout(() => { copyButton.textContent = 'Copy BibTeX'; }, 1400);
});

const imageDialog = document.getElementById('imageDialog');
const dialogImage = document.getElementById('dialogImage');
const dialogCaption = document.getElementById('dialogCaption');
const dialogClose = document.getElementById('dialogClose');

function openFigure(image) {
  const caption = image.closest('figure')?.querySelector('figcaption');
  dialogImage.src = image.currentSrc || image.src;
  dialogImage.alt = image.alt;
  dialogCaption.textContent = caption?.textContent || image.alt;
  imageDialog.showModal();
}

document.querySelectorAll('[data-lightbox]').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `${image.alt}. Open full-size figure.`);
  image.addEventListener('click', () => openFigure(image));
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFigure(image);
    }
  });
});

dialogClose.addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
