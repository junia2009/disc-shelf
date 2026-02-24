/* ============================================
   DISC SHELF — Portal App Logic (Three.js 3D)
   ============================================ */
(() => {
  'use strict';

  // ==========================================================
  //  APP DATA — ディスク（＝アプリ）一覧
  //  新しいWebアプリを作るたびに、ここにオブジェクトを追加するだけ！
  // ==========================================================
  const DISCS = [
    // --- サンプル: このアプリ自身 ---
    {
      id: 'disc-shelf',
      name: 'DISC SHELF',
      description: 'あなたが今見ているこのアプリ。3Dバイナルレコード風UIのポータルサイト。',
      color: '#6C63FF',
      url: 'https://junia2009.github.io/disc-shelf/',
      repo: 'https://github.com/junia2009/disc-shelf',
      tags: ['Three.js', 'Portal', 'PWA'],
    },
    {
      id: 'my-timer',
      name: 'My タイマー',
      description: '自分用に作成したタイマーアプリ',
      color: '#FF6584',
      url: 'https://junia2009.github.io/app_timer/',
      repo: 'https://github.com/junia2009/app_timer',
      tags: ['JS', 'tool'],
    },
    {
      id: 'grow_model',
      name: 'GROWモデルシート',
      description: 'GROWモデルの実戦用アプリ',
      color: '#00C9A7',
      url: 'https://junia2009.github.io/grow-recruiter-app/',
      repo: 'https://github.com/junia2009/grow-recruiter-app',
      tags: ['HTML', 'tool'],
    },
    // --- 今後アプリを作るたびに追加 ---
  ];

  // ==========================================================
  //  DOM
  // ==========================================================
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const shelfView     = $('#shelf-view');
  const logoHome      = $('#logo-home');
  const tooltip       = $('#disc-tooltip');
  const modalLaunch   = $('#modal-launch');
  const modalClose    = $('#modal-launch-close');

  let currentDiscId = null;

  // ==========================================================
  //  THREE.JS — SHELF VIEW (3D Carousel)
  // ==========================================================
  let shelfScene, shelfCamera, shelfRenderer;
  let shelfDiscs3D = [];
  let shelfRaycaster, shelfMouse;
  let shelfAnimId = null;
  let autoRotate = true;
  let carouselAngle = 0, targetCarouselAngle = 0;
  let isDragging = false, dragStartX = 0, dragStartAngle = 0;
  let hoveredDisc = null;

  function initShelfScene() {
    const container = $('#shelf-3d-container');
    const canvas = $('#shelf-canvas');
    const w = container.clientWidth;
    const h = container.clientHeight;

    shelfScene = new THREE.Scene();
    shelfScene.fog = new THREE.FogExp2(0x08080f, 0.012);

    shelfCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    shelfCamera.position.set(0, 2, 12);
    shelfCamera.lookAt(0, 0, 0);

    shelfRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    shelfRenderer.setSize(w, h);
    shelfRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    shelfRenderer.shadowMap.enabled = true;
    shelfRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    shelfRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    shelfRenderer.toneMappingExposure = 1.2;

    // Lights
    shelfScene.add(new THREE.AmbientLight(0x333355, 0.6));

    const spot = new THREE.SpotLight(0xffffff, 1.5, 60, Math.PI / 4, 0.5, 1);
    spot.position.set(0, 15, 10);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    shelfScene.add(spot);

    const pl1 = new THREE.PointLight(0x6C63FF, 1.2, 30);
    pl1.position.set(-8, 3, 5);
    shelfScene.add(pl1);

    const pl2 = new THREE.PointLight(0xFF6584, 0.8, 30);
    pl2.position.set(8, 3, 5);
    shelfScene.add(pl2);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x08080f, metalness: 0.9, roughness: 0.4,
      transparent: true, opacity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    shelfScene.add(ground);

    // Particles
    createParticleField(shelfScene);

    shelfRaycaster = new THREE.Raycaster();
    shelfMouse = new THREE.Vector2(-999, -999);

    buildShelfDiscs();

    // Events
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    animateShelf();
  }

  function createParticleField(scene) {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - .5) * 50;
      pos[i * 3 + 1] = (Math.random() - .5) * 30;
      pos[i * 3 + 2] = (Math.random() - .5) * 50;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x6C63FF, size: 0.06,
      transparent: true, opacity: 0.6, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    pts.userData.isParticles = true;
    scene.add(pts);
  }

  // --- 3Dディスクを1枚つくる ---
  function createDisc3D(discData, index) {
    const group = new THREE.Group();
    group.userData = { discId: discData.id, index };
    const color = new THREE.Color(discData.color);

    // Vinyl body
    const bodyGeo = new THREE.CylinderGeometry(2, 2, 0.12, 64, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111111, metalness: 0.85, roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Grooves
    for (let r = 0.5; r < 1.85; r += 0.12) {
      const gGeo = new THREE.TorusGeometry(r, 0.008, 4, 64);
      const gMat = new THREE.MeshStandardMaterial({
        color: 0x222222, metalness: 0.9, roughness: 0.15,
      });
      const g = new THREE.Mesh(gGeo, gMat);
      g.rotation.x = Math.PI / 2;
      g.position.y = 0.065;
      group.add(g);
    }

    // Label
    const lblGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.14, 64, 1);
    const lblMat = new THREE.MeshStandardMaterial({
      color, metalness: 0.3, roughness: 0.5,
      emissive: color, emissiveIntensity: 0.3,
    });
    group.add(new THREE.Mesh(lblGeo, lblMat));

    // Hole
    const hGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    group.add(new THREE.Mesh(hGeo, new THREE.MeshStandardMaterial({ color: 0x000000 })));

    // Rim glow
    const rimGeo = new THREE.TorusGeometry(2.0, 0.025, 8, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.6,
      metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.7,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // Sheen
    const sheenGeo = new THREE.CylinderGeometry(1.95, 1.95, 0.005, 64, 1);
    const sheenMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000, metalness: 1.0, roughness: 0.05,
      clearcoat: 1.0, clearcoatRoughness: 0.05,
      transparent: true, opacity: 0.25,
    });
    const sheen = new THREE.Mesh(sheenGeo, sheenMat);
    sheen.position.y = 0.07;
    group.add(sheen);

    group.rotation.x = Math.PI * 0.08;
    return group;
  }

  function buildShelfDiscs() {
    shelfDiscs3D.forEach(d => shelfScene.remove(d));
    shelfDiscs3D = [];
    DISCS.forEach((disc, i) => {
      const mesh = createDisc3D(disc, i);
      shelfScene.add(mesh);
      shelfDiscs3D.push(mesh);
    });
  }

  function layoutCarousel(time) {
    const count = shelfDiscs3D.length;
    if (!count) return;
    const radius = Math.max(5, count * 1.3);

    shelfDiscs3D.forEach((group, i) => {
      const angle = carouselAngle + (i / count) * Math.PI * 2;
      group.position.x = Math.sin(angle) * radius;
      group.position.z = Math.cos(angle) * radius - radius + 3;
      group.position.y = Math.sin(time * 0.8 + i * 0.7) * 0.15;

      group.children[0].rotation.y += 0.005;
      group.children.forEach((c, ci) => { if (ci > 0) c.rotation.y = group.children[0].rotation.y; });

      const z = group.position.z;
      const scale = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(z, -radius * 2, 5, 0.5, 1.0), 0.45, 1.0
      );
      group.scale.setScalar(hoveredDisc === group ? scale * 1.15 : scale);
    });
  }

  function animateShelf() {
    shelfAnimId = requestAnimationFrame(animateShelf);
    const time = performance.now() * 0.001;

    if (autoRotate && !isDragging) targetCarouselAngle += 0.0015;
    carouselAngle += (targetCarouselAngle - carouselAngle) * 0.075;
    layoutCarousel(time);

    shelfScene.children.forEach(c => {
      if (c.userData?.isParticles) c.rotation.y = time * 0.02;
    });

    shelfRenderer.render(shelfScene, shelfCamera);
  }

  function stopShelfAnim() { if (shelfAnimId) { cancelAnimationFrame(shelfAnimId); shelfAnimId = null; } }

  // --- Interactions ---
  function canvasCoords(e) {
    const r = $('#shelf-canvas').getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
  }

  function onMouseDown(e) { isDragging = true; autoRotate = false; dragStartX = e.clientX; dragStartAngle = targetCarouselAngle; }
  function onMouseUp() { isDragging = false; setTimeout(() => { autoRotate = true; }, 3000); }
  function onMouseLeave() { isDragging = false; hoveredDisc = null; tooltip.classList.add('hidden'); setTimeout(() => { autoRotate = true; }, 1000); }

  function onMouseMove(e) {
    const c = canvasCoords(e);
    shelfMouse.set(c.x, c.y);

    if (isDragging) {
      targetCarouselAngle = dragStartAngle + (e.clientX - dragStartX) * 0.005;
      tooltip.classList.add('hidden');
      return;
    }

    shelfRaycaster.setFromCamera(shelfMouse, shelfCamera);
    let hit = null;
    for (const g of shelfDiscs3D) {
      if (shelfRaycaster.intersectObjects(g.children, true).length) { hit = g; break; }
    }

    if (hit !== hoveredDisc) {
      hoveredDisc = hit;
      $('#shelf-canvas').style.cursor = hit ? 'pointer' : 'grab';
      if (hit) {
        const disc = DISCS.find(d => d.id === hit.userData.discId);
        if (disc) {
          tooltip.innerHTML = `
            <div class="tt-name" style="color:${disc.color}">${esc(disc.name)}</div>
            <div class="tt-desc">${esc(disc.description.slice(0, 50))}…</div>
            <div class="tt-hint">クリックで読み込む</div>`;
          tooltip.classList.remove('hidden');
        }
      } else {
        tooltip.classList.add('hidden');
      }
    }

    if (hoveredDisc) {
      const rect = $('#shelf-3d-container').getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  - 10) + 'px';
    }
  }

  function onClick(e) {
    if (Math.abs(e.clientX - dragStartX) > 5) return;
    const c = canvasCoords(e);
    shelfRaycaster.setFromCamera(new THREE.Vector2(c.x, c.y), shelfCamera);
    for (const g of shelfDiscs3D) {
      if (shelfRaycaster.intersectObjects(g.children, true).length) {
        openDisc(g.userData.discId);
        return;
      }
    }
  }

  let touchStartX = 0;
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true; autoRotate = false;
      touchStartX = e.touches[0].clientX;
      dragStartX = touchStartX;
      dragStartAngle = targetCarouselAngle;
    }
  }
  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      targetCarouselAngle = dragStartAngle + (e.touches[0].clientX - dragStartX) * 0.005;
    }
  }
  function onTouchEnd(e) {
    if (isDragging && Math.abs((e.changedTouches[0]?.clientX || 0) - touchStartX) < 10) {
      const t = e.changedTouches[0];
      const c = canvasCoords(t);
      shelfRaycaster.setFromCamera(new THREE.Vector2(c.x, c.y), shelfCamera);
      for (const g of shelfDiscs3D) {
        if (shelfRaycaster.intersectObjects(g.children, true).length) { openDisc(g.userData.discId); break; }
      }
    }
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 3000);
  }

  function onWheel(e) {
    e.preventDefault();
    targetCarouselAngle += e.deltaY * 0.002;
    autoRotate = false;
    clearTimeout(onWheel._t);
    onWheel._t = setTimeout(() => { autoRotate = true; }, 2000);
  }

  function onResize() {
    const c = $('#shelf-3d-container');
    shelfCamera.aspect = c.clientWidth / c.clientHeight;
    shelfCamera.updateProjectionMatrix();
    shelfRenderer.setSize(c.clientWidth, c.clientHeight);
  }

  // ==========================================================
  //  MODAL — ディスク確認モーダル
  // ==========================================================
  function openModal() { modalLaunch.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modalLaunch.classList.remove('open'); document.body.style.overflow = ''; currentDiscId = null; }

  modalClose.addEventListener('click', closeModal);
  modalLaunch.addEventListener('click', e => { if (e.target === modalLaunch) closeModal(); });

  function openDisc(discId) {
    currentDiscId = discId;
    const disc = DISCS.find(d => d.id === discId);
    if (!disc) return;

    // モーダルにディスク情報をセット
    const ring = $('#modal-disc-ring');
    ring.style.boxShadow = `0 0 0 3px ${disc.color}44, 0 0 30px ${disc.color}33`;
    const inner = ring.querySelector('.modal-disc-inner');
    inner.style.background = disc.color;

    const nameEl = $('#modal-launch-name');
    nameEl.textContent = disc.name;
    nameEl.style.background = `linear-gradient(135deg, #fff, ${disc.color})`;
    nameEl.style.webkitBackgroundClip = 'text';
    nameEl.style.webkitTextFillColor = 'transparent';
    nameEl.style.backgroundClip = 'text';

    $('#modal-launch-desc').textContent = disc.description;

    $('#modal-launch-tags').innerHTML = disc.tags.map(t =>
      `<span class="meta-tag"><span class="meta-icon">#</span>${esc(t)}</span>`
    ).join('');

    const btnLaunch = $('#btn-launch');
    btnLaunch.href = disc.url;
    btnLaunch.style.background = `linear-gradient(135deg, ${disc.color}, ${shiftHue(disc.color, 30)})`;
    btnLaunch.style.boxShadow = `0 4px 24px ${disc.color}66`;

    $('#btn-repo').href = disc.repo;

    openModal();
  }

  // ==========================================================
  //  EVENTS
  // ==========================================================
  logoHome.addEventListener('click', closeModal);

  // ==========================================================
  //  UTILITIES
  // ==========================================================
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function shiftHue(hex, deg) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }

    h = (h + deg / 360) % 1;
    if (h < 0) h += 1;

    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  }

  // ==========================================================
  //  INIT
  // ==========================================================
  initShelfScene();
})();
