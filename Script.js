// js/script.js
// Combined script: nav toggle, dynamic services + search, lightbox, form validation + mailto
(function () {
  // Helper
  function $ (id) { return document.getElementById(id); }
  function onDOM(fn) { document.addEventListener('DOMContentLoaded', fn); }

  // ---------- Mobile nav toggle ----------
  function initNavToggle() {
    var btn = $('navToggle');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) {
      // try alternative selector for pages that used navToggle with different id
      btn = document.querySelector('.nav-toggle');
      nav = document.querySelector('.site-nav');
    }
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // ---------- Dynamic Services & Search ----------
  var services = [
    {
      id: 1,
      title: 'Emergency Repairs',
      desc: '24/7 response to burst pipes, leaks and blockages.',
      img: 'images/desktop.png'
    },
    {
      id: 2,
      title: 'Installations',
      desc: 'Professional installation of geysers, taps, toilets and sinks.',
      img: 'images/desktop.png'
    },
    {
      id: 3,
      title: 'Maintenance',
      desc: 'Scheduled maintenance to keep plumbing systems running smoothly.',
      img: 'images/desktop.png'
    }
  ];

  function createServiceCard(s) {
    var article = document.createElement('article');
    article.className = 'service-card';
    article.innerHTML = ''
      + '<picture><img src="' + s.img + '" alt="' + s.title + '" class="responsive-img"></picture>'
      + '<h3>' + s.title + '</h3>'
      + '<p>' + s.desc + '</p>'
      + '<p><a href="contact.html" class="btn">Request Service</a> <a href="' + s.img + '" data-lightbox="gallery" data-title="' + s.title + '" class="btn btn-secondary">View</a></p>';
    return article;
  }

  function populateServices() {
    var grid = $('servicesGrid');
    if (grid) {
      grid.innerHTML = '';
      services.forEach(function (s) { grid.appendChild(createServiceCard(s)); });
    }
    var featured = $('featuredServices');
    if (featured) {
      featured.innerHTML = '';
      services.slice(0,3).forEach(function (s) { featured.appendChild(createServiceCard(s)); });
    }
  }

  function initSearch() {
    var input = $('serviceSearch');
    if (!input) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var grid = $('servicesGrid');
      if (!grid) return;
      grid.innerHTML = '';
      services.filter(function (s) {
        return s.title.toLowerCase().indexOf(q) !== -1 || s.desc.toLowerCase().indexOf(q) !== -1;
      }).forEach(function (s) { grid.appendChild(createServiceCard(s)); });
    });
  }

  // ---------- Lightbox (simple) ----------
  function initLightbox() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      var src = a.getAttribute('href');
      var title = a.getAttribute('data-title') || (a.querySelector('img') && a.querySelector('img').alt) || '';
      var overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.85)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 9999;
      overlay.innerHTML = '<div style="max-width:95%;max-height:90%;text-align:center"><img src="' + src + '" alt="' + title + '" style="max-width:100%;max-height:85vh;border-radius:6px"><div style="margin-top:10px;color:#fff">' + (title || '') + '</div></div>';
      overlay.addEventListener('click', function (ev) { if (ev.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    });
  }

  // ---------- Form validation + mailto ----------
  function showFormErrors(errors) {
    var box = $('formErrors');
    if (!box) return;
    if (!errors || errors.length === 0) { box.style.display = 'none'; box.innerHTML = ''; return; }
    box.style.display = 'block';
    box.innerHTML = '<ul style="padding-left:18px;margin:0;">' + errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>';
  }

  function validateFormFields() {
    var errs = [];
    var name = $('name') ? $('name').value.trim() : '';
    var email = $('email') ? $('email').value.trim() : '';
    var phone = $('phone') ? $('phone').value.trim() : '';
    var subject = $('subject') ? $('subject').value.trim() : '';
    var message = $('message') ? $('message').value.trim() : '';

    if (name.length < 2) errs.push('Please enter your full name (min 2 characters).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Please enter a valid email address.');
    if (phone && !/^[0-9+()\- \s]{7,20}$/.test(phone)) errs.push('Please enter a valid phone number or leave blank.');
    if (!subject || subject.length === 0) errs.push('Please enter a subject.');
    if (message.length < 5) errs.push('Message must be at least 5 characters.');

    return errs;
  }

  function initForm() {
    var form = $('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = validateFormFields();
      showFormErrors(errs);
      if (errs.length) return;

      var to = 'info@quickfixplumbing.com.au';
      var name = encodeURIComponent($('name').value.trim());
      var email = encodeURIComponent($('email').value.trim());
      var phone = encodeURIComponent($('phone').value.trim());
      var subject = encodeURIComponent($('subject').value.trim() || 'Website enquiry');
      var message = encodeURIComponent($('message').value.trim());

      var body = 'Name: ' + name + '%0AEmail: ' + email + '%0APhone: ' + phone + '%0A%0AMessage:%0A' + message;
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

      var box = $('formErrors');
      if (box) { box.style.display = 'block'; box.innerHTML = '<strong>Note:</strong> Your email client should open. If not, send an email to info@quickfixplumbing.com.au'; }
    });
  }

  // ---------- Init on DOM ready ----------
  onDOM(function () {
    initNavToggle();
    populateServices();
    initSearch();
    initLightbox();
    initForm();
  });

})(); // end combined script
