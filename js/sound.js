/**
 * sound.js
 */

function playSound(type) {
  const map = {
    success: 'soundSuccess',
    duplicate: 'soundDuplicate',
    error: 'soundError'
  };
  const el = document.getElementById(map[type]);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {
    // browser kadang blok autoplay sebelum ada interaksi user pertama kali; itu wajar
  });
}
