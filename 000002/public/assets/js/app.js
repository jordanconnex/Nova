const initializeApp = () => {
    const toast = document.querySelector('#toast');
    const notify = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => toast.classList.remove('visible'), 2800);
    };
    const stripeRequest = async (endpoint, payload) => {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erreur Stripe');
        return data;
    };
    const ensureStripeConfigured = async () => {
        const response = await fetch('/api/stripe/config');
        const data = await response.json();
        if (!data.configured) throw new Error('Stripe est encore en configuration.');
    };
    document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    }));
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`).then((response) => response.json()).then((data) => {
        if (data.customerId) window.localStorage.setItem('novaStripeCustomerId', data.customerId);
    }).catch(() => undefined);
    document.querySelectorAll('[data-toggle]').forEach((button) => button.addEventListener('click', () => {
        const target = document.querySelector(button.dataset.toggle);
        target?.classList.toggle('is-open');
        button.setAttribute('aria-expanded', target?.classList.contains('is-open') || false);
    }));
    document.querySelectorAll('[data-tabs]').forEach((tabs) => tabs.querySelectorAll('[data-tab]').forEach((tab) => tab.addEventListener('click', () => {
        tabs.querySelectorAll('[data-tab]').forEach((item) => item.classList.remove('active'));
        tabs.parentElement.querySelectorAll('[data-panel]').forEach((panel) => panel.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`#${tab.dataset.tab}`)?.classList.add('active');
    })));
    document.querySelectorAll('[data-faq]').forEach((item) => item.addEventListener('click', () => item.classList.toggle('is-open')));
    document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => {
        button.classList.toggle('active');
        button.textContent = button.classList.contains('active') ? '♥' : '♡';
        notify(button.classList.contains('active') ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
    }));
    document.querySelectorAll('.project-filters button').forEach((filter) => filter.addEventListener('click', () => {
        document.querySelectorAll('.project-filters button').forEach((item) => item.classList.remove('active'));
        filter.classList.add('active');
        document.querySelectorAll('.project-card').forEach((project) => {
            project.hidden = filter.dataset.tab !== 'all' && project.dataset.projectStatus !== filter.dataset.tab;
        });
    }));
    document.querySelectorAll('form[data-feedback]').forEach((form) => form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        form.reset();
        notify(form.dataset.feedback || 'Votre demande a bien été envoyée.');
    }));
    document.querySelectorAll('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
        const input = document.querySelector(button.dataset.passwordToggle);
        input.type = input.type === 'password' ? 'text' : 'password';
        button.textContent = input.type === 'password' ? 'Afficher' : 'Masquer';
    }));
    document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
        await navigator.clipboard?.writeText(button.dataset.copy);
        notify('Lien copié dans le presse-papiers');
    }));
    document.querySelectorAll('[data-modal-open]').forEach((button) => button.addEventListener('click', () => document.querySelector(button.dataset.modalOpen)?.classList.add('is-open')));
    document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', () => document.querySelector(button.dataset.modalClose)?.classList.remove('is-open')));
    document.querySelectorAll('[data-range-output]').forEach((range) => range.addEventListener('input', () => document.querySelector(range.dataset.rangeOutput).textContent = range.value));
    document.querySelectorAll('[data-stripe-checkout]').forEach((button) => button.addEventListener('click', async () => {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Ouverture du paiement...';
        try {
            await ensureStripeConfigured();
            const { url } = await stripeRequest('/api/stripe/checkout', { plan: button.dataset.stripeCheckout });
            window.location.href = url;
        } catch (error) {
            notify(error.message);
            button.disabled = false;
            button.textContent = button.dataset.originalText;
        }
    }));
    document.querySelector('[data-publish-subscription]')?.addEventListener('click', async () => {
        const customerId = window.localStorage.getItem('novaStripeCustomerId');
        if (!customerId) {
            window.location.href = 'premium.html';
            return;
        }
        notify('Abonnement actif. Votre site est prêt à être publié.');
    });
    document.querySelectorAll('[data-stripe-portal]').forEach((button) => button.addEventListener('click', async () => {
        try {
            await ensureStripeConfigured();
            const customerId = window.localStorage.getItem('novaStripeCustomerId');
            if (!customerId) throw new Error('Aucun abonnement Stripe associé à ce compte.');
            const { url } = await stripeRequest('/api/stripe/portal', { customerId });
            window.location.href = url;
        } catch (error) {
            notify(error.message);
        }
    }));
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
} else {
    initializeApp();
}
