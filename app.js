
(() => {
  'use strict';

  const STORAGE_KEY = 'couple-web-prototype-v04';

  const IDEAS = [
    { title: 'Un dîner improvisé', category: 'Romantique', message: 'Rien que nous deux, sans programme.' },
    { title: 'Une soirée cinéma', category: 'Maison', message: 'Tu choisis le film, je m’occupe du reste.' },
    { title: 'Un petit déjeuner au lit', category: 'Petites attentions', message: 'Un matin lent, rien qu’à nous.' },
    { title: 'Une escapade surprise', category: 'Aventure', message: 'Je prépare tout, tu viens avec moi.' },
    { title: 'Une promenade sans destination', category: 'Sorties', message: 'On marche jusqu’à avoir envie de s’arrêter.' },
    { title: 'Une soirée rien que pour toi', category: 'Intime / Couple', message: 'À utiliser quand tu en as envie.' }
  ];

  const CATEGORIES = ['Romantique', 'Sorties', 'Aventure', 'Maison', 'Petites attentions', 'Intime / Couple'];

  const INITIAL_DRAFT = {
    title: 'Un dîner improvisé',
    message: 'Rien que nous deux, ici et maintenant.',
    to: 'Toi',
    from: 'Moi',
    category: 'Romantique',
    validity: ''
  };

  function freshState() {
    return {
      version: 4,
      screen: 'home',
      draft: { ...INITIAL_DRAFT },
      records: [],
      currentRecordId: null,
      selectedRecordId: null,
      carnetFilter: 'available',
      settings: { notifications: true, faceId: true },
      modal: null
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return freshState();
      const parsed = JSON.parse(raw);
      return {
        ...freshState(),
        ...parsed,
        screen: 'home',
        modal: null,
        settings: { ...freshState().settings, ...(parsed.settings || {}) }
      };
    } catch {
      return freshState();
    }
  }

  let state = loadState();

  function persist() {
    const snapshot = { ...state, screen: 'home', modal: null };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  function setState(patch, options = {}) {
    state = { ...state, ...patch };
    if (options.persist !== false) persist();
    render();
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function id() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function currentRecord() {
    return state.records.find(r => r.id === state.selectedRecordId)
      || state.records.find(r => r.id === state.currentRecordId)
      || null;
  }

  function updateRecord(recordId, patch) {
    state.records = state.records.map(r => r.id === recordId ? { ...r, ...patch } : r);
    persist();
  }

  function navigate(screen, patch = {}) {
    state = { ...state, ...patch, screen, modal: null };
    persist();
    window.scrollTo({ top: 0, behavior: 'instant' });
    render();
  }

  function header(title, backScreen = null) {
    return `
      <div class="header">
        <button class="icon-btn" data-back="${backScreen || ''}" ${backScreen ? '' : 'disabled'}>${backScreen ? '‹' : ''}</button>
        <div class="header-title">${escapeHtml(title)}</div>
        <div></div>
      </div>`;
  }

  function page(inner, { title = 'COUPLE', back = null, immersive = false } = {}) {
    return `
      <main class="app-shell ${immersive ? 'immersive' : ''}">
        <section class="screen">
          ${header(title, back)}
          ${inner}
        </section>
        ${immersive ? '' : nav()}
      </main>`;
  }

  function nav() {
    const active =
      ['carnet', 'revealed', 'used'].includes(state.screen) ? 'carnet'
      : state.screen === 'library' ? 'ideas'
      : state.screen === 'settings' ? 'settings'
      : 'home';

    const items = [
      ['home', '⌂', 'Accueil'],
      ['carnet', '▤', 'Carnet'],
      ['ideas', '◇', 'Idées'],
      ['settings', '○', 'Réglages']
    ];

    return `
      <nav class="bottom-nav">
        ${items.map(([key, glyph, label]) => `
          <button class="nav-btn ${active === key ? 'active' : ''}" data-nav="${key}">
            <b>${glyph}</b><span>${label}</span>
          </button>`).join('')}
      </nav>`;
  }

  function chequeHTML(cheque, { compact = false, used = false } = {}) {
    return `
      <article class="cheque ${compact ? 'compact' : ''}">
        <div class="cheque-stub">
          <div class="stub-heart">♡</div>
          <div class="stub-rule"></div>
          <div class="stub-brand-clip"><div class="stub-brand">COUPLE</div></div>
        </div>
        <div class="perforation"></div>
        <div class="cheque-body">
          <div class="bon-pour">BON POUR</div>
          <div class="cheque-title">${escapeHtml(cheque.title || '…')}</div>
          <div class="cheque-message">${escapeHtml(cheque.message || 'Une attention rien que pour toi.')}</div>
          <div class="cheque-names">
            <div>POUR : <span class="script">${escapeHtml(cheque.to || 'Toi')}</span></div>
            <div>DE : <span class="script">${escapeHtml(cheque.from || 'Moi')}</span></div>
          </div>
        </div>
        <div class="seal">♡</div>
        ${used ? `<div class="used-stamp"><b>UTILISÉ</b><span>♡</span></div>` : ''}
      </article>`;
  }

  function button(label, action, secondary = false, extraClass = '') {
    return `<button class="btn ${secondary ? 'btn-secondary' : 'btn-primary'} ${extraClass}" data-action="${action}">${escapeHtml(label)}</button>`;
  }

  function home() {
    const waiting = state.records.find(r => r.status === 'offered');
    return page(`
      <div class="eyebrow">NOTRE CARNET</div>
      <h1 class="hero">Chaque moment<br>compte.</h1>

      <div class="section-label">TON BON DU MOIS</div>
      <div class="soft-card">
        <div class="soft-title">${waiting ? 'Quelque chose t’attend' : 'Rien à découvrir pour le moment'}</div>
        <div class="soft-copy">${waiting
          ? 'Un bon a été offert. Son contenu reste caché jusqu’à la découverte.'
          : 'Quand un bon arrivera, il t’attendra ici sans rien révéler.'}</div>
        ${waiting ? `<div class="btn-stack">${button('Découvrir', `receive:${waiting.id}`)}</div>` : ''}
      </div>

      <div class="section-label">TON BON À OFFRIR</div>
      ${chequeHTML(state.draft, { compact: true })}

      <div class="btn-stack">
        ${button('Préparer un bon', 'prepare')}
        ${button('Me surprendre', 'surprise', true)}
      </div>
    `);
  }

  function prepare() {
    const choices = [
      ['Choisir une idée', 'Parcourir la bibliothèque.', 'library'],
      ['Me surprendre', 'Laisser le hasard choisir avec douceur.', 'surprise'],
      ['Créer le mien', 'Partir d’un chèque vierge.', 'custom']
    ];
    return page(`
      <h1 class="page-title">Comment veux-tu commencer ?</h1>
      <p class="page-intro">Choisis simplement le point de départ. Tu peux changer de grande section à tout moment avec la barre du bas.</p>
      <div class="choice-list">
        ${choices.map(([t,c,a]) => `
          <button class="choice" data-action="${a}">
            <div class="choice-icon">♡</div>
            <div><div class="choice-title">${t}</div><div class="choice-copy">${c}</div></div>
            <div class="chevron">›</div>
          </button>`).join('')}
      </div>
    `, { title: 'PRÉPARER', back: 'home' });
  }

  function library() {
    return page(`
      <div class="library-lead">
        <h1 class="page-title">Qu’est-ce qui ferait plaisir aujourd’hui ?</h1>
      </div>
      ${CATEGORIES.map(cat => {
        const items = IDEAS.filter(i => i.category === cat);
        return `
          <section class="category-block">
            <h2 class="category-title">${cat}</h2>
            ${items.length ? items.map((idea, idx) => `
              <button class="idea-row" data-idea="${escapeHtml(idea.title)}">
                <div>
                  <div class="idea-title">${escapeHtml(idea.title)}</div>
                  <div class="idea-copy">${escapeHtml(idea.message)}</div>
                </div>
                <div class="chevron">›</div>
              </button>`).join('') : `<div class="idea-copy">D’autres idées arriveront ici.</div>`}
          </section>`;
      }).join('')}
    `, { title: 'IDÉES', back: 'prepare' });
  }

  function surprise() {
    return page(`
      <div class="center-stage">
        <div class="spark">✦</div>
        <h1 class="center-title">Je prépare une surprise rien que pour toi.</h1>
        <p class="center-copy">Une idée choisie parmi notre carnet, sans score ni obligation.</p>
        ${button('Lancer la surprise', 'random', false)}
      </div>
    `, { title: 'SURPRISE', back: 'prepare' });
  }

  function custom() {
    const empty = { title: '', message: '', to: 'Toi', from: 'Moi' };
    return page(`
      <h1 class="page-title">Créer le mien</h1>
      <p class="page-intro">Commence avec un chèque vierge. Tu pourras tout ajuster à l’étape suivante.</p>
      ${chequeHTML(empty)}
      <div class="btn-stack">${button('Commencer', 'custom-start')}</div>
    `, { title: 'CRÉER', back: 'prepare' });
  }

  function edit() {
    return page(`
      <div class="section-label">APERÇU</div>
      <div id="live-cheque">${chequeHTML(state.draft, { compact: true })}</div>
      <form class="form" id="edit-form">
        <div class="field">
          <label>Titre du bon</label>
          <input name="title" value="${escapeHtml(state.draft.title)}" placeholder="Ex. Un dîner improvisé">
        </div>
        <div class="field">
          <label>Message personnel</label>
          <textarea name="message" placeholder="Quelques mots rien que pour vous…">${escapeHtml(state.draft.message)}</textarea>
        </div>
        <div class="form-row">
          <div class="field"><label>Pour</label><input name="to" value="${escapeHtml(state.draft.to)}"></div>
          <div class="field"><label>De</label><input name="from" value="${escapeHtml(state.draft.from)}"></div>
        </div>
        <div class="field">
          <label>Validité (optionnelle)</label>
          <input name="validity" value="${escapeHtml(state.draft.validity || '')}" placeholder="Laisser vide si aucune">
        </div>
      </form>
      <div class="btn-stack">${button('Le bon est prêt', 'ready')}</div>
    `, { title: 'NOUVEAU BON', back: 'prepare' });
  }

  function ready() {
    return page(`
      <h1 class="center-title">Ton bon est prêt à être offert.</h1>
      <p class="center-copy">Il reste entièrement secret tant que tu ne l’offres pas.</p>
      <div style="margin-top:28px">${chequeHTML(state.draft)}</div>
      <div class="btn-stack">
        ${button('Offrir ce bon', 'send')}
        ${button('Modifier', 'edit', true)}
      </div>
    `, { title: 'PRÊT', back: 'edit' });
  }

  function sent() {
    return page(`
      <div class="center-stage">
        ${envelopeStatic()}
        <h1 class="center-title">C’est envoyé.</h1>
        <p class="center-copy">Le contenu reste caché. L’autre personne sait seulement qu’un bon l’attend.</p>
        <div class="btn-stack" style="width:100%; margin-top:24px">
          ${button('Retour à l’accueil', 'home')}
          ${button('Simuler la réception', `receive:${state.currentRecordId}`, true)}
        </div>
        <div class="prototype-note">Action visible uniquement dans le prototype.</div>
      </div>
    `, { title: 'OFFERT', immersive: true });
  }

  function envelopeStatic() {
    return `
      <div style="width:82%;height:200px;position:relative;margin-bottom:24px">
        <div class="envelope-flap" style="height:118px"></div>
        <div class="envelope-front">
          <div class="envelope-seal">♡</div>
        </div>
      </div>`;
  }

  function receive() {
    const record = currentRecord();
    if (!record) return home();
    return page(`
      <div class="reveal-copy">
        <h1 class="center-title">Pour toi</h1>
        <p class="center-copy">Quelque chose t’attend.</p>
      </div>

      <div class="reveal-stage" id="reveal-stage">
        <div class="reveal-cheque">${chequeHTML(record.cheque, { compact: true })}</div>
        <div class="envelope">
          <div class="envelope-flap"></div>
          <div class="envelope-front"><div class="envelope-seal">♡</div></div>
        </div>
        <div class="reveal-grab">↑</div>
      </div>

      <div class="reveal-hint" id="reveal-hint">Tire doucement le chèque vers le haut</div>
      <div class="reveal-detail">L’enveloppe s’ouvre d’abord, puis le papier se libère. Si tu relâches trop tôt, elle revient simplement en place.</div>
      <div class="progress" id="reveal-progress"><i></i></div>
    `, { title: 'POUR TOI', immersive: true });
  }

  function revealed() {
    const record = currentRecord();
    if (!record) return carnet();
    return page(`
      <h1 class="center-title">Pour toi.</h1>
      <p class="center-copy">Le bon est maintenant dans votre carnet.</p>
      <div style="margin-top:28px">${chequeHTML(record.cheque)}</div>
      <div class="btn-stack">
        ${button('Utiliser ce bon', `use:${record.id}`)}
        ${button('Voir le carnet', 'carnet', true)}
      </div>
    `, { title: 'DÉCOUVERT' });
  }

  function carnet() {
    const available = state.records.filter(r => r.status === 'revealed');
    const used = state.records.filter(r => r.status === 'used');
    const offered = [...state.records].sort((a,b) => b.createdAt - a.createdAt);

    let list;
    let album;

    if (state.carnetFilter === 'available') {
      list = available.length ? available.map(r => `
        <div>
          ${chequeHTML(r.cheque, { compact: true })}
          <div class="btn-stack">${button('Utiliser ce bon', `use:${r.id}`)}</div>
        </div>`).join('') : emptyState('Aucun bon disponible pour le moment.');
      album = 'Ici, uniquement les bons découverts et encore utilisables.';
    } else if (state.carnetFilter === 'used') {
      list = used.length ? used.map(r => `<div>${chequeHTML(r.cheque, { compact: true, used: true })}</div>`).join('') : emptyState('Aucun bon utilisé pour le moment.');
      album = 'Ici, uniquement les bons déjà vécus — conservés sans disparaître.';
    } else {
      list = offered.length ? offered.map(r => `
        <div>
          ${chequeHTML(r.cheque, { compact: true, used: r.status === 'used' })}
          <div class="record-note">${r.status === 'offered'
            ? 'Offert — en attente de découverte'
            : r.status === 'revealed'
              ? 'Découvert — encore disponible'
              : 'Utilisé — conservé dans le carnet'}</div>
        </div>`).join('') : emptyState('Aucun bon offert pour le moment.');
      album = 'Ici, tous les bons que tu as offerts, dans leur état actuel.';
    }

    return page(`
      <h1 class="page-title">Notre carnet</h1>
      <p class="page-intro">Un album à feuilleter, pas une liste à gérer.</p>

      <div class="segmented">
        ${segment('available', 'Disponibles')}
        ${segment('used', 'Utilisés')}
        ${segment('offered', 'Offerts')}
      </div>

      <div class="record-list">${list}</div>
      <div class="album-note">${album}</div>
    `, { title: 'CARNET' });
  }

  function segment(key, label) {
    return `<button class="segment-btn ${state.carnetFilter === key ? 'active' : ''}" data-filter="${key}">${label}</button>`;
  }

  function emptyState(text) {
    return `<div class="empty-state"><div class="empty-title">Le carnet est calme.</div><div class="empty-copy">${text}</div></div>`;
  }

  function settings() {
    return page(`
      <h1 class="page-title">Réglages</h1>
      <p class="page-intro">Peu d’options, uniquement celles qui protègent ou simplifient l’expérience.</p>

      <div class="settings-list">
        ${settingCard('notifications', 'Notifications discrètes', 'Aucun titre de bon ni contenu personnel sur l’écran verrouillé.')}
        ${settingCard('faceId', 'Verrouillage Face ID', 'Sera vérifié dans la validation native finale.')}
      </div>

      <div class="info-card">
        <div class="info-title">Confidentialité</div>
        <div class="info-copy">Cette version web stocke les bons uniquement dans le stockage local de ce navigateur. Aucun contenu n’est envoyé à un serveur.</div>
      </div>

      <div class="info-card">
        <div class="info-title">Prototype web 0.4</div>
        <div class="info-copy">Phase 5A : itérations rapides dans Safari. La validation native iOS/Android reviendra lorsque l’UX sera figée.</div>
      </div>

      <div class="btn-stack">
        ${button('Réinitialiser les données de test', 'reset', true)}
      </div>
    `, { title: 'RÉGLAGES' });
  }

  function settingCard(key, title, copy) {
    const on = !!state.settings[key];
    return `
      <div class="setting-card">
        <div><div class="setting-title">${title}</div><div class="setting-copy">${copy}</div></div>
        <button class="switch ${on ? 'on' : ''}" data-setting="${key}" aria-pressed="${on}"></button>
      </div>`;
  }

  function modalHTML() {
    if (!state.modal) return '';
    if (state.modal.type === 'use') {
      const record = state.records.find(r => r.id === state.modal.id);
      if (!record) return '';
      return `
        <div class="modal-backdrop" data-modal-close="1">
          <div class="modal" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
            <div class="modal-title">Utiliser ce bon maintenant ?</div>
            <div class="modal-copy">Il restera dans le Carnet avec une marque discrète « UTILISÉ ».</div>
            <div class="btn-stack">
              ${button('Oui, utiliser', `confirm-use:${record.id}`)}
              ${button('Pas encore', 'close-modal', true)}
            </div>
          </div>
        </div>`;
    }
    return '';
  }

  function render() {
    const app = document.getElementById('app');
    const screens = {
      home, prepare, library, surprise, custom, edit, ready, sent, receive, revealed, carnet, settings
    };
    const fn = screens[state.screen] || home;
    app.innerHTML = fn() + modalHTML();
    bind();
    if (state.screen === 'receive') setupReveal();
  }

  function bind() {
    document.querySelectorAll('[data-back]').forEach(el => {
      if (!el.dataset.back) return;
      el.addEventListener('click', () => navigate(el.dataset.back));
    });

    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => navigate(el.dataset.nav));
    });

    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => action(el.dataset.action));
    });

    document.querySelectorAll('[data-idea]').forEach(el => {
      el.addEventListener('click', () => {
        const idea = IDEAS.find(i => i.title === el.dataset.idea);
        if (!idea) return;
        state.draft = { ...state.draft, ...idea };
        persist();
        navigate('edit');
      });
    });

    document.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('click', () => setState({ carnetFilter: el.dataset.filter }));
    });

    document.querySelectorAll('[data-setting]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.setting;
        state.settings[key] = !state.settings[key];
        persist();
        render();
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', () => setState({ modal: null }));
    });

    const form = document.getElementById('edit-form');
    if (form) {
      const handler = () => {
        const data = new FormData(form);
        state.draft = {
          ...state.draft,
          title: data.get('title') || '',
          message: data.get('message') || '',
          to: data.get('to') || '',
          from: data.get('from') || '',
          validity: data.get('validity') || ''
        };
        persist();
        const live = document.getElementById('live-cheque');
        if (live) live.innerHTML = chequeHTML(state.draft, { compact: true });
      };
      form.addEventListener('input', handler);
    }
  }

  function action(raw) {
    const [name, arg] = raw.split(':');

    if (name === 'home' || name === 'prepare' || name === 'library' || name === 'surprise' || name === 'custom' || name === 'edit' || name === 'ready' || name === 'carnet' || name === 'settings') {
      navigate(name);
      return;
    }

    if (name === 'random') {
      const idea = IDEAS[Math.floor(Math.random() * IDEAS.length)];
      state.draft = { ...state.draft, ...idea };
      persist();
      navigate('edit');
      return;
    }

    if (name === 'custom-start') {
      state.draft = { title: '', message: '', to: 'Toi', from: 'Moi', category: '', validity: '' };
      persist();
      navigate('edit');
      return;
    }

    if (name === 'send') {
      const record = {
        id: id(),
        cheque: { ...state.draft },
        status: 'offered',
        createdAt: Date.now()
      };
      state.records = [record, ...state.records];
      state.currentRecordId = record.id;
      state.selectedRecordId = record.id;
      persist();
      navigate('sent');
      return;
    }

    if (name === 'receive') {
      const recordId = arg || state.currentRecordId;
      state.currentRecordId = recordId;
      state.selectedRecordId = recordId;
      persist();
      navigate('receive');
      return;
    }

    if (name === 'use') {
      state.selectedRecordId = arg;
      state.modal = { type: 'use', id: arg };
      persist();
      render();
      return;
    }

    if (name === 'confirm-use') {
      updateRecord(arg, { status: 'used' });
      state.selectedRecordId = arg;
      state.modal = null;
      state.carnetFilter = 'used';
      persist();
      navigate('carnet');
      return;
    }

    if (name === 'close-modal') {
      setState({ modal: null });
      return;
    }

    if (name === 'reset') {
      if (confirm('Réinitialiser tous les bons de test de ce navigateur ?')) {
        localStorage.removeItem(STORAGE_KEY);
        state = freshState();
        render();
      }
    }
  }

  function setupReveal() {
    const stage = document.getElementById('reveal-stage');
    const hint = document.getElementById('reveal-hint');
    const progress = document.getElementById('reveal-progress');
    if (!stage) return;

    const record = currentRecord();
    if (!record) return;

    let pointerId = null;
    let startY = 0;
    let progressValue = 0;
    let completed = false;
    const distance = 285;
    const threshold = .76;

    const setProgress = (p, animate = false) => {
      progressValue = Math.max(0, Math.min(1, p));
      stage.style.transition = animate ? 'none' : '';
      stage.style.setProperty('--p', progressValue.toFixed(4));
      progress?.style.setProperty('--p', progressValue.toFixed(4));
    };

    const animateTo = (target, duration = 360, done) => {
      const from = progressValue;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);

      const frame = now => {
        const t = Math.min(1, (now - start) / duration);
        setProgress(from + (target - from) * ease(t), true);
        if (t < 1) requestAnimationFrame(frame);
        else done?.();
      };
      requestAnimationFrame(frame);
    };

    stage.addEventListener('pointerdown', e => {
      if (completed) return;
      pointerId = e.pointerId;
      startY = e.clientY;
      stage.classList.add('dragging');
      try { stage.setPointerCapture(pointerId); } catch {}
      hint.textContent = 'Continue doucement…';
    });

    stage.addEventListener('pointermove', e => {
      if (e.pointerId !== pointerId || completed) return;
      const dy = Math.max(0, startY - e.clientY);
      const p = Math.min(1, dy / distance);
      setProgress(p);
      if (p >= threshold) hint.textContent = 'Encore un peu…';
    });

    const release = e => {
      if (e.pointerId !== pointerId || completed) return;
      stage.classList.remove('dragging');
      try { stage.releasePointerCapture(pointerId); } catch {}
      pointerId = null;

      if (progressValue >= threshold) {
        completed = true;
        hint.textContent = 'Le bon se révèle…';
        if (navigator.vibrate) navigator.vibrate(25);
        animateTo(1, 560, () => {
          updateRecord(record.id, { status: 'revealed' });
          state.selectedRecordId = record.id;
          state.currentRecordId = record.id;
          persist();
          setTimeout(() => navigate('revealed'), 250);
        });
      } else {
        hint.textContent = 'Tire doucement le chèque vers le haut';
        animateTo(0, 300);
      }
    };

    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('lostpointercapture', e => {
      if (!completed && pointerId !== null) release(e);
    });
  }

  render();
})();
