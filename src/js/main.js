/* Your JS here. */
'use strict';

const navEl = document.getElementById('navbar');
const progressEl = document.querySelector('.scrollbar__bar');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = navLinks.map(a => document.getElementById(a.dataset.section));
const yearEl = document.getElementById('year');

function updateScrollUI() {
  const y = window.scrollY || 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (y / max) * 100 : 0;
  if (progressEl) progressEl.style.width = `${percent}%`;
  if (navEl) navEl.classList.toggle('shrink', y > 4);
}

function updateActiveLink() {
  if (!navEl || sections.length === 0) return;
  const navBottom = navEl.getBoundingClientRect().bottom;
  let idx = sections.findIndex(sec => sec && sec.getBoundingClientRect().top >= navBottom - 1);
  if (idx === -1) idx = sections.length - 1;
  navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateScrollUI();
    updateActiveLink();
    ticking = false;
  });
}

window.addEventListener('load', () => {
  updateScrollUI();
  updateActiveLink();
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateActiveLink);
document.querySelectorAll('a.nav-link').forEach(a => {
  a.addEventListener('click', () => setTimeout(updateActiveLink, 200));
});

(function initCarousel() {
  const track = document.querySelector('.carousel__track');
  const slides = Array.from(document.querySelectorAll('.carousel__slide'));
  const prevBtn = document.querySelector('.carousel .prev');
  const nextBtn = document.querySelector('.carousel .next');
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  let index = 0;
  function go(to) {
    index = (to + slides.length) % slides.length;
    const offset = -index * track.clientWidth;
    track.style.transform = `translateX(${offset}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
  }

  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));
  window.addEventListener('resize', () => go(index));
  window.addEventListener('load', () => go(0));
})();

(function initModal() {
  const openers = document.querySelectorAll('[data-open-modal]');
  const closers = document.querySelectorAll('[data-close-modal]');
  let openModalEl = null;

  function openModal(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('is-open');
    openModalEl = el;
    const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || el).focus();
  }

  function closeModal() {
    if (!openModalEl) return;
    openModalEl.classList.remove('is-open');
    openModalEl = null;
  }

  openers.forEach(btn => btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal'))));
  closers.forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.addEventListener('click', e => {
    if (!openModalEl) return;
    if (e.target === openModalEl || e.target.classList.contains('modal__backdrop')) closeModal();
  });
})();
