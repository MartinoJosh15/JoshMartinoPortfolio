const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const siteHeader = document.querySelector('body > header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');

document.body.classList.add('motion-ready');

if (siteHeader && navToggle && primaryNav) {
  siteHeader.classList.add('nav-enhanced');

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = siteHeader.classList.contains('nav-open');
    siteHeader.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');

    if (restoreFocus && wasOpen) {
      navToggle.focus();
    }
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
}

// Theme preferences follow the visitor between every page.
const themeButton = document.querySelector('.theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton?.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton?.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#171b26' : '#f5f6fa');
}
updateThemeButton();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('jm-theme', theme); } catch { /* A session preference still works. */ }
  updateThemeButton();
  window.dispatchEvent(new Event('themechange'));
});

// The selected-work filters keep real case-study links available without JS.
const workGrid = document.querySelector('.work-grid');
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    if (workGrid) workGrid.dataset.activeFilter = filter;
    const countLabel = document.querySelector('.work-count');
    if (countLabel) countLabel.textContent = `${count} selected project${count === 1 ? '' : 's'}`;
  });
});

const stageDescriptions = [
  'Token and positional embeddings turn a sequence into a representation the model can learn from.',
  'Causal self-attention connects each token to its preceding context, while masking future positions.',
  'A weight-tied language-model head projects hidden states into next-token logits for generation.'
];
const stageTitles = ['Transformer block', 'Causal self-attention', 'Next-token prediction'];
const stageSubtitles = ['Attention is where context becomes meaning.', 'Read the context. Keep the future masked.', 'Project to vocabulary. Generate. Repeat.'];
document.querySelectorAll('[data-stage]').forEach(button => {
  button.addEventListener('click', () => {
    const scene = button.closest('.model-scene');
    const index = Number(button.dataset.stage);
    scene.dataset.stage = String(index);
    scene.querySelector('.stage-description').textContent = stageDescriptions[index];
    scene.querySelector('.layer-front > span:nth-child(2)').replaceChildren(document.createTextNode(stageTitles[index]));
    const subtitle = document.createElement('small');
    subtitle.textContent = stageSubtitles[index];
    scene.querySelector('.layer-front > span:nth-child(2)').append(subtitle);
    scene.querySelectorAll('button[data-stage]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});

// A procedural point-cloud sculpture, drawn locally with no image dependency.
const canvas = document.getElementById('neural-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  const motionButton = document.querySelector('.motion-toggle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motionPreference.matches;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let angle = .35;
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;
  const rings = 32;
  const segments = 66;
  const points = [];
  for (let i = 1; i < rings; i++) {
    const latitude = Math.PI * i / rings;
    for (let j = 0; j < segments; j++) {
      const longitude = 2 * Math.PI * j / segments;
      const ripple = 1 + .075 * Math.sin(longitude * 5 + latitude * 4) * Math.sin(latitude * 3);
      points.push({x: Math.sin(latitude) * Math.cos(longitude) * ripple, y: Math.cos(latitude) * ripple, z: Math.sin(latitude) * Math.sin(longitude) * ripple, ring:i, segment:j});
    }
  }
  function draw() {
    if (!context || !width || !height) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width * .365, height * .405);
    const centerX = width * .5;
    const centerY = height * .49;
    const glow = context.createRadialGradient(centerX, centerY, radius*.2, centerX, centerY, radius*1.5);
    glow.addColorStop(0, dark ? 'rgba(93,110,194,.08)' : 'rgba(119,133,205,.22)');
    glow.addColorStop(1, 'rgba(119,133,205,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    const yaw = angle + pointerX * .14;
    const tilt = -.22 + pointerY * .1;
    const projected = points.map(point => {
      const x = point.x * Math.cos(yaw) - point.z * Math.sin(yaw);
      const z1 = point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
      const y = point.y * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z = point.y * Math.sin(tilt) + z1 * Math.cos(tilt);
      const depth = 3.8 / (3.8 - z);
      return {x:centerX + x * radius * depth, y:centerY + y * radius * depth, z, ring:point.ring, segment:point.segment};
    });
    for (let i = 0; i < projected.length; i++) {
      const point = projected[i];
      const next = projected[point.segment === segments - 1 ? i - segments + 1 : i + 1];
      const alpha = .08 + (point.z + 1.15) * .1;
      context.strokeStyle = dark ? `rgba(135,148,211,${alpha})` : `rgba(65,75,125,${alpha})`;
      context.lineWidth = .55;
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(next.x, next.y);
      if (i + segments < projected.length && point.segment % 2 === 0) {
        context.moveTo(point.x, point.y);
        context.lineTo(projected[i+segments].x, projected[i+segments].y);
      }
      context.stroke();
    }
    projected.sort((a,b) => a.z - b.z).forEach(point => {
      const front = (point.z + 1.2) / 2.4;
      context.fillStyle = dark ? `rgba(151,165,235,${.18 + front*.7})` : `rgba(38,48,100,${.12 + front*.7})`;
      context.beginPath();
      context.arc(point.x, point.y, .5 + front*.75, 0, Math.PI*2);
      context.fill();
      if (point.segment % 17 === 0 && point.ring % 5 === 0 && point.z > 0) {
        context.strokeStyle = dark ? '#b9c5ff' : '#6678bc';
        context.lineWidth = .6;
        context.beginPath();context.arc(point.x,point.y,3.1,0,Math.PI*2);context.stroke();
      }
    });
  }
  function animate(time) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (time - lastTime > 40) {
      angle += Math.min(time-lastTime,80) * .00007;
      lastTime = time;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }
  function updateMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    motionButton.setAttribute('aria-label', paused ? 'Play visualization' : 'Pause visualization');
    motionButton.setAttribute('title', paused ? 'Play visualization' : 'Pause visualization');
    motionButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    if (!paused && visible && !document.hidden) {lastTime = performance.now(); frame = requestAnimationFrame(animate);}
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  if (context) {
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateMotion(); }).observe(canvas);
    canvas.addEventListener('pointermove', event => {
      if (paused || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / width - .5;
      pointerY = (event.clientY - rect.top) / height - .5;
    });
    canvas.addEventListener('pointerleave', () => {pointerX=0;pointerY=0;});
    motionButton.addEventListener('click', () => {paused = !paused; updateMotion();});
    motionPreference.addEventListener('change', event => {paused = event.matches; updateMotion();});
    document.addEventListener('visibilitychange', updateMotion);
    window.addEventListener('themechange', draw);
    resize(); updateMotion();
  }
}

// Reading orientation for the long technical case studies.
const caseSections = document.querySelectorAll('.prose > section[id]');
if (caseSections.length) {
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollPending = false;
  function updateProgress() {
    const available = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${available > 0 ? Math.min(100, scrollY / available * 100) : 0}%`;
    let active = caseSections[0].id;
    caseSections.forEach(section => {if(section.getBoundingClientRect().top < 190) active = section.id;});
    document.querySelectorAll('.case-toc a').forEach(link => {
      if (link.hash === `#${active}`) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {if(!scrollPending) {scrollPending = true; requestAnimationFrame(updateProgress);}}, {passive:true});
  updateProgress();
}

const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const copyEmailButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('.copy-status');

if (copyEmailButton && copyStatus) {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = email;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.className = 'sr-only';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();

        if (!copied) {
          throw new Error('Copy command was unavailable.');
        }
      }

      copyStatus.textContent = 'Email copied.';
      copyEmailButton.textContent = 'Copied';
    } catch (error) {
      copyStatus.textContent = `Copy unavailable. Email: ${email}`;
    }
  });
}
