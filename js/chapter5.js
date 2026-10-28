/* SHEMLUM V — toda la experiencia se ejecuta localmente, sin servicios externos. */
(() => {
  'use strict';
  const root = document.getElementById('chapter5');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const views = $$('[data-v5-scene]');
  const prev = $('#v5Back');
  const progress = $('#v5Progress');
  let scene = 0;
  const ghostPhotos = [
    'assets/chapter5/fantasmitas/fantasmita_1.jpeg',
    'assets/chapter5/fantasmitas/fantasmita_2.jpeg',
    'assets/chapter5/fantasmitas/fantasmita_3.jpeg',
    'assets/chapter5/fantasmitas/fantasmita_4.jpeg',
    'assets/chapter5/fantasmitas/fantasmita_5.jpeg'
  ];
  const graveMessages = [
    'Aquí descansan los planes perfectos. Los improvisados contigo también pueden convertirse en días preciosos. 🌼',
    'Aquí descansa el miedo a empezar. Porque los sueños se construyen un paso a la vez. ✦',
    'Aquí descansan las prisas. Los momentos contigo merecen disfrutarse sin mirar el reloj. ♡',
    'Aquí descansa el orgullo. Siempre habrá más espacio para escucharnos y cuidarnos. ✿'
  ];
  const candleMessages = [
    'Mes I · El inicio. Un «nosotros» que empezó a escribir su historia.',
    'Mes II · La complicidad. Encontrar pequeñas razones para sonreír juntos.',
    'Mes III · El cariño. Aprender a conocernos un poquito más.',
    'Mes IV · La admiración. Seguir descubriendo cosas bonitas del otro.',
    'Mes V · La gratitud. Gracias por acompañarme y creer en mí, mi amor. ♡'
  ];
  let foundGhosts = new Set();
  let litCandles = new Set();
  let readGraves = new Set();
  let pumpkinLit = false;
  const pumpkin = { eye:'tri', nose:'tri', mouth:'smile' };
  const ghostCount = $('#v5GhostCount');
  const candleCount = $('#v5CandleCount');

  function setScene(index) {
    scene = Math.max(0, Math.min(views.length - 1, index));
    views.forEach((view, i) => {
      const active = i === scene;
      view.classList.toggle('is-active', active);
      view.hidden = !active;
      view.setAttribute('aria-hidden', String(!active));
    });
    progress.textContent = `${String(scene + 1).padStart(2, '0')} / 07`;
    prev.textContent = scene === 0 ? '← Inicio' : '← Volver';
    prev.setAttribute('aria-label', scene === 0 ? 'Volver al inicio de SHEMLUM' : 'Volver a la escena anterior');
    window.scrollTo({ top:0, left:0, behavior:'instant' });
  }

  $$('.v5-primary[data-v5-next]').forEach(button => button.addEventListener('click', () => setScene(scene + 1)));
  prev.addEventListener('click', () => {
    if (scene > 0) setScene(scene - 1);
    else if (typeof goToScreen === 'function' && typeof screens !== 'undefined') {
      goToScreen(screens.chapter5, screens.home);
    } else {
      root.classList.remove('active');
      document.getElementById('home')?.classList.add('active');
    }
  });

  // Estrellitas y pétalos: estables, ligeros y solo CSS.
  const stars = $('#v5Stars');
  const petals = $('#v5Petals');
  for (let i = 0; i < 48; i++) {
    const el = document.createElement('i');
    el.className = 'v5-star';
    el.style.left = `${((i * 61 + 17) % 97) + 1}%`;
    el.style.top = `${((i * 43 + 11) % 87) + 5}%`;
    el.style.animationDelay = `${(i % 11) * -.38}s`;
    el.style.opacity = `${.28 + (i % 4) * .1}`;
    stars.appendChild(el);
  }
  for (let i = 0; i < 13; i++) {
    const el = document.createElement('i');
    el.className = 'v5-petal';
    el.style.left = `${(i * 27 + 9) % 98}%`;
    el.style.animationDelay = `${i * -1.8}s`;
    el.style.animationDuration = `${13 + (i % 5) * 4}s`;
    petals.appendChild(el);
  }

  // Cinco fantasmitas: cada uno revela una foto REAL, sin filtros ni modificaciones.
  const photoModal = $('#v5GhostPhotoModal');
  const photoImage = $('#v5GhostPhotoImage');
  const photoNumber = $('#v5GhostPhotoNumber');
  const photoClose = $('#v5GhostPhotoClose');
  let previousPhotoFocus = null;
  function closeGhostPhoto() {
    if (photoModal.hidden) return;
    photoModal.hidden = true;
    photoModal.setAttribute('aria-hidden', 'true');
    photoImage.removeAttribute('src');
    document.body.classList.remove('v5-photo-open');
    previousPhotoFocus?.focus();
  }
  function openGhostPhoto(n, trigger) {
    previousPhotoFocus = trigger;
    photoImage.src = ghostPhotos[n];
    photoImage.alt = `Foto divertida ${n+1} de 5`;
    photoNumber.textContent = `${n+1} / 5`;
    photoModal.hidden = false;
    photoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('v5-photo-open');
    photoClose.focus();
  }
  $$('#v5GhostPhotoModal [data-close-ghost-photo]').forEach(button => button.addEventListener('click', closeGhostPhoto));
  photoClose.addEventListener('click', closeGhostPhoto);
  document.addEventListener('keydown', event => {
    if (photoModal.hidden) return;
    if (event.key === 'Escape') closeGhostPhoto();
    if (event.key === 'Tab') {
      const controls = [photoClose, ...$$('#v5GhostPhotoModal [data-close-ghost-photo]').filter(e => e.tagName === 'BUTTON')];
      const current = controls.indexOf(document.activeElement);
      if (event.shiftKey && current === 0) {event.preventDefault(); controls[controls.length - 1].focus();}
      else if (!event.shiftKey && current === controls.length - 1) {event.preventDefault(); controls[0].focus();}
    }
  });
  $$('.v5-ghost').forEach(button => button.addEventListener('click', () => {
    const n = Number(button.dataset.ghost);
    if (foundGhosts.has(n)) return;
    foundGhosts.add(n);
    button.classList.add('found');
    button.setAttribute('aria-label', `Fantasmita ${n + 1} encontrado`);
    const filled = [...Array(5)].map((_, i) => i < foundGhosts.size ? '✦' : '✧').join(' ');
    ghostCount.innerHTML = `${filled} <span>${foundGhosts.size} de 5</span>`;
    $('#v5GhostMessage').textContent = foundGhosts.size === 5
      ? '¡Encontraste las cinco fotos! Ya podemos continuar. ♡'
      : `¡Fantasmita descubierto! ${foundGhosts.size} de 5 recuerdos encontrados.`;
    if (foundGhosts.size === 5) $('#v5GhostNext').disabled = false;
    openGhostPhoto(n, button);
  }));

  // Cementerio: tocar y descubrir epitafios.
  $$('.v5-grave').forEach(button => button.addEventListener('click', () => {
    const n = Number(button.dataset.grave);
    readGraves.add(n);
    button.classList.add('is-read');
    button.querySelector('small').textContent = 'Descubierto ♡';
    $('#v5GraveNote').textContent = graveMessages[n];
  }));

  // Ofrenda: una vela por cada mes.
  $$('.v5-candle').forEach(button => button.addEventListener('click', () => {
    const n = Number(button.dataset.candle);
    if (!litCandles.has(n)) {
      litCandles.add(n);
      button.classList.add('lit');
      button.setAttribute('aria-label', `Vela del mes ${n + 1} encendida`);
    }
    $('#v5CandleMessage').textContent = candleMessages[n];
    candleCount.textContent = `${litCandles.size} de 5 luces encendidas`;
    if (litCandles.size === 5) {
      $('#v5CandleNext').disabled = false;
      candleCount.textContent = 'Las cinco luces están encendidas. ♡';
    }
  }));

  // Tallado SVG: cambiamos solo la geometría de ojos, nariz y boca.
  const eyesSvg = $('#v5EyeShapes');
  const noseSvg = $('#v5NoseShape');
  const mouthSvg = $('#v5MouthShape');
  const eyeShapes = {
    tri:'<path d="M105 145 L126 110 146 145 Z M186 145 L207 110 228 145 Z"/>',
    round:'<ellipse cx="126" cy="128" rx="18" ry="21"/><ellipse cx="206" cy="128" rx="18" ry="21"/>',
    happy:'<path d="M107 141 Q125 105 145 141 L135 141 Q125 126 117 141 Z M187 141 Q204 105 224 141 L215 141 Q204 126 196 141 Z"/>'
  };
  const noses = {tri:'<path d="M163 150 L150 176 L175 176 Z"/>',none:''};
  const mouths = {
    smile:'<path d="M105 198 Q165 263 228 198 Q215 244 166 245 Q123 241 105 198Z"/><path d="M132 230 L141 238 147 223 M187 225 L193 240 202 227" stroke="#ecaa43" stroke-width="6"/>',
    spooky:'<path d="M101 207 L119 191 133 209 148 190 161 209 177 190 191 210 210 192 232 210 Q169 266 101 207Z"/>',
    heart:'<path d="M165 250 Q100 201 113 181 Q132 158 164 194 Q196 158 217 181 Q240 205 165 250Z"/>'
  };
  function drawPumpkin() {
    eyesSvg.innerHTML = eyeShapes[pumpkin.eye];
    noseSvg.innerHTML = noses[pumpkin.nose];
    mouthSvg.innerHTML = mouths[pumpkin.mouth];
  }
  drawPumpkin();
  $$('[data-v5-eye], [data-v5-nose], [data-v5-mouth]').forEach(button => button.addEventListener('click', () => {
    const attr = Object.keys(button.dataset).find(k => ['v5Eye','v5Nose','v5Mouth'].includes(k));
    const kind = attr === 'v5Eye' ? 'eye' : attr === 'v5Nose' ? 'nose' : 'mouth';
    pumpkin[kind] = button.dataset[attr];
    $$(`[data-v5-${kind}]`).forEach(option => option.classList.toggle('is-selected', option === button));
    drawPumpkin();
    if (pumpkinLit) $('#v5PumpkinMessage').textContent = '¡Tu calabaza está brillando! ♡';
  }));
  $('#v5LightPumpkin').addEventListener('click', () => {
    pumpkinLit = !pumpkinLit;
    $('#v5PumpkinPreview').classList.toggle('is-lit', pumpkinLit);
    $('#v5PumpkinNext').disabled = !pumpkinLit;
    $('#v5LightPumpkin').textContent = pumpkinLit ? '☾ Apagar calabaza' : '✦ Encender mi calabaza';
    $('#v5PumpkinMessage').textContent = pumpkinLit ? 'Y de pronto, hasta la noche más oscura se llena de luz. ✦' : 'Apagamos la luz... pero la magia sigue aquí.';
  });

  $('#v5HeartReveal').addEventListener('click', () => setScene(6));
  $('#v5Restart').addEventListener('click', () => { window.resetChapterFive(); setScene(0); });

  window.resetChapterFive = function resetChapterFive() {
    foundGhosts.clear(); litCandles.clear(); readGraves.clear(); pumpkinLit = false;
    $$('.v5-ghost').forEach((b,i) => { b.classList.remove('found'); b.setAttribute('aria-label',`Encontrar fantasmita ${i+1}`); });
    ghostCount.innerHTML = '✧ ✧ ✧ ✧ ✧ <span>0 de 5</span>';
    $('#v5GhostMessage').textContent = 'Toca un fantasmita para descubrir su foto...';
    $('#v5GhostNext').disabled = true;
    $$('.v5-grave').forEach(b => { b.classList.remove('is-read'); b.querySelector('small').textContent = 'Tócame'; });
    $('#v5GraveNote').textContent = 'Cuatro secretos descansan bajo estas lápidas.';
    $$('.v5-candle').forEach((b,i) => { b.classList.remove('lit'); b.setAttribute('aria-label',`Encender vela del mes ${i+1}`); });
    candleCount.textContent = '0 de 5 luces encendidas';
    $('#v5CandleMessage').textContent = 'Toca una velita para darle luz a un recuerdo de lo que somos.';
    $('#v5CandleNext').disabled = true;
    pumpkin.eye = 'tri'; pumpkin.nose = 'tri'; pumpkin.mouth = 'smile'; drawPumpkin();
    $$('[data-v5-eye], [data-v5-nose], [data-v5-mouth]').forEach(b => {
      b.classList.toggle('is-selected',b.dataset.v5Eye === 'tri' || b.dataset.v5Nose === 'tri' || b.dataset.v5Mouth === 'smile');
    });
    $('#v5PumpkinPreview').classList.remove('is-lit');
    $('#v5PumpkinNext').disabled = true;
    $('#v5LightPumpkin').textContent = '✦ Encender mi calabaza';
    $('#v5PumpkinMessage').textContent = 'Cada calabaza es distinta. Qué bonito, ¿no?';
    setScene(0);
  };
  setScene(0);
})();
