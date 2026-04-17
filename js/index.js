document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILNÍ MENU ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 2. ACCORDION (Klasické klikání na FAQ) ---
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Zavřít ostatní v rámci stejného kontejneru
            const container = accordionItem.parentElement;
            container.querySelectorAll('.accordion-item').forEach(item => item.classList.remove('active'));
            
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    // --- 3. CIRCLE PROGRESS ANIMACE ---
    const circles = document.querySelectorAll('.progress-ring__circle');
    if (circles.length > 0) {
        const animateCircles = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const radius = circle.r.baseVal.value;
                    const circumference = 2 * Math.PI * radius;
                    const percent = circle.dataset.percent;

                    circle.style.strokeDasharray = `${circumference} ${circumference}`;
                    circle.style.strokeDashoffset = circumference;

                    setTimeout(() => {
                        const offset = circumference - (percent / 100 * circumference);
                        circle.style.strokeDashoffset = offset;
                    }, 100);

                    observer.unobserve(circle);
                }
            });
        };

        const circleObserver = new IntersectionObserver(animateCircles, { threshold: 0.5 });
        circles.forEach(circle => circleObserver.observe(circle));
    }

    // --- 4. TESTIMONIALS SLIDER ---
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;

    if (slides.length > 0 && track) {
        const showSlide = (index) => {
            currentSlide = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
            prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        }
    }

    // --- 5. SMOOTH SCROLL (Interní kotvy) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Pokud je to odkaz na tab v ceníku, smooth scroll ignorujeme (dělá to neplechu)
            if (this.classList.contains('kt-tab-title') || this.classList.contains('tab-btn')) return;

            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- 6. VALIDACE A ODESLÁNÍ FORMULÁŘE (AJAX) ---
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isFormValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                const container = input.closest('.form-group') || input.closest('.form-checkbox');
                const isValid = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';

                if (!isValid) {
                    container.classList.add('has-error');
                    isFormValid = false;
                } else {
                    container.classList.remove('has-error');
                }
            });

            if (isFormValid) {
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button');
                submitBtn.disabled = true;
                contactForm.style.opacity = '0.7';

                fetch('php/send-mail.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        contactForm.reset();
                        contactForm.style.opacity = '0.5';
                    } else {
                        throw new Error('Chyba serveru');
                    }
                })
                .catch(error => {
                    alert('Omlouváme se, zprávu se nepodařilo odeslat.');
                    submitBtn.disabled = false;
                    contactForm.style.opacity = '1';
                });
            }
        });

        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const container = input.closest('.form-group') || input.closest('.form-checkbox');
                if (input.value.trim() !== '' || (input.type === 'checkbox' && input.checked)) {
                    container.classList.remove('has-error');
                }
            });
        });
    }

    // --- 7. AUTOMATICKÉ OTEVŘENÍ FAQ Z URL HASH ---
    const checkHash = () => {
        const hash = window.location.hash;
        if (hash) {
            const targetAccordion = document.querySelector(hash);
            if (targetAccordion && targetAccordion.classList.contains('accordion-item')) {
                document.querySelectorAll('.accordion-item').forEach(item => item.classList.remove('active'));
                targetAccordion.classList.add('active');

                setTimeout(() => {
                    window.scrollTo({
                        top: targetAccordion.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }, 500);
            }
        }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    // --- 8. PŘEPÍNÁNÍ ZÁLOŽEK V CENÍKU ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                const tabPane = document.getElementById(tabId);
                
                if (tabPane) {
                    // Deaktivuj všechny buttony a panely
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                    
                    // Aktivuj kliknutý
                    button.classList.add('active');
                    tabPane.classList.add('active');
                }
            });
        });
    }

}); // Konec DOMContentLoaded