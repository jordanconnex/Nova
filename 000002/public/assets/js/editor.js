import { themes } from './themes.js';

const initializeEditor = () => {
    const toast = document.querySelector('#toast');
    const canvas = document.querySelector('#siteCanvas');
    const projectId = new URLSearchParams(location.search).get('project') || 'new';
    const projectStorageKey = `novaProject:${projectId}`;
    const themeStorageKey = `novaTheme:${projectId}`;
    const projectNames = { portfolio: 'Portfolio personnel', maison: 'Maison Lune', studio: 'Studio N°7', new: 'Mon nouveau site' };
    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2600);
    };
    const history = [];
    const future = [];
    const snapshot = () => ({ html: canvas.innerHTML, title: document.querySelector('#projectTitle').textContent });
    const remember = () => {
        history.push(snapshot());
        if (history.length > 30) history.shift();
        future.length = 0;
        localStorage.setItem(projectStorageKey, JSON.stringify(snapshot()));
    };
    const restore = (state) => {
        if (!state) return;
        canvas.innerHTML = state.html;
        document.querySelector('#projectTitle').textContent = state.title;
        bindEditableContent();
    };
    const bindEditableContent = () => canvas.querySelectorAll('h2, h3, p, .canvas-eyebrow, .section-number, .project-image b, .project-image small').forEach((element) => {
        element.contentEditable = 'true';
        element.spellcheck = true;
        element.addEventListener('input', () => { remember(); });
    });
    const applyTheme = (theme, save = true) => {
        if (!theme) return;
        canvas.classList.add('theme-custom');
        Object.entries({ '--theme-primary': theme.primary, '--theme-accent': theme.accent, '--theme-secondary': theme.secondary, '--theme-text': theme.text, '--theme-bg': theme.bg, '--theme-radius': theme.radius, '--theme-heading': `'${theme.heading}'`, '--theme-body': `'${theme.body}'` }).forEach(([property, value]) => canvas.style.setProperty(property, value));
        const fontLinkId = 'theme-fonts';
        let fontLink = document.querySelector(`#${fontLinkId}`);
        if (!fontLink) { fontLink = document.createElement('link'); fontLink.id = fontLinkId; fontLink.rel = 'stylesheet'; document.head.appendChild(fontLink); }
        fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.heading).replace(/%20/g, '+')}:wght@400;500;600;700&family=${encodeURIComponent(theme.body).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
        document.querySelectorAll('.theme-card').forEach((card) => card.classList.toggle('active', card.dataset.theme === theme.id));
        if (save) localStorage.setItem(themeStorageKey, theme.id);
        document.querySelector('#themeCount').textContent = `${theme.mood} · ${theme.heading}`;
    };
    const renderThemes = (query = '') => {
        const grid = document.querySelector('#themeGrid');
        if (!grid) return;
        const filtered = themes.filter((theme) => `${theme.name} ${theme.mood} ${theme.heading} ${theme.body}`.toLowerCase().includes(query.toLowerCase()));
        grid.innerHTML = filtered.map((theme) => `<button class="theme-card" data-theme="${theme.id}" style="--theme-card-primary:${theme.primary};--theme-card-accent:${theme.accent};--theme-card-bg:${theme.bg}"><span class="theme-swatch"><i></i><i></i><i></i></span><b>${theme.name}</b><small>${theme.heading} · ${theme.body}</small></button>`).join('');
        filtered.forEach((theme) => grid.querySelector(`[data-theme="${theme.id}"]`).addEventListener('click', () => { remember(); applyTheme(theme); showToast(`${theme.name} appliqué`); }));
    };
    renderThemes();
    document.querySelector('#themeSearch')?.addEventListener('input', (event) => renderThemes(event.target.value));
    const moduleMarkup = {
        video: '<section class="generated-module editable-block"><span class="section-number">03 — En mouvement</span><h3>Une histoire qui se regarde.</h3><p>Ajoutez une vidéo pour donner du rythme à votre présentation et faire ressentir votre univers.</p><div class="generated-grid"><div><strong>▶ Lecture</strong><span>Votre film manifeste</span></div></div></section>',
        features: '<section class="generated-module editable-block"><span class="section-number">04 — Pourquoi nous</span><h3>Les détails font la différence.</h3><div class="generated-grid"><div><strong>01 / Clarté</strong><span>Une direction qui va à l’essentiel.</span></div><div><strong>02 / Soin</strong><span>Chaque choix est pensé avec intention.</span></div><div><strong>03 / Élan</strong><span>Des idées prêtes à prendre forme.</span></div></div></section>',
        pricing: '<section class="generated-module editable-block"><span class="section-number">05 — Les offres</span><h3>Une formule simple pour avancer.</h3><div class="generated-grid"><div><strong>Essentiel · 290 €</strong><span>Pour démarrer proprement.</span></div><div><strong>Studio · 690 €</strong><span>Pour aller plus loin, ensemble.</span></div></div></section>',
        testimonials: '<section class="generated-module editable-block"><span class="section-number">06 — Ils en parlent</span><h3>“On a enfin trouvé le bon ton.”</h3><p>“Nova nous a permis de transformer une idée floue en une présence claire et singulière.” — Anna, Maison Lune</p></section>',
        contact: '<section class="generated-module editable-block"><span class="section-number">07 — Échangeons</span><h3>Un projet à faire exister ?</h3><p>bonjour@atelier-exemple.fr<br>Paris · France</p><button class="canvas-cta">Prendre contact ↗</button></section>',
        newsletter: '<section class="generated-module editable-block"><span class="section-number">08 — La suite</span><h3>Une lettre de temps en temps.</h3><p>Des idées, des coulisses et de belles choses dans votre boîte mail.</p><div class="generated-grid"><div><strong>Votre email</strong><span>S’inscrire à la newsletter ↗</span></div></div></section>'
    };
    const moduleCards = [...document.querySelectorAll('.module-card')];
    const filterModules = (category = 'all', query = '') => moduleCards.forEach((card) => {
        card.hidden = !((category === 'all' || card.dataset.category === category) && card.textContent.toLowerCase().includes(query.toLowerCase()));
    });
    document.querySelectorAll('.module-tab').forEach((tab) => tab.addEventListener('click', () => {
        document.querySelectorAll('.module-tab').forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');
        filterModules(tab.dataset.category, document.querySelector('#moduleSearch')?.value || '');
    }));
    document.querySelector('#moduleSearch')?.addEventListener('input', (event) => filterModules(document.querySelector('.module-tab.active')?.dataset.category, event.target.value));
    moduleCards.forEach((card) => card.addEventListener('click', () => {
        remember();
        const content = moduleMarkup[card.dataset.module];
        if (content) canvas.insertAdjacentHTML('beforeend', content);
        bindEditableContent();
        showToast(`${card.querySelector('b').textContent} ajouté à votre page`);
    }));
    document.querySelector('.add-custom')?.addEventListener('click', () => {
        const title = prompt('Titre de votre nouveau module', 'Une nouvelle idée');
        if (!title?.trim()) return;
        remember();
        canvas.insertAdjacentHTML('beforeend', `<section class="generated-module editable-block"><span class="section-number">09 — Personnalisé</span><h3>${title.trim()}</h3><p>Double-cliquez sur les textes pour les personnaliser.</p></section>`);
        bindEditableContent();
        showToast('Module personnalisé ajouté');
    });
    document.querySelectorAll('.settings-tab').forEach((tab) => tab.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab').forEach((item) => item.classList.remove('active'));
        document.querySelectorAll('.settings-panel').forEach((panel) => panel.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`#${tab.dataset.settings}Panel`)?.classList.add('active');
    }));
    document.querySelectorAll('.palette').forEach((palette) => palette.addEventListener('click', () => {
        remember();
        document.body.classList.remove('palette-sage', 'palette-clay', 'palette-ink', 'palette-lemon');
        document.body.classList.add(`palette-${palette.dataset.palette}`);
        document.querySelectorAll('.palette').forEach((item) => item.classList.remove('active'));
        palette.classList.add('active');
    }));
    document.querySelector('#fontSelect')?.addEventListener('change', (event) => {
        remember();
        canvas.classList.remove('canvas-typography-serif', 'canvas-typography-mono');
        if (event.target.value !== 'grotesk') canvas.classList.add(`canvas-typography-${event.target.value}`);
    });
    document.querySelector('#widthRange')?.addEventListener('input', (event) => {
        document.querySelector('#widthOutput').textContent = `${event.target.value} px`;
        canvas.style.maxWidth = `${event.target.value}px`;
    });
    document.querySelectorAll('.radius-option').forEach((option) => option.addEventListener('click', () => {
        remember();
        document.body.classList.remove('radius-soft', 'radius-square', 'radius-round');
        document.body.classList.add(`radius-${option.dataset.radius}`);
        document.querySelectorAll('.radius-option').forEach((item) => item.classList.remove('active'));
        option.classList.add('active');
    }));
    document.querySelector('#pagePanel .color-input')?.addEventListener('input', (event) => {
        canvas.style.background = event.target.value;
        document.querySelector('.color-value').textContent = event.target.value.toUpperCase();
    });
    document.querySelectorAll('.switch-row input').forEach((input) => input.addEventListener('change', () => {
        if (input.closest('.switch-row').textContent.includes('Navigation')) document.querySelector('.canvas-site-header').style.position = input.checked ? 'sticky' : 'static';
        if (input.closest('.switch-row').textContent.includes('logo')) document.querySelector('.canvas-site-header strong').hidden = !input.checked;
    }));
    document.querySelectorAll('.device').forEach((device) => device.addEventListener('click', () => {
        document.querySelectorAll('.device').forEach((item) => item.classList.remove('active'));
        device.classList.add('active');
        canvas.style.maxWidth = { desktop: '930px', tablet: '700px', mobile: '390px' }[device.dataset.device];
    }));
    let zoom = 100;
    document.querySelector('#zoomIn')?.addEventListener('click', () => { zoom = Math.min(130, zoom + 10); document.querySelector('#zoomValue').textContent = `${zoom}%`; canvas.style.transform = `scale(${zoom / 100})`; canvas.style.transformOrigin = 'top center'; });
    document.querySelector('#zoomOut')?.addEventListener('click', () => { zoom = Math.max(70, zoom - 10); document.querySelector('#zoomValue').textContent = `${zoom}%`; canvas.style.transform = `scale(${zoom / 100})`; canvas.style.transformOrigin = 'top center'; });
    document.querySelector('#toggleGrid')?.addEventListener('click', () => canvas.classList.toggle('grid-view'));
    document.querySelector('#renameProject')?.addEventListener('click', () => {
        const title = prompt('Nom de votre projet', document.querySelector('#projectTitle').textContent);
        if (title?.trim()) { remember(); document.querySelector('#projectTitle').textContent = title.trim(); }
    });
    document.querySelector('#undoButton')?.addEventListener('click', () => { const previous = history.pop(); if (!previous) return showToast('Rien à annuler'); future.push(snapshot()); restore(previous); showToast('Modification annulée'); });
    document.querySelector('#redoButton')?.addEventListener('click', () => { const next = future.pop(); if (!next) return showToast('Rien à rétablir'); history.push(snapshot()); restore(next); showToast('Modification rétablie'); });
    const previewOverlay = document.querySelector('#previewOverlay');
    const previewFrame = document.querySelector('#previewFrame');
    document.querySelector('#previewButton')?.addEventListener('click', () => {
        previewFrame.innerHTML = canvas.innerHTML;
        previewFrame.className = 'preview-frame';
        previewOverlay.classList.add('is-open');
        previewOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
    document.querySelector('#closePreview')?.addEventListener('click', () => { previewOverlay.classList.remove('is-open'); previewOverlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; });
    document.querySelectorAll('.preview-device').forEach((device) => device.addEventListener('click', () => {
        document.querySelectorAll('.preview-device').forEach((item) => item.classList.remove('active'));
        device.classList.add('active');
        previewFrame.className = `preview-frame ${device.dataset.previewDevice === 'desktop' ? '' : `preview-${device.dataset.previewDevice}`}`;
        document.querySelector('#previewDeviceLabel').textContent = { desktop: 'Bureau', tablet: 'Tablette', mobile: 'Mobile' }[device.dataset.previewDevice];
    }));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && previewOverlay.classList.contains('is-open')) document.querySelector('#closePreview').click(); });
    const saved = localStorage.getItem(projectStorageKey);
    if (saved) { try { restore(JSON.parse(saved)); } catch { localStorage.removeItem(projectStorageKey); } }
    else document.querySelector('#projectTitle').textContent = projectNames[projectId] || projectNames.new;
    const savedTheme = themes.find((theme) => theme.id === localStorage.getItem(themeStorageKey));
    applyTheme(savedTheme || themes[0], false);
    bindEditableContent();
    const subscription = new URLSearchParams(location.search).get('subscription');
    if (subscription === 'success') showToast('Abonnement confirmé. Votre site peut être publié.');
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeEditor, { once: true });
else initializeEditor();
