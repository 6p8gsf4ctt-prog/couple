
(() => {
  'use strict';

  const STORAGE_KEY = 'couple-web-prototype-v05';

  const IDEAS = [
    {id:'rom-1',title:'Un dîner improvisé',category:'Romantique',message:'Rien que nous deux, sans programme.'},
    {id:'rom-2',title:'Un message aux heures chaudes',category:'Romantique',message:'Un moment à deux, juste pour se retrouver.'},
    {id:'out-1',title:'Une promenade sans destination',category:'Sorties',message:'On marche jusqu’à avoir envie de s’arrêter.'},
    {id:'out-2',title:'Une sortie choisie pour toi',category:'Sorties',message:'Je prépare l’endroit, tu n’as plus qu’à venir.'},
    {id:'adv-1',title:'Une escapade surprise',category:'Aventure',message:'Je prépare tout, tu viens avec moi.'},
    {id:'adv-2',title:'Une journée hors routine',category:'Aventure',message:'Un petit ailleurs, juste assez loin du quotidien.'},
    {id:'home-1',title:'Une soirée cinéma',category:'Maison',message:'Tu choisis le film, je m’occupe du reste.'},
    {id:'home-2',title:'Un petit déjeuner au lit',category:'Maison',message:'Un matin lent, rien qu’à nous.'},
    {id:'att-1',title:'Une heure rien que pour toi',category:'Petites attentions',message:'Je m’occupe du reste, profite simplement.'},
    {id:'att-2',title:'Ton dessert préféré',category:'Petites attentions',message:'Parce que les petits plaisirs comptent aussi.'},
    {id:'int-1',title:'Une soirée rien que pour nous',category:'Intime / Couple',message:'À utiliser quand le moment vous ressemble.'},
    {id:'int-2',title:'Un moment sans téléphone',category:'Intime / Couple',message:'Juste nous deux, sans interruption.'}
  ];

  const CATEGORIES = ['Romantique','Sorties','Aventure','Maison','Petites attentions','Intime / Couple'];

  const INITIAL_DRAFT = {
    title:'Un dîner improvisé',
    message:'Rien que nous deux, ici et maintenant.',
    to:'Toi',
    from:'Moi',
    category:'Romantique',
    validity:''
  };

  function freshState() {
    return {
      version:5,
      screen:'home',
      draft:{...INITIAL_DRAFT},
      records:[],
      currentRecordId:null,
      selectedRecordId:null,
      carnetFilter:'available',
      albumIndex:{available:0,used:0,offered:0},
      settings:{notifications:true,faceId:true},
      perspective:'recipient',
      modal:null
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
        screen:'home',
        modal:null,
        albumIndex:{...freshState().albumIndex,...(parsed.albumIndex||{})},
        settings:{...freshState().settings,...(parsed.settings||{})}
      };
    } catch (_) {
      return freshState();
    }
  }

  let state = loadState();

  function persist() {
    const snapshot = {...state,screen:'home',modal:null};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(snapshot));
  }

  function setState(patch,{save=true}={}) {
    state={...state,...patch};
    if(save) persist();
    render();
  }

  function escapeHtml(value='') {
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  }

  function recordById(id) {
    return state.records.find(r=>r.id===id)||null;
  }

  function currentRecord() {
    return recordById(state.selectedRecordId)||recordById(state.currentRecordId)||null;
  }

  function updateRecord(id,patch) {
    state.records=state.records.map(r=>r.id===id?{...r,...patch}:r);
    persist();
  }

  function navigate(screen,patch={}) {
    state={...state,...patch,screen,modal:null};
    persist();
    try { window.scrollTo({top:0,behavior:'instant'}); } catch (_) { window.scrollTo(0,0); }
    render();
  }

  function header(title='COUPLE',back=null) {
    return `
      <div class="header">
        <button class="icon-btn" data-back="${back||''}" ${back?'':'disabled'}>${back?'‹':''}</button>
        <div class="brand">${escapeHtml(title)}</div>
        <div></div>
      </div>`;
  }

  function nav() {
    const active =
      ['carnet','discovered','usedScene','activation','timing'].includes(state.screen) ? 'carnet'
      : state.screen==='library' ? 'ideas'
      : state.screen==='settings' ? 'settings'
      : 'home';

    const items=[
      ['home','⌂','Accueil'],
      ['carnet','▤','Carnet'],
      ['ideas','◇','Idées'],
      ['settings','○','Réglages']
    ];

    return `<nav class="bottom-nav">
      ${items.map(([key,glyph,label])=>`
        <button class="nav-btn ${active===key?'active':''}" data-nav="${key}">
          <b>${glyph}</b><span>${label}</span>
        </button>`).join('')}
    </nav>`;
  }

  function page(inner,{title='COUPLE',back=null,immersive=false}={}) {
    return `
      <main class="shell ${immersive?'immersive':''}">
        <section class="screen">
          ${header(title,back)}
          ${inner}
        </section>
        ${immersive?'':nav()}
      </main>`;
  }

  function btn(label,action,kind='primary',extra='') {
    const cls=kind==='secondary'?'btn-secondary':kind==='quiet'?'btn-quiet':'btn-primary';
    return `<button class="btn ${cls} ${extra}" data-action="${action}">${escapeHtml(label)}</button>`;
  }

  function chequeHTML(c,{compact=false,used=false,activation=null}={}) {
    return `
      <article class="cheque ${compact?'compact':''}">
        <div class="cheque-stub">
          <div class="stub-heart">♡</div>
          <div class="stub-rule"></div>
          <div class="stub-brand-clip"><div class="stub-brand">COUPLE</div></div>
        </div>
        <div class="perforation"></div>
        <div class="cheque-body">
          <div class="bon-pour">BON POUR</div>
          <div class="cheque-title">${escapeHtml(c.title||'…')}</div>
          <div class="cheque-message">${escapeHtml(c.message||'Une attention rien que pour toi.')}</div>
          <div class="cheque-names">
            <div>POUR : <span class="script">${escapeHtml(c.to||'Toi')}</span></div>
            <div>DE : <span class="script">${escapeHtml(c.from||'Moi')}</span></div>
          </div>
        </div>
        <div class="cheque-seal">♡</div>
        ${activation?`<div class="activation-mark">${escapeHtml(activation)}</div>`:''}
        ${used?`<div class="used-stamp"><b>UTILISÉ</b><span>♡</span></div>`:''}
      </article>`;
  }

  function envelopeHTML({mini=false,paper=false}={}) {
    return `<div class="envelope-art ${mini?'env-mini':''}">
      <div class="env-shadow"></div>
      <div class="env-back"></div>
      ${paper?'<div class="env-paper"></div>':''}
      <div class="env-flap"></div>
      <div class="env-front"></div>
      <div class="env-seal">♡</div>
    </div>`;
  }

  function pendingRecord() {
    return state.records.find(r=>r.status==='offered')||null;
  }

  function activeRecordForSender() {
    return state.records.find(r=>r.status==='scheduled')||null;
  }

  function home() {
    const pending=pendingRecord();
    const senderActive=activeRecordForSender();

    if(state.perspective==='sender' && senderActive) {
      return page(`
        <div class="eyebrow">UN MOMENT VA PRENDRE VIE</div>
        <div class="sender-event">
          <h1 class="center-title">Ton bon va prendre vie ${timingPhrase(senderActive.timing,true)}.</h1>
          <p class="center-copy">La personne à qui tu l’as offert a choisi son moment.</p>
          <div class="sender-fragment">${chequeHTML(senderActive.cheque,{compact:true,activation:timingLabel(senderActive.timing)})}</div>
          <div class="btn-stack">${btn('Voir le bon',`sender-event:${senderActive.id}`)}</div>
        </div>

        <div class="section-label">TON BON À OFFRIR</div>
        ${chequeHTML(state.draft,{compact:true})}
        <div class="btn-stack">${btn('Préparer un bon','prepare')}</div>
      `);
    }

    if(pending && state.perspective==='recipient') {
      return page(`
        <div class="event-hero">
          <div class="event-glow"></div>
          ${envelopeHTML({mini:true})}
          <h1 class="event-title">Un bon t’attend.</h1>
          <p class="event-copy">Quelqu’un a préparé quelque chose pour toi. Son contenu restera secret jusqu’à ce que tu choisisses de l’ouvrir.</p>
          <div class="event-actions">${btn('Découvrir',`receive-intro:${pending.id}`)}</div>
        </div>

        <div class="section-label">TON BON À OFFRIR</div>
        ${chequeHTML(state.draft,{compact:true})}
        <div class="btn-stack">
          ${btn('Préparer un bon','prepare','secondary')}
          ${btn('Me surprendre','surprise','quiet')}
        </div>
      `);
    }

    return page(`
      <div class="eyebrow">NOTRE CARNET</div>
      <h1 class="hero">Chaque moment<br>compte.</h1>

      <div class="section-label">TON BON À OFFRIR</div>
      ${chequeHTML(state.draft,{compact:true})}
      <div class="btn-stack">
        ${btn('Préparer un bon','prepare')}
        ${btn('Me surprendre','surprise','secondary')}
      </div>

      <div class="section-label">LE CARNET</div>
      <div class="soft-card">
        <div class="soft-title">${state.records.length?'Vos moments restent ici.':'Votre carnet commence ici.'}</div>
        <div class="soft-copy">${state.records.length
          ? `${state.records.length} bon${state.records.length>1?'s':''} conservé${state.records.length>1?'s':''}, qu’il soit encore disponible ou déjà vécu.`
          : 'Les bons découverts et les moments vécus resteront ensemble, sans disparaître.'}</div>
      </div>
    `);
  }

  function prepare() {
    const choices=[
      ['Choisir une idée','Parcourir la bibliothèque.','library'],
      ['Me surprendre','Laisser l’app choisir une belle idée.','surprise'],
      ['Créer le mien','Partir d’un chèque vierge.','custom']
    ];
    return page(`
      <h1 class="page-title">Comment veux-tu commencer ?</h1>
      <p class="page-copy">Un seul choix maintenant. Tu personnaliseras ensuite tranquillement.</p>
      <div class="choice-list">
        ${choices.map(([t,c,a])=>`
          <button class="choice" data-action="${a}">
            <div class="choice-icon">♡</div>
            <div><div class="choice-title">${t}</div><div class="choice-copy">${c}</div></div>
            <div class="chevron">›</div>
          </button>`).join('')}
      </div>
    `,{title:'PRÉPARER',back:'home'});
  }

  function library() {
    return page(`
      <div class="library-lead">
        <h1 class="page-title">Qu’est-ce qui ferait plaisir aujourd’hui ?</h1>
        <p class="page-copy">Une idée peut être choisie telle quelle puis personnalisée.</p>
      </div>

      ${CATEGORIES.map(cat=>{
        const items=IDEAS.filter(i=>i.category===cat);
        return `<section class="category-block">
          <h2 class="category-title">${escapeHtml(cat)}</h2>
          ${items.map(idea=>`
            <button class="idea-row" data-idea-id="${idea.id}">
              <div>
                <div class="idea-title">${escapeHtml(idea.title)}</div>
                <div class="idea-copy">${escapeHtml(idea.message)}</div>
              </div>
              <div class="chevron">›</div>
            </button>`).join('')}
        </section>`;
      }).join('')}
    `,{title:'IDÉES',back:'prepare'});
  }

  function surprise() {
    return page(`
      <div class="center-stage">
        <div class="spark">✦</div>
        <h1 class="center-title">Je prépare une surprise rien que pour toi.</h1>
        <p class="center-copy">Une idée choisie dans notre carnet. Sans score, sans obligation.</p>
        <div style="width:100%;margin-top:22px">${btn('Lancer la surprise','random')}</div>
      </div>
    `,{title:'SURPRISE',back:'prepare'});
  }

  function custom() {
    const blank={title:'',message:'',to:'Toi',from:'Moi'};
    return page(`
      <h1 class="page-title">Créer le mien</h1>
      <p class="page-copy">Partir de zéro, avec seulement l’intention.</p>
      ${chequeHTML(blank)}
      <div class="btn-stack">${btn('Commencer','custom-start')}</div>
    `,{title:'CRÉER',back:'prepare'});
  }

  function edit() {
    return page(`
      <div class="section-label">APERÇU DU BON</div>
      <div id="live-cheque">${chequeHTML(state.draft,{compact:true})}</div>

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
          <input name="validity" value="${escapeHtml(state.draft.validity||'')}" placeholder="Laisser vide si aucune">
        </div>
      </form>

      <div class="btn-stack">${btn('Le bon est prêt','ready')}</div>
    `,{title:'NOUVEAU BON',back:'prepare'});
  }

  function ready() {
    return page(`
      <h1 class="center-title">Ton bon est prêt.</h1>
      <p class="center-copy">Prends un dernier instant pour le regarder avant de le confier.</p>
      <div style="margin-top:28px">${chequeHTML(state.draft)}</div>
      <div class="btn-stack">
        ${btn('Offrir ce bon','send')}
        ${btn('Modifier','edit','secondary')}
      </div>
    `,{title:'PRÊT',back:'edit'});
  }

  function sendScene() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <div class="send-stage">
        <div class="send-cheque-wrap">${chequeHTML(rec.cheque,{compact:true})}</div>
        <div class="send-envelope">${envelopeHTML()}</div>
      </div>
      <div class="send-message">
        <h1 class="center-title">C’est envoyé.</h1>
        <p class="center-copy">Ton bon attend maintenant d’être découvert.</p>
        <div class="btn-stack">
          ${btn('Retour à l’accueil','home')}
          ${btn('Voir côté destinataire',`switch-recipient:${rec.id}`,'secondary')}
        </div>
        <div class="proto-note"><span class="proto-chip">Prototype · simulation des deux personnes</span></div>
      </div>
    `,{title:'OFFERT',immersive:true});
  }

  function receiveIntro() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <div class="center-stage">
        ${envelopeHTML()}
        <h1 class="center-title">Pour toi.</h1>
        <p class="center-copy">Quelque chose t’attend. Tu choisis le moment où tu l’ouvres.</p>
        <div style="width:100%;margin-top:22px">${btn('Découvrir','start-reveal')}</div>
      </div>
    `,{title:'POUR TOI',back:'home'});
  }

  function reveal() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <div class="reveal-wrap">
        <h1 class="center-title">Pour toi.</h1>
        <p class="center-copy">Prends simplement le bon et tire doucement.</p>

        <div class="reveal-stage" id="reveal-stage">
          <div class="reveal-ticket">${chequeHTML(rec.cheque,{compact:true})}</div>
          <div class="reveal-envelope">
            <div class="env-back"></div>
            <div class="env-flap"></div>
            <div class="env-front"></div>
            <div class="env-seal">♡</div>
          </div>
          <div class="reveal-arrow">↑</div>
        </div>

        <div class="reveal-instruction" id="reveal-instruction">Tire doucement.</div>
        <div class="reveal-detail">Tu peux relâcher tant que le point de bascule n’est pas franchi : le bon retournera simplement dans son enveloppe.</div>
        <div class="reveal-progress" id="reveal-progress"><i></i></div>
        <div class="reveal-threshold"></div>
      </div>
    `,{title:'DÉCOUVRIR',immersive:true});
  }

  function discovered() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <h1 class="center-title">Il est à toi.</h1>
      <p class="center-copy">Le bon est maintenant découvert et conservé dans votre carnet.</p>
      <div class="discovery-card">${chequeHTML(rec.cheque)}</div>
      <div class="btn-stack">
        ${btn('Utiliser ce bon',`timing:${rec.id}`)}
        ${btn('Garder pour plus tard',`keep:${rec.id}`,'secondary')}
        ${btn('Voir les détails',`details:${rec.id}`,'quiet')}
      </div>
      <div class="discovery-quiet">Tu n’as rien à décider maintenant.</div>
    `,{title:'DÉCOUVERT'});
  }

  function timing() {
    const rec=currentRecord();
    if(!rec) return carnet();
    return page(`
      <h1 class="page-title">Quand veux-tu faire vivre ce bon ?</h1>
      <p class="page-copy">Un choix simple. Pas de calendrier, pas de contrainte.</p>
      <div style="margin-top:10px">${chequeHTML(rec.cheque,{compact:true})}</div>

      <div class="timing-list">
        <button class="timing-choice" data-timing="now"><b>Maintenant</b><span>☼</span></button>
        <button class="timing-choice" data-timing="tonight"><b>Ce soir</b><span>◐</span></button>
        <button class="timing-choice" data-timing="soon"><b>Bientôt</b><span>◇</span></button>
      </div>
    `,{title:'FAIRE VIVRE',back:'carnet'});
  }

  function activation() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <div class="center-stage">
        <div class="confirm-orb">♡</div>
        <h1 class="center-title">C’est décidé.</h1>
        <p class="center-copy">Ton bon va prendre vie ${timingPhrase(rec.timing,false)}. L’autre personne va être prévenue.</p>
        <div style="width:100%;margin-top:24px">
          ${btn('Voir ce que reçoit l’autre',`switch-sender:${rec.id}`)}
          <div class="btn-stack">${btn('Retour au carnet','carnet','secondary')}</div>
          <div class="proto-note"><span class="proto-chip">Prototype · notification simulée</span></div>
        </div>
      </div>
    `,{title:'C’EST DÉCIDÉ',immersive:true});
  }

  function senderEvent() {
    const rec=currentRecord();
    if(!rec) return home();
    return page(`
      <div class="sender-event">
        <div class="eyebrow">UN MOMENT À VENIR</div>
        <h1 class="center-title">Ton bon va prendre vie ${timingPhrase(rec.timing,true)}.</h1>
        <p class="center-copy">La personne à qui tu l’as offert a choisi son moment.</p>
        <div class="sender-fragment">${chequeHTML(rec.cheque,{compact:true,activation:timingLabel(rec.timing)})}</div>
      </div>

      <div class="btn-stack">
        ${btn('Voir mon carnet','carnet')}
        ${btn('Retour côté destinataire',`switch-back:${rec.id}`,'secondary')}
      </div>
      <div class="proto-note"><span class="proto-chip">Prototype · perspective expéditeur</span></div>
    `,{title:'À TOI',immersive:true});
  }

  function usedScene() {
    const rec=currentRecord();
    if(!rec) return carnet();
    return page(`
      <div class="center-stage">
        <h1 class="center-title">C’est parti.</h1>
        <p class="center-copy">Le bon devient maintenant un moment vécu et restera dans votre carnet.</p>
        <div class="use-stamp-scene" style="width:100%">
          ${chequeHTML(rec.cheque,{compact:true})}
          <div class="used-stamp"><b>UTILISÉ</b><span>♡</span></div>
        </div>
        <div style="width:100%;margin-top:24px">${btn('Voir le carnet','carnet')}</div>
      </div>
    `,{title:'UTILISÉ',immersive:true});
  }

  function carnetRecords(filter) {
    if(filter==='available') return state.records.filter(r=>r.status==='revealed'||r.status==='scheduled');
    if(filter==='used') return state.records.filter(r=>r.status==='used');
    return [...state.records];
  }

  function recordStatus(rec) {
    if(rec.status==='offered') return 'Offert — il attend encore d’être découvert';
    if(rec.status==='revealed') return 'Découvert — encore disponible';
    if(rec.status==='scheduled') return `Va prendre vie ${timingPhrase(rec.timing,false)}`;
    if(rec.status==='used') return 'Utilisé — conservé dans votre carnet';
    return '';
  }

  function carnet() {
    const list=carnetRecords(state.carnetFilter);
    let idx=state.albumIndex[state.carnetFilter]||0;
    if(idx>=list.length) idx=Math.max(0,list.length-1);
    state.albumIndex[state.carnetFilter]=idx;
    const rec=list[idx]||null;

    let album='';
    if(!rec) {
      const copy=state.carnetFilter==='available'
        ? 'Aucun bon disponible pour le moment. Les prochains bons découverts t’attendront ici.'
        : state.carnetFilter==='used'
          ? 'Aucun bon utilisé pour le moment. Les moments vécus resteront ici.'
          : 'Aucun bon offert pour le moment.';
      album=`<div class="empty-state">
        <div class="empty-book"></div>
        <div class="empty-title">Le carnet est calme.</div>
        <div class="empty-copy">${copy}</div>
      </div>`;
    } else {
      const activation=rec.status==='scheduled'?timingLabel(rec.timing):null;
      album=`
        <div class="album-stack">
          ${list.length>2?'<div class="album-shadow-card one"></div>':''}
          ${list.length>1?'<div class="album-shadow-card two"></div>':''}
          <div class="album-front">${chequeHTML(rec.cheque,{compact:true,used:rec.status==='used',activation})}</div>
        </div>
        <div class="album-controls">
          <button class="album-arrow" data-album="-1" ${idx===0?'disabled':''}>‹</button>
          <div class="album-count">${idx+1} / ${list.length}</div>
          <button class="album-arrow" data-album="1" ${idx===list.length-1?'disabled':''}>›</button>
        </div>
        <div class="record-status">${recordStatus(rec)}</div>
        ${state.carnetFilter==='available'?`
          <div class="btn-stack">
            ${rec.status==='scheduled'
              ? btn('Marquer comme utilisé',`confirm-use:${rec.id}`)
              : btn('Utiliser ce bon',`timing:${rec.id}`)}
            ${btn('Voir les détails',`details:${rec.id}`,'secondary')}
          </div>`:''}
      `;
    }

    return page(`
      <h1 class="page-title">Notre carnet</h1>
      <p class="page-copy">Un album à feuilleter, pas une liste à gérer.</p>

      <div class="segmented">
        ${segment('available','Disponibles')}
        ${segment('used','Utilisés')}
        ${segment('offered','Offerts')}
      </div>

      <div class="album-shell">${album}</div>
      <div class="album-note">${albumPhrase()}</div>
    `,{title:'CARNET'});
  }

  function segment(key,label) {
    return `<button class="segment-btn ${state.carnetFilter===key?'active':''}" data-filter="${key}">${label}</button>`;
  }

  function albumPhrase() {
    if(state.carnetFilter==='available') return 'Des attentions découvertes, à faire vivre quand le moment sera juste.';
    if(state.carnetFilter==='used') return 'Les bons vécus restent là, comme des pages déjà écrites.';
    return 'Les bons offerts racontent leur propre chemin : attente, découverte, moment à venir, souvenir.';
  }

  function ideas() {
    return library();
  }

  function settings() {
    return page(`
      <h1 class="page-title">Réglages</h1>
      <p class="page-copy">Peu d’options, uniquement celles qui protègent ou simplifient l’expérience.</p>

      <div class="settings-list">
        ${settingCard('notifications','Notifications discrètes','Aucun titre de bon ni message personnel ne doit apparaître publiquement.')}
        ${settingCard('faceId','Verrouillage Face ID','Sera validé dans la version native finale.')}
      </div>

      <div class="info-card">
        <div class="info-title">Prototype web 0.5</div>
        <div class="info-copy">Cette version simule les deux personnes sur un seul appareil. Les bons restent stockés localement dans Safari.</div>
      </div>

      <div class="info-card">
        <div class="info-title">Perspective de test</div>
        <div class="info-copy">Actuelle : <b>${state.perspective==='recipient'?'destinataire':'expéditeur'}</b>. Les changements de perspective ne simulent pas encore deux comptes réels.</div>
        <div class="btn-stack">
          ${btn(state.perspective==='recipient'?'Passer côté expéditeur':'Passer côté destinataire','toggle-perspective','secondary')}
        </div>
      </div>

      <div class="btn-stack">${btn('Réinitialiser les données de test','reset','secondary')}</div>
    `,{title:'RÉGLAGES'});
  }

  function settingCard(key,title,copy) {
    const on=!!state.settings[key];
    return `<div class="setting-card">
      <div><div class="setting-title">${title}</div><div class="setting-copy">${copy}</div></div>
      <button class="switch ${on?'on':''}" data-setting="${key}" aria-pressed="${on}"></button>
    </div>`;
  }

  function detailsModal(rec) {
    return `<div class="modal-backdrop" data-modal-close="1">
      <div class="modal" role="dialog" aria-modal="true" data-modal-panel="1">
        <div class="modal-title">${escapeHtml(rec.cheque.title)}</div>
        <div class="modal-copy">${escapeHtml(rec.cheque.message||'')}</div>
        <div class="modal-copy">Pour ${escapeHtml(rec.cheque.to||'Toi')} · de ${escapeHtml(rec.cheque.from||'Moi')}</div>
        ${rec.cheque.validity?`<div class="modal-copy">Validité : ${escapeHtml(rec.cheque.validity)}</div>`:''}
        <div class="btn-stack">${btn('Fermer','close-modal','secondary')}</div>
      </div>
    </div>`;
  }

  function useModal(rec) {
    return `<div class="modal-backdrop" data-modal-close="1">
      <div class="modal" role="dialog" aria-modal="true" data-modal-panel="1">
        <div class="modal-title">Prêt(e) à utiliser ce bon ?</div>
        <div class="modal-copy">Cette action le marquera comme utilisé, mais il restera dans votre carnet.</div>
        <div class="btn-stack">
          ${btn('Oui, utiliser',`do-use:${rec.id}`)}
          ${btn('Pas encore','close-modal','secondary')}
        </div>
      </div>
    </div>`;
  }

  function modalHTML() {
    if(!state.modal) return '';
    const rec=recordById(state.modal.id);
    if(!rec) return '';
    if(state.modal.type==='details') return detailsModal(rec);
    if(state.modal.type==='use') return useModal(rec);
    return '';
  }

  function timingLabel(t) {
    return t==='now'?'Maintenant':t==='tonight'?'Ce soir':'Bientôt';
  }

  function timingPhrase(t,sender=false) {
    if(t==='now') return sender?'maintenant':'maintenant';
    if(t==='tonight') return sender?'ce soir':'ce soir';
    return sender?'bientôt':'bientôt';
  }

  function render() {
    const screens={
      home,prepare,library,ideas,surprise,custom,edit,ready,
      sendScene,receiveIntro,reveal,discovered,carnet,timing,activation,senderEvent,usedScene,settings
    };
    const fn=screens[state.screen]||home;
    document.getElementById('app').innerHTML=fn()+modalHTML();
    bind();
    if(state.screen==='reveal') setupReveal();
  }

  function bind() {
    document.querySelectorAll('[data-back]').forEach(el=>{
      if(!el.dataset.back) return;
      el.addEventListener('click',()=>navigate(el.dataset.back));
    });

    document.querySelectorAll('[data-nav]').forEach(el=>{
      el.addEventListener('click',()=>navigate(el.dataset.nav));
    });

    document.querySelectorAll('[data-action]').forEach(el=>{
      el.addEventListener('click',()=>action(el.dataset.action));
    });

    document.querySelectorAll('[data-idea-id]').forEach(el=>{
      el.addEventListener('click',()=>{
        const idea=IDEAS.find(i=>i.id===el.dataset.ideaId);
        if(!idea) return;
        state.draft={...state.draft,title:idea.title,message:idea.message,category:idea.category};
        persist();
        navigate('edit');
      });
    });

    document.querySelectorAll('[data-filter]').forEach(el=>{
      el.addEventListener('click',()=>{
        state.carnetFilter=el.dataset.filter;
        state.albumIndex[state.carnetFilter]=0;
        persist();
        render();
      });
    });

    document.querySelectorAll('[data-album]').forEach(el=>{
      el.addEventListener('click',()=>{
        const dir=Number(el.dataset.album)||0;
        const list=carnetRecords(state.carnetFilter);
        const current=state.albumIndex[state.carnetFilter]||0;
        state.albumIndex[state.carnetFilter]=Math.max(0,Math.min(list.length-1,current+dir));
        persist();
        render();
      });
    });

    document.querySelectorAll('[data-timing]').forEach(el=>{
      el.addEventListener('click',()=>{
        const rec=currentRecord();
        if(!rec) return;
        updateRecord(rec.id,{status:'scheduled',timing:el.dataset.timing,scheduledAt:Date.now()});
        state.selectedRecordId=rec.id;
        state.currentRecordId=rec.id;
        persist();
        navigate('activation');
      });
    });

    document.querySelectorAll('[data-setting]').forEach(el=>{
      el.addEventListener('click',()=>{
        const key=el.dataset.setting;
        state.settings[key]=!state.settings[key];
        persist();render();
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(el=>{
      el.addEventListener('click',()=>setState({modal:null}));
    });
    document.querySelectorAll('[data-modal-panel]').forEach(el=>{
      el.addEventListener('click',e=>e.stopPropagation());
    });

    const form=document.getElementById('edit-form');
    if(form){
      form.addEventListener('input',()=>{
        const data=new FormData(form);
        state.draft={
          ...state.draft,
          title:String(data.get('title')||''),
          message:String(data.get('message')||''),
          to:String(data.get('to')||''),
          from:String(data.get('from')||''),
          validity:String(data.get('validity')||'')
        };
        persist();
        const live=document.getElementById('live-cheque');
        if(live) live.innerHTML=chequeHTML(state.draft,{compact:true});
      });
    }
  }

  function action(raw) {
    const first=raw.indexOf(':');
    const name=first>=0?raw.slice(0,first):raw;
    const arg=first>=0?raw.slice(first+1):'';

    if(['home','prepare','library','ideas','surprise','custom','edit','ready','carnet','settings'].includes(name)){
      navigate(name);return;
    }

    if(name==='random'){
      const idea=IDEAS[Math.floor(Math.random()*IDEAS.length)];
      state.draft={...state.draft,title:idea.title,message:idea.message,category:idea.category};
      persist();navigate('edit');return;
    }

    if(name==='custom-start'){
      state.draft={title:'',message:'',to:'Toi',from:'Moi',category:'',validity:''};
      persist();navigate('edit');return;
    }

    if(name==='send'){
      const rec={
        id:makeId(),
        cheque:{...state.draft},
        status:'offered',
        createdAt:Date.now(),
        timing:null,
        scheduledAt:null,
        revealedAt:null,
        usedAt:null
      };
      state.records=[rec,...state.records];
      state.currentRecordId=rec.id;
      state.selectedRecordId=rec.id;
      state.perspective='sender';
      persist();
      navigate('sendScene');
      return;
    }

    if(name==='switch-recipient'){
      state.perspective='recipient';
      state.currentRecordId=arg;
      state.selectedRecordId=arg;
      persist();
      navigate('receiveIntro');
      return;
    }

    if(name==='receive-intro'){
      state.currentRecordId=arg;
      state.selectedRecordId=arg;
      persist();
      navigate('receiveIntro');
      return;
    }

    if(name==='start-reveal'){
      navigate('reveal');return;
    }

    if(name==='keep'){
      updateRecord(arg,{status:'revealed'});
      state.selectedRecordId=arg;
      state.carnetFilter='available';
      persist();
      navigate('carnet');
      return;
    }

    if(name==='timing'){
      state.selectedRecordId=arg;
      persist();
      navigate('timing');
      return;
    }

    if(name==='switch-sender'){
      state.perspective='sender';
      state.selectedRecordId=arg;
      persist();
      navigate('senderEvent');
      return;
    }

    if(name==='sender-event'){
      state.selectedRecordId=arg;
      persist();
      navigate('senderEvent');
      return;
    }

    if(name==='switch-back'){
      state.perspective='recipient';
      state.selectedRecordId=arg;
      state.carnetFilter='available';
      persist();
      navigate('carnet');
      return;
    }

    if(name==='confirm-use'){
      state.selectedRecordId=arg;
      state.modal={type:'use',id:arg};
      persist();render();return;
    }

    if(name==='do-use'){
      updateRecord(arg,{status:'used',usedAt:Date.now()});
      state.selectedRecordId=arg;
      state.modal=null;
      state.carnetFilter='used';
      persist();
      navigate('usedScene');
      return;
    }

    if(name==='details'){
      state.selectedRecordId=arg;
      state.modal={type:'details',id:arg};
      persist();render();return;
    }

    if(name==='close-modal'){
      setState({modal:null});return;
    }

    if(name==='toggle-perspective'){
      state.perspective=state.perspective==='recipient'?'sender':'recipient';
      persist();navigate('home');return;
    }

    if(name==='reset'){
      if(confirm('Réinitialiser tous les bons de test de ce navigateur ?')){
        localStorage.removeItem(STORAGE_KEY);
        state=freshState();
        render();
      }
    }
  }

  function setupReveal() {
    const stage=document.getElementById('reveal-stage');
    const instruction=document.getElementById('reveal-instruction');
    const bar=document.getElementById('reveal-progress');
    if(!stage) return;

    const rec=currentRecord();
    if(!rec) return;

    let pointer=null;
    let startY=0;
    let p=0;
    let locked=false;
    const distance=320;
    const threshold=.74;

    const setP=value=>{
      p=Math.max(0,Math.min(1,value));
      stage.style.setProperty('--p',p.toFixed(4));
      if(bar) bar.style.setProperty('--p',p.toFixed(4));
    };

    const animateTo=(target,duration,done)=>{
      locked=true;
      stage.classList.add('settling');
      const from=p;
      const start=performance.now();
      const ease=t=>1-Math.pow(1-t,3);
      const frame=now=>{
        const t=Math.min(1,(now-start)/duration);
        setP(from+(target-from)*ease(t));
        if(t<1) requestAnimationFrame(frame);
        else{
          locked=false;
          stage.classList.remove('settling');
          done&&done();
        }
      };
      requestAnimationFrame(frame);
    };

    stage.addEventListener('pointerdown',e=>{
      if(locked) return;
      pointer=e.pointerId;
      startY=e.clientY;
      stage.classList.add('dragging');
      try{stage.setPointerCapture(pointer)}catch(_){}
      instruction.textContent='Continue doucement…';
    });

    stage.addEventListener('pointermove',e=>{
      if(e.pointerId!==pointer||locked) return;
      const dy=Math.max(0,startY-e.clientY);
      setP(dy/distance);
      if(p>.20 && p<.46) instruction.textContent='L’enveloppe s’ouvre…';
      else if(p>=.46 && p<threshold) instruction.textContent='Le bon se libère…';
      else if(p>=threshold) instruction.textContent='Encore un peu…';
    });

    const finish=e=>{
      if(e.pointerId!==pointer||locked) return;
      stage.classList.remove('dragging');
      try{stage.releasePointerCapture(pointer)}catch(_){}
      pointer=null;

      if(p>=threshold){
        instruction.textContent='Le bon se révèle…';
        if(navigator.vibrate) {
          try{navigator.vibrate(24)}catch(_){}
        }
        animateTo(1,610,()=>{
          updateRecord(rec.id,{status:'revealed',revealedAt:Date.now()});
          state.selectedRecordId=rec.id;
          state.currentRecordId=rec.id;
          persist();
          setTimeout(()=>navigate('discovered'),260);
        });
      }else{
        instruction.textContent='Tire doucement.';
        animateTo(0,340);
      }
    };

    stage.addEventListener('pointerup',finish);
    stage.addEventListener('pointercancel',finish);

    // Si Safari retire la capture du pointeur avant la fin, on revient à l'état fermé.
    stage.addEventListener('lostpointercapture',e=>{
      if(pointer!==null && !locked){
        pointer=null;
        stage.classList.remove('dragging');
        instruction.textContent='Tire doucement.';
        animateTo(0,300);
      }
    });
  }

  render();
})();
