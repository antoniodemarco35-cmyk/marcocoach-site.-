// script.js — Marco Coach Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const contactForm = document.getElementById('contact-form');
    const formContainer = document.querySelector('.contact-form');

    // 1. Sticky Nav on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // 4. Pricing Toggle Logic
    const pricingToggle = document.getElementById('pricing-toggle');
    const labelMonthly = document.getElementById('toggle-label-monthly');
    const labelPrepaid = document.getElementById('toggle-label-prepaid');
    const priceNums = document.querySelectorAll('.price-value-num');
    const pricePeriods = document.querySelectorAll('.price-period');

    const prices = {
      monthly: [35, 50, 70],
      trimestrale: [32, 46, 64],
      semestrale: [29, 41, 58],
      annuale: [25, 36, 50]
    };

    if (pricingToggle) {
      pricingToggle.addEventListener('click', () => {
        const isActive = pricingToggle.classList.toggle('active');
        pricingToggle.setAttribute('aria-checked', isActive);

        labelMonthly.classList.toggle('toggle-active', !isActive);
        labelPrepaid.classList.toggle('toggle-active', isActive);

        priceNums.forEach((el, i) => {
          const target = isActive ? prices.annuale[i] : prices.monthly[i];
          const current = parseInt(el.textContent);
          
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.textContent = target;
          } else {
            animateValue(el, current, target, 400);
          }
        });

        pricePeriods.forEach(el => {
          el.textContent = isActive ? '/mese (annuale)' : '/mese';
        });
      });
    }

    // 5. Form Handling (Netlify integration helper + success message)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Manual validation check for required fields
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const name = document.getElementById('name').value;

            if (!email || !phone || !name) {
                alert('Compila tutti i campi obbligatori');
                return;
            }
            
            const formData = new FormData(contactForm);
            
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                formContainer.innerHTML = `
                    <div class="form-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #52b788; margin-bottom: 20px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <h3>Grazie!</h3>
                        <p>Il tuo messaggio è stato inviato correttamente. Ti contatterò entro 24 ore per confermare la tua call.</p>
                    </div>
                `;
            })
            .catch((error) => alert('Errore nell\'invio del form: ' + error));
        });
    }

    // 6. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner) {
      if (localStorage.getItem('cookie-consent')) {
        cookieBanner.classList.add('hidden');
      }

      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        cookieBanner.classList.add('hidden');
      });

      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        cookieBanner.classList.add('hidden');
      });
    }

    // 7. Scroll Reveal Animation Logic
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Once visible, stop observing to save resources
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slight delay to feel more natural
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }

    // 8. Count Up Animation for Prices
    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    const priceNumsToAnimate = document.querySelectorAll('.price-value-num');
    if (priceNumsToAnimate.length > 0) {
        const priceNumObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetValue = parseInt(el.textContent);
                    
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        animateValue(el, 0, targetValue, 800);
                    }
                    priceNumObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        priceNumsToAnimate.forEach(num => priceNumObserver.observe(num));
    }
});
