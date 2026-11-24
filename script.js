(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = $('#mobileToggle');
  const nav = $('#mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      toggle.innerHTML = `<svg><use href="#${isOpen ? 'i-menu' : 'i-close'}"></use></svg>`;
      nav.classList.toggle('nav-open', !isOpen);
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.innerHTML = '<svg><use href="#i-menu"></use></svg>';
    }));
  }

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const phases = [
    { registration: '₹1', caption: 'Introductory launch offer · Months 1–3', basic: '₹100', plus: '₹200', premium: '₹300' },
    { registration: '₹499', caption: 'Growth phase · Months 4–6', basic: '₹299', plus: '₹599', premium: '₹999' },
    { registration: '₹999', caption: 'Scale phase · Months 7–9', basic: '₹499', plus: '₹999', premium: '₹1,999' },
    { registration: '₹2,000', caption: 'Standard pricing · Month 10 onward', basic: '₹799', plus: '₹1,499', premium: '₹2,999' }
  ];
  const phaseButtons = $$('.phase-button');
  const setPhase = index => {
    const phase = phases[index]; if (!phase) return;
    phaseButtons.forEach(button => {
      const active = Number(button.dataset.phase) === index;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    [['#registrationPrice', phase.registration], ['#phaseCaption', phase.caption], ['#basicPrice', phase.basic], ['#plusPrice', phase.plus], ['#premiumPrice', phase.premium]].forEach(([selector, value]) => {
      const node = $(selector); if (node) node.textContent = value;
    });
  };
  phaseButtons.forEach(button => button.addEventListener('click', () => setPhase(Number(button.dataset.phase))));

  const otherForm = $('#otherServiceForm');
  const queryParams = new URLSearchParams(window.location.search);
  const interestParam = queryParams.get('interest');
  const otherInterest = $('#otherInterest');
  if (interestParam && otherInterest) {
    const match = [...otherInterest.options].find(option => option.value === interestParam || option.text === interestParam);
    if (match) otherInterest.value = match.value;
  }
  if (otherForm) otherForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!otherForm.reportValidity()) return;
    const status = $('#otherFormStatus');
    if (status) { status.hidden = false; status.textContent = 'This website is not connected to the official enquiry inbox yet. Your details have NOT been sent or saved. The other-services enquiry system will be activated before public launch.'; }
  });

  const requestForm = $('#screeningForm');
  if (requestForm) requestForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!requestForm.reportValidity()) return;
    const status = $('#formStatus');
    if (status) {
      status.hidden = false;
      status.textContent = 'This website is not connected to the official enquiry inbox yet. Your details have NOT been sent or saved. Please contact PROPERTY SCREEN directly once official contact details are published.';
    }
  });

  $$('[data-plan]').forEach(link => link.addEventListener('click', () => {
    const form = $('#screeningForm');
    if (!form) return;
    let details = $('[name="details"]', form);
    if (details) details.value = `I would like to know about the ${link.dataset.plan} plan. Please explain the proposed visit frequency, checklist and deliverables.`;
  }));

  // Light pointer parallax for the hero image; disabled on touch and reduced-motion devices.
  const visual = $('.hero-visual');
  if (visual && matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let frame = 0;
    visual.addEventListener('pointermove', event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        const image = $('.hero-image', visual);
        if (image) image.style.transform = `scale(1.09) translate(${x * -9}px, ${y * -7}px)`;
      });
    });
    visual.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      const image = $('.hero-image', visual); if (image) image.style.transform = '';
    });
  }


  // Reading progress indicator and subtle sticky-header state.
  const progressBar = $('#scrollProgressBar');
  const header = $('.site-header');
  let scrollTick = false;
  const updateScrollUI = () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
      scrollTick = false;
    });
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  // The homepage explainer GIF loops automatically, with a pause control.
  // The hero CTA scrolls to the bottom explainer and starts/restarts the sequence.
  const screeningAnimation = $('#screeningAnimation');
  const motionToggle = $('#toggleFilmMotion');
  const filmSection = $('#screening-film');
  if (screeningAnimation && motionToggle) {
    const animationSrc = screeningAnimation.dataset.animationSrc;
    const posterSrc = screeningAnimation.dataset.posterSrc;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let paused = reduceMotion;

    const applyFilmState = (shouldPause, restart = false) => {
      paused = shouldPause;
      screeningAnimation.loading = 'eager';
      if (paused) {
        screeningAnimation.src = posterSrc;
      } else {
        screeningAnimation.src = restart ? `${animationSrc}?play=${Date.now()}` : animationSrc;
      }
      motionToggle.textContent = paused ? 'Play animation' : 'Pause animation';
      motionToggle.setAttribute('aria-pressed', String(paused));
    };

    if (paused) applyFilmState(true);
    motionToggle.addEventListener('click', () => applyFilmState(!paused, !paused));

    $$('[data-watch-film]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      if (filmSection) {
        filmSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        window.history.replaceState(null, '', '#screening-film');
      }
      // Clicking this CTA is an intentional request to watch the animated explainer.
      applyFilmState(false, true);
    }));
  }

})();
