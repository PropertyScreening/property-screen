(() => {
  const menuToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  const interestSelect = document.getElementById('interest');
  const detailsField = document.getElementById('details');
  const formStatus = document.getElementById('formStatus');

  // Set the current year in the footer.
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // Accessible mobile navigation.
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    menuToggle.innerHTML = `<svg width="24" height="24"><use href="#${isOpen ? 'i-menu' : 'i-close'}"></use></svg>`;
    nav.classList.toggle('nav-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.innerHTML = '<svg width="24" height="24"><use href="#i-menu"></use></svg>';
  }));

  function focusEnquiry(value) {
    interestSelect.value = value;
    document.getElementById('get-started').scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => interestSelect.focus({ preventScroll: true }), 450);
  }

  document.querySelectorAll('[data-interest]').forEach((button) => {
    button.addEventListener('click', () => focusEnquiry(button.dataset.interest));
  });

  document.querySelectorAll('[data-location]').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('searchLocation').value = button.dataset.location;
      document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Search is an enquiry-preference helper until live listings and a database are connected.
  document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const location = document.getElementById('searchLocation').value;
    const propertyType = document.getElementById('propertyType').value;
    const budget = document.getElementById('budget').value;
    focusEnquiry('I am looking to buy');
    detailsField.value = `Please contact me about ${propertyType.toLowerCase()} in ${location}. Budget: ${budget}.`;
  });

  // This form is intentionally not connected to a fake inbox. It will be activated after
  // the business domain and real mailbox / form endpoint have been configured.
  document.getElementById('leadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    formStatus.hidden = false;
    formStatus.textContent = 'Thank you. The enquiry form is in preview mode and is not yet sending or saving submissions. We will activate it after the official PROPERTY SCREEN email and enquiry system are configured.';
  });
})();
