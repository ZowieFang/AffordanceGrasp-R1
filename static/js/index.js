const copyButton = document.getElementById('copyBtn');

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const citation = document.getElementById('bibtex').innerText;
    try {
      await navigator.clipboard.writeText(citation);
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1400);
    } catch (error) {
      copyButton.textContent = 'Select text';
    }
  });
}

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  const useFallback = () => {
    const fallback = image.dataset.fallback;
    if (fallback && image.getAttribute('src') !== fallback) image.src = fallback;
  };
  image.addEventListener('error', useFallback, { once: true });
  if (image.complete && image.naturalWidth === 0) useFallback();
});

const videoCards = document.querySelectorAll('[data-video-card]');

videoCards.forEach((card) => {
  const video = card.querySelector('video');
  if (!video) return;
  video.muted = true;
  video.loop = true;
  video.defaultPlaybackRate = 2;
  video.playbackRate = 2;

  const markVideoReady = () => {
    video.playbackRate = 2;
    card.classList.add('video-ready');
  };

  if (video.readyState >= 1) {
    markVideoReady();
  } else {
    video.addEventListener('loadedmetadata', markVideoReady, { once: true });
  }
});

if ('IntersectionObserver' in window) {
  const visibility = new Map();
  let activeRow = null;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visibility.set(entry.target, entry.intersectionRatio);
    });

    const rows = new Map();
    videoCards.forEach((card) => {
      const rowKey = Math.round(card.offsetTop);
      if (!rows.has(rowKey)) rows.set(rowKey, { cards: [], score: 0 });
      const row = rows.get(rowKey);
      row.cards.push(card);
      row.score += visibility.get(card) || 0;
    });

    const visibleRows = [...rows.entries()].filter(([, row]) => row.score > 0.15);
    visibleRows.sort((a, b) => b[1].score - a[1].score);
    const nextRow = visibleRows.length ? visibleRows[0][0] : null;

    if (nextRow !== activeRow) {
      activeRow = nextRow;
      videoCards.forEach((card) => {
        const video = card.querySelector('video');
        if (!video) return;
        const belongsToActiveRow = activeRow !== null && Math.round(card.offsetTop) === activeRow;
        if (belongsToActiveRow) {
          video.playbackRate = 2;
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }
  }, { threshold: [0, 0.15, 0.35, 0.6, 0.85] });

  videoCards.forEach((card) => videoObserver.observe(card));
}
