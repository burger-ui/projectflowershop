/* ==========================================================================
   Belle's Flower Shop — shared interactions (jQuery)
   ========================================================================== */
$(function () {

  /* ---------------- Mobile navigation ---------------- */
  const $navToggle = $('#nav-toggle');
  const $mobileNav = $('#mobile-nav');

  $navToggle.on('click', function () {
    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded));
    $mobileNav.toggleClass('hidden', expanded);
    $('#icon-open').toggleClass('hidden', !expanded);
    $('#icon-close').toggleClass('hidden', expanded);
  });

  $mobileNav.find('a').on('click', function () {
    $mobileNav.addClass('hidden');
    $navToggle.attr('aria-expanded', 'false');
    $('#icon-open').removeClass('hidden');
    $('#icon-close').addClass('hidden');
  });

  /* ---------------- Footer year ---------------- */
  $('.current-year').text(new Date().getFullYear());

  /* ---------------- Product filter (Products page) ---------------- */
  const $chips = $('.filter-chip');
  const $cards = $('.product-card');

  // Pre-select a category if the page was reached via a #hash link (e.g. products.html#events)
  if ($chips.length) {
    const hash = window.location.hash.replace('#', '');
    const $match = hash ? $chips.filter('[data-category="' + hash + '"]') : $();
    if ($match.length) {
      $match.trigger('click');
      const target = document.getElementById('shop-grid');
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  $chips.on('click', function () {
    $chips.attr('aria-pressed', 'false');
    $(this).attr('aria-pressed', 'true');
    const category = $(this).data('category');

    $cards.each(function () {
      const match = category === 'all' || $(this).data('category') === category;
      $(this).toggle(match);
    });

    const visibleCount = $cards.filter(':visible').length;
    $('#results-count').text(
      visibleCount === 1 ? '1 arrangement' : visibleCount + ' arrangements'
    );
  });

  /* ---------------- Inquiry modal (Products page) ---------------- */
  const $modal = $('#inquiry-modal');
  const $modalTitle = $('#inquiry-modal-title');
  const $modalItemField = $('#inquiry-item');
  let $lastFocused = null;

  $('.inquire-btn').on('click', function () {
    const item = $(this).data('item');
    $lastFocused = $(this);
    $modalTitle.text('Ask about the ' + item);
    $modalItemField.val(item);
    $modal.removeAttr('hidden');
    $('body').addClass('overflow-hidden');
    $modal.find('input[name="name"]').trigger('focus');
  });

  function closeModal() {
    $modal.attr('hidden', true);
    $('body').removeClass('overflow-hidden');
    if ($lastFocused) $lastFocused.trigger('focus');
  }

  $('#modal-close, .modal-backdrop').on('click', closeModal);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && !$modal.attr('hidden')) closeModal();
  });

  $('#inquiry-form').on('submit', function (e) {
    e.preventDefault();
    $('#inquiry-form-status')
      .text('Thanks — we\u2019ll reply within one business day about the ' + $modalItemField.val() + '.')
      .removeClass('hidden');
    $(this).find('input[type="text"], input[type="email"], textarea').val('');
    setTimeout(closeModal, 1800);
  });

  /* ---------------- Contact form validation ---------------- */
  const $contactForm = $('#contact-form');

  function showError(fieldId, message) {
    $('#' + fieldId + '-error').text(message).removeClass('hidden');
    $('#' + fieldId).attr('aria-invalid', 'true');
  }
  function clearError(fieldId) {
    $('#' + fieldId + '-error').text('').addClass('hidden');
    $('#' + fieldId).removeAttr('aria-invalid');
  }

  $contactForm.on('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const message = $('#message').val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      showError('name', 'Please share your name.');
      valid = false;
    } else clearError('name');

    if (!emailPattern.test(email)) {
      showError('email', 'Enter a valid email address.');
      valid = false;
    } else clearError('email');

    if (message.length < 10) {
      showError('message', 'Tell us a little more (10 characters minimum).');
      valid = false;
    } else clearError('message');

    if (!valid) return;

    $contactForm.addClass('hidden');
    $('#contact-success').removeClass('hidden').trigger('focus');
  });

  /* ---------------- Testimonial rotator (Home page) ---------------- */
  const $testimonials = $('.testimonial-slide');
  let activeSlide = 0;

  if ($testimonials.length) {
    setInterval(function () {
      $testimonials.eq(activeSlide).addClass('hidden');
      activeSlide = (activeSlide + 1) % $testimonials.length;
      $testimonials.eq(activeSlide).removeClass('hidden');
      $('.testimonial-dot').removeClass('bg-plum-dot').eq(activeSlide).addClass('bg-plum-dot');
    }, 5500);

    $('.testimonial-dot').on('click', function () {
      const idx = $(this).index();
      $testimonials.eq(activeSlide).addClass('hidden');
      activeSlide = idx;
      $testimonials.eq(activeSlide).removeClass('hidden');
    });
  }

});
