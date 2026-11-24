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

  // Kinetic typography: split headings into individual characters so each
  // letter arrives with a staggered 3D flip. The original text remains exposed
  // to assistive technology through aria-label.
  const kineticSelectors = [
    '.hero-title', '.problem-intro h2', '.section-heading-row h2',
    '.owner-copy h2', '.request-copy h2', '.other-hook h2', '.film-heading h2',
    '.check-card h3', '.process-step h3', '.film-story-step h3'
  ];
  const kineticNodes = kineticSelectors.flatMap(selector => $$(selector));
  const prepareKineticNode = element => {
    if (element.dataset.kineticReady === 'true') return;
    const spokenText = (element.textContent || '').replace(/\s+/g, ' ').trim();
    if (!spokenText) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.trim() && !node.parentElement?.closest('.kinetic-char')) textNodes.push(node);
    }
    let charIndex = 0;
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      const pieces = node.nodeValue.match(/\s+|[^\s]+/g) || [];
      pieces.forEach(piece => {
        if (/^\s+$/.test(piece)) {
          fragment.append(document.createTextNode(piece));
          return;
        }
        const word = document.createElement('span');
        word.className = 'kinetic-word';
        [...piece].forEach(character => {
          const letter = document.createElement('span');
          letter.className = 'kinetic-char';
          letter.style.setProperty('--char-i', charIndex);
          letter.style.setProperty('--char-delay', `${charIndex * 13}ms`);
          charIndex += 1;
          letter.textContent = character;
          word.append(letter);
        });
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });
    element.classList.add('kinetic-heading');
    element.setAttribute('aria-label', spokenText);
    element.dataset.kineticReady = 'true';
  };
  kineticNodes.forEach(prepareKineticNode);

  const heroKinetic = $('.hero-title');
  if (heroKinetic) requestAnimationFrame(() => heroKinetic.classList.add('is-kinetic-active'));
  const kineticObserver = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-kinetic-active');
          kineticObserver.unobserve(entry.target);
        }
      }), {threshold: 0.34, rootMargin: '0px 0px -7% 0px'})
    : null;
  kineticNodes.forEach(element => {
    if (element === heroKinetic) return;
    if (kineticObserver) kineticObserver.observe(element);
    else element.classList.add('is-kinetic-active');
  });

  // Pointer depth is applied only to the isometric parcel. The hero photograph
  // remains fixed, avoiding the camera-shake effect seen in earlier versions.
  const visual = $('.hero-visual');
  const parcel3D = $('#hero3DParcel');
  if (visual && parcel3D && matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let frame = 0;
    visual.addEventListener('pointermove', event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        parcel3D.style.transform = `translate(-50%,-50%) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateZ(18px)`;
      });
    });
    visual.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      parcel3D.style.transform = '';
    });
  }


  // Reading progress indicator and subtle sticky-header state.
  const progressBar = $('#scrollProgressBar');
  const header = $('.site-header');
  const checkReelRoot = $('[data-check-reel]');
  const checkReelSticky = $('.check-reel-sticky', checkReelRoot || document);
  const checkReelViewport = $('.check-reel-viewport', checkReelRoot || document);
  const checkReelTrack = $('.check-reel-track', checkReelRoot || document);
  const checkReelCards = $$('[data-check-card]', checkReelRoot || document);
  const checkReelCurrent = $('#checkReelCurrent');
  const checkReelCurrentLabel = $('#checkReelCurrentLabel');
  const checkReelProgress = $('#checkReelProgress');
  const desktopReel = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  let mobileCheckObserver = null;

  // SELENE-inspired scroll choreography: a four-card field-check reel moves
  // horizontally as the visitor scrolls vertically. Only DOM styles are
  // updated inside the existing rAF scroll pass; no layout framework or
  // second animation loop is introduced.
  const updateCheckReel = () => {
    if (!checkReelRoot || !checkReelSticky || !checkReelViewport || !checkReelTrack || !checkReelCards.length) return;
    if (!desktopReel.matches) {
      checkReelTrack.style.transform = '';
      checkReelTrack.style.paddingLeft = '';
      checkReelTrack.style.paddingRight = '';
      if (!mobileCheckObserver && 'IntersectionObserver' in window) {
        mobileCheckObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            entry.target.classList.toggle('is-active', entry.isIntersecting);
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              const title = $('h3', entry.target);
              if (title) title.classList.add('is-kinetic-active');
            }
            else entry.target.removeAttribute('aria-current');
          });
          const visible = checkReelCards.filter(card => card.classList.contains('is-active'));
          if (visible.length) {
            const focusY = window.innerHeight * 0.56;
            const nearest = visible.reduce((best, card) => {
              const rect = card.getBoundingClientRect();
              const distance = Math.abs(rect.top + rect.height / 2 - focusY);
              return !best || distance < best.distance ? {card, distance} : best;
            }, null);
            checkReelCards.forEach(card => card.removeAttribute('aria-current'));
            nearest.card.setAttribute('aria-current', 'step');
            const index = checkReelCards.indexOf(nearest.card);
            if (checkReelCurrent) checkReelCurrent.textContent = String(index + 1).padStart(2, '0');
            if (checkReelCurrentLabel) checkReelCurrentLabel.textContent = nearest.card.dataset.checkTitle || '';
          }
        }, {threshold: 0.22, rootMargin: '-10% 0px -14% 0px'});
        checkReelCards.forEach(card => mobileCheckObserver.observe(card));
      } else {
        checkReelCards.forEach(card => card.classList.add('is-active', 'is-visible'));
      }
      if (checkReelProgress) checkReelProgress.style.transform = 'scaleX(0)';
      return;
    }
    if (mobileCheckObserver) {
      mobileCheckObserver.disconnect();
      mobileCheckObserver = null;
    }

    const viewportWidth = checkReelViewport.clientWidth;
    const firstCardWidth = checkReelCards[0].getBoundingClientRect().width;
    const gapValue = getComputedStyle(checkReelTrack).columnGap || getComputedStyle(checkReelTrack).gap;
    const gap = Number.parseFloat(gapValue) || 18;
    const sideInset = Math.max(0, (viewportWidth - firstCardWidth) / 2);
    checkReelTrack.style.paddingLeft = `${sideInset}px`;
    checkReelTrack.style.paddingRight = `${sideInset}px`;

    const rect = checkReelRoot.getBoundingClientRect();
    const travelRange = Math.max(1, checkReelRoot.offsetHeight - checkReelSticky.offsetHeight);
    const stickyTop = 108;
    const progress = Math.min(1, Math.max(0, (stickyTop - rect.top) / travelRange));
    const travel = Math.max(0, (firstCardWidth + gap) * (checkReelCards.length - 1));
    checkReelTrack.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;

    const activeIndex = Math.min(checkReelCards.length - 1, Math.round(progress * (checkReelCards.length - 1)));
    checkReelCards.forEach((card, index) => {
      const active = index === activeIndex;
      card.classList.toggle('is-active', active);
      card.classList.add('is-visible');
      const title = $('h3', card);
      if (title && active) title.classList.add('is-kinetic-active');
      if (active) card.setAttribute('aria-current', 'step');
      else card.removeAttribute('aria-current');
    });
    if (checkReelProgress) checkReelProgress.style.transform = `scaleX(${progress})`;
    if (checkReelCurrent) checkReelCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
    if (checkReelCurrentLabel) checkReelCurrentLabel.textContent = checkReelCards[activeIndex].dataset.checkTitle || '';
  };

  let scrollTick = false;
  const updateScrollUI = () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
      updateCheckReel();
      // Draw the four-step process rail as the process section enters view.
      const processSection = $('.process-section');
      const routeLine = $('#processRouteLine');
      const routeBeacon = $('#processRouteBeacon');
      if (processSection && routeLine && routeBeacon && !matchMedia('(max-width:900px)').matches) {
        const processRect = processSection.getBoundingClientRect();
        const span = Math.max(1, processRect.height + window.innerHeight * .35);
        const routeProgress = Math.min(1, Math.max(0, (window.innerHeight * .72 - processRect.top) / span));
        routeLine.style.transform = `scaleX(${routeProgress})`;
        routeBeacon.style.left = `${routeProgress * 100}%`;
      }
      scrollTick = false;
    });
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  if (desktopReel.addEventListener) desktopReel.addEventListener('change', updateScrollUI);
  updateScrollUI();

  // The hero CTA is a user gesture: start the narrated MP4, then scroll to the player.
  // Calling play() directly in the click handler preserves browser audio-playback permissions.
  const screeningVideo = $('#screeningVideo');
  const filmSection = $('#screening-film');
  const filmStatus = $('#filmPlaybackStatus');
  const restartFilm = $('#restartFilm');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setFilmStatus = message => {
    if (filmStatus) filmStatus.textContent = message;
  };

  if (screeningVideo) {
    screeningVideo.addEventListener('play', () => setFilmStatus('Now playing: English voice narration and visual walkthrough. Use the video controls to pause or adjust volume.'));
    screeningVideo.addEventListener('pause', () => {
      if (!screeningVideo.ended && screeningVideo.currentTime > 0) setFilmStatus('Video paused. Press play to continue the explanation.');
    });
    screeningVideo.addEventListener('ended', () => setFilmStatus('You have reached the end of the PROPERTY SCREEN explainer. Replay it whenever you need.'));
    screeningVideo.addEventListener('error', () => setFilmStatus('The video could not be loaded. Please refresh the page or use the direct video link below the player.'));

    $$('[data-watch-film]').forEach(button => button.addEventListener('click', event => {
      event.preventDefault();
      // Start playback immediately while the click is still a trusted user action.
      const playAttempt = screeningVideo.play();
      if (filmSection) filmSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#screening-film');
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => setFilmStatus('Your browser blocked automatic playback. Press the play button on the video to start the narration.'));
      }
    }));

    if (restartFilm) restartFilm.addEventListener('click', () => {
      screeningVideo.currentTime = 0;
      const playAttempt = screeningVideo.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => setFilmStatus('Press play on the video to replay the narrated explanation.'));
      }
    });
  }

})();
