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

const videoGrid = document.getElementById('videoGrid');
const cards = [];

tasks.forEach((task, taskIndex) => {
  ['easy', 'hard'].forEach((context) => {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.dataset.context = context;
    card.innerHTML = `<div class="video-media"><video loop muted playsinline preload="metadata" controls aria-label="${task.name} ${context} instruction"><source src="../static/真机视频_web/${task.file}_${context}.mp4" type="video/mp4"></video><span class="speed-badge">2×</span></div><div class="video-copy"><strong>${String(taskIndex + 1).padStart(2, '0')} · ${context}</strong><h3>${task.name}</h3><p><b>Instruction:</b> ${task[context]}</p></div>`;
    videoGrid.appendChild(card);
    cards.push(card);
  });
});

const videos = cards.map((card) => card.querySelector('video'));
videos.forEach((video) => {
  video.defaultPlaybackRate = 2;
  video.playbackRate = 2;
  video.muted = true;
});

const visibility = new Map();
let activeRow = null;

function updatePlayback() {
  const visibleCards = cards.filter((card) => !card.hidden);
  const rows = new Map();
  visibleCards.forEach((card) => {
    const key = Math.round(card.offsetTop);
    if (!rows.has(key)) rows.set(key, { cards: [], score: 0 });
    rows.get(key).cards.push(card);
    rows.get(key).score += visibility.get(card) || 0;
  });
  const ranked = [...rows.entries()].filter(([, row]) => row.score > .18).sort((a, b) => b[1].score - a[1].score);
  const nextRow = ranked.length ? ranked[0][0] : null;
  if (nextRow === activeRow) return;
  activeRow = nextRow;
  cards.forEach((card) => {
    const video = card.querySelector('video');
    const shouldPlay = !card.hidden && activeRow !== null && Math.round(card.offsetTop) === activeRow;
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

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    cards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.context !== filter;
      if (card.hidden) card.querySelector('video').pause();
    });
    activeRow = null;
    requestAnimationFrame(updatePlayback);
  });
});

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
