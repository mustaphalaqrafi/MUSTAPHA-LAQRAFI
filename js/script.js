const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const siteHeader = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top-float');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionLinks = [...document.querySelectorAll('main section[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    primaryNav.classList.remove('is-open');
}

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
        primaryNav.classList.toggle('is-open', !isOpen);
    });

    primaryNav.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (event) => {
        if (!siteHeader.contains(event.target)) closeMenu();
    });
}

const updateScrollState = () => {
    const scrollPosition = window.scrollY + 140;
    siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
    backToTop?.classList.toggle('is-visible', window.scrollY > 560);

    let activeSection = 'home';
    for (const section of sectionLinks) {
        if (section.offsetTop <= scrollPosition) activeSection = section.id;
    }

    for (const link of navLinks) {
        const isActive = link.getAttribute('href') === `#${activeSection}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }
};

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();

const revealElements = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
}

const typedRole = document.getElementById('typedRole');
if (typedRole && !reducedMotion) {
    const roles = ['Full Stack Developer', 'Frontend Developer', 'Web Developer', 'Creative Coder'];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = false;

    const typeNext = () => {
        const currentRole = roles[roleIndex];
        characterIndex += deleting ? -1 : 1;
        typedRole.textContent = currentRole.slice(0, characterIndex);

        let delay = deleting ? 38 : 72;
        if (!deleting && characterIndex === currentRole.length) {
            deleting = true;
            delay = 1450;
        } else if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 280;
        }

        window.setTimeout(typeNext, delay);
    };

    window.setTimeout(typeNext, 1800);
}

const linkedinLink = document.querySelector('[data-linkedin-url]');
if (linkedinLink) {
    const profileUrl = linkedinLink.dataset.linkedinUrl.trim();
    if (profileUrl) {
        linkedinLink.href = profileUrl;
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
        linkedinLink.setAttribute('aria-label', 'LinkedIn profile');
        linkedinLink.removeAttribute('aria-disabled');
        linkedinLink.removeAttribute('title');
    } else {
        linkedinLink.setAttribute('aria-disabled', 'true');
    }
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formFields = [...(contactForm?.querySelectorAll('input, textarea') ?? [])];

function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

formFields.forEach((field) => {
    field.addEventListener('input', () => {
        field.removeAttribute('aria-invalid');
        if (formStatus?.classList.contains('error')) setFormStatus('', '');
    });
});

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formFields.forEach((field) => field.removeAttribute('aria-invalid'));

    if (!name || !email || !subject || !message) {
        const firstMissing = formFields.find((field) => !field.value.trim());
        firstMissing?.setAttribute('aria-invalid', 'true');
        firstMissing?.focus();
        setFormStatus('Please complete every field before preparing your email.', 'error');
        return;
    }

    if (!emailIsValid) {
        document.getElementById('email')?.setAttribute('aria-invalid', 'true');
        document.getElementById('email')?.focus();
        setFormStatus('Enter a valid email address so you can receive a reply.', 'error');
        return;
    }

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(`From: ${name}\nReply to: ${email}\n\n${message}`);
    setFormStatus('Your email app should open with a draft. The message is sent only after you send it there.', 'success');
    window.location.href = `mailto:mostaphalaqrafi3@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});