(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layers = [...document.querySelectorAll('[data-speed]')];
  const bar = document.querySelector('.progress');
  let pending = false;
  function paint() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? y / max * 100 : 0}%`;
    for (const el of layers) {
      if (reduced.matches) { el.style.transform = ''; continue; }
      const rect = el.parentElement.getBoundingClientRect();
      const shift = Math.max(-160, Math.min(160, -rect.top * Number(el.dataset.speed)));
      el.style.transform = `translate3d(0, ${shift}px, 0)${el.classList.contains('identity') ? ' rotate(4deg)' : ''}`;
    }
    pending = false;
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(paint); } }
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) document.documentElement.classList.remove('motion'); schedule(); });
  paint();
})();
