/* ============================================
   DISC SHELF — Application Logic (Three.js 3D Edition)
   ============================================ */
(() => {
  'use strict';

  // ========== Storage ==========
  const STORAGE_KEY = 'discshelf_data_v2';

  function _uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  const defaultDiscs = [
    {
      id: _uid(), genre: 'おいしいごはん屋さん',
      description: '街で見つけた最高の一皿。みんなの「ここ行って！」を集めよう。',
      color: '#FF6584',
      messages: [
        { id: _uid(), nick: '食いしん坊', body: '下北沢の裏路地にあるカレー屋「spice note」、マジで人生変わる。チキンカレーにレモン絞って食べてみて。', time: '2026-02-20T10:30:00' },
        { id: _uid(), nick: '深夜の住人', body: '新宿三丁目の「麺屋 翔」。鶏白湯が胃に染みる。終電逃した夜にぜひ。', time: '2026-02-21T23:45:00' },
        { id: _uid(), nick: 'ランチ難民', body: '丸の内のOAZOにある「つるとんたん」、うどんのボリュームえぐい。780円で腹パンになれる。', time: '2026-02-22T12:15:00' },
      ]
    },
    {
      id: _uid(), genre: '最近観た映画',
      description: '映画館を出たあとの余韻を、ここに置いていこう。',
      color: '#6C63FF',
      messages: [
        { id: _uid(), nick: 'シネマ中毒', body: '「ミッドナイト・ライブラリー」観てきた。自分のif人生を追体験するシーンで泣いた。一人で観に行って正解だった。', time: '2026-02-19T18:00:00' },
        { id: _uid(), nick: '匿名', body: 'IMAXで「DUNE Part 3」。砂漠の映像美がやばい。音圧で椅子が震えた。', time: '2026-02-23T20:30:00' },
      ]
    },
    {
      id: _uid(), genre: '散歩で見つけたもの',
      description: '何気ない散歩で出会った小さな発見を書き留めよう。',
      color: '#43E97B',
      messages: [
        { id: _uid(), nick: '朝型人間', body: '代々木公園の南口あたり、朝6時に行くと霧がかかってて異世界感すごい。鳥の声しかしない贅沢。', time: '2026-02-18T06:20:00' },
        { id: _uid(), nick: '匿名', body: '中目黒の川沿いに猫カフェじゃないのに猫が5匹くらい集まるスポットがある。毎週日曜の夕方。', time: '2026-02-22T16:00:00' },
      ]
    },
    {
      id: _uid(), genre: '眠れない夜のひとりごと',
      description: '夜中に浮かんだ言葉、考えごと。誰かに聞いてほしいわけじゃないけど。',
      color: '#00C9FF',
      messages: [
        { id: _uid(), nick: '3時のひと', body: '最近ずっと考えてるんだけど、「退屈」って実はすごく贅沢な感情なんじゃないかな。何も起きてないってことは、平和ってことだから。', time: '2026-02-21T03:14:00' },
      ]
    },
  ];

  function loadData() {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
    return null;
  }
  function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

  let discs = loadData() || JSON.parse(JSON.stringify(defaultDiscs));
  saveData(discs);

  // ========== DOM ==========
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const shelfView = $('#shelf-view');
  const discView = $('#disc-view');
  const messagesList = $('#messages-list');
  const modalDisc = $('#modal-disc');
  const modalMsg = $('#modal-msg');
  const formDisc = $('#form-disc');
  const formMsg = $('#form-msg');
  const btnAddDisc = $('#btn-add-disc');
  const btnAddMsg = $('#btn-add-msg');
  const btnBack = $('#btn-back');
  const logoHome = $('#logo-home');
  const tooltip = $('#disc-tooltip');

  let currentDiscId = null;

  // ======================================================
  //  THREE.JS — SHELF VIEW (Carousel of 3D Discs)
  // ======================================================
  let shelfScene, shelfCamera, shelfRenderer, shelfDiscs3D = [], shelfRaycaster, shelfMouse;
  let shelfAnimId = null;
  let autoRotate = true;
  let carouselAngle = 0;
  let targetCarouselAngle = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartAngle = 0;
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
    const ambLight = new THREE.AmbientLight(0x333355, 0.6);
    shelfScene.add(ambLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 60, Math.PI / 4, 0.5, 1);
    spotLight.position.set(0, 15, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    shelfScene.add(spotLight);

    const pointLight1 = new THREE.PointLight(0x6C63FF, 1.2, 30);
    pointLight1.position.set(-8, 3, 5);
    shelfScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFF6584, 0.8, 30);
    pointLight2.position.set(8, 3, 5);
    shelfScene.add(pointLight2);

    // Ground reflection plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x08080f,
      metalness: 0.9,
      roughness: 0.4,
      transparent: true,
      opacity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    shelfScene.add(ground);

    // Particle field
    createParticleField(shelfScene);

    // Raycaster
    shelfRaycaster = new THREE.Raycaster();
    shelfMouse = new THREE.Vector2(-999, -999);

    // Build discs
    buildShelfDiscs();

    // Events
    canvas.addEventListener('mousedown', onShelfMouseDown);
    canvas.addEventListener('mousemove', onShelfMouseMove);
    canvas.addEventListener('mouseup', onShelfMouseUp);
    canvas.addEventListener('mouseleave', onShelfMouseLeave);
    canvas.addEventListener('click', onShelfClick);
    canvas.addEventListener('touchstart', onShelfTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onShelfTouchMove, { passive: false });
    canvas.addEventListener('touchend', onShelfTouchEnd);
    canvas.addEventListener('wheel', onShelfWheel, { passive: false });

    window.addEventListener('resize', onShelfResize);

    animateShelf();
  }

  function createParticleField(scene) {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x6C63FF,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.userData.isParticles = true;
    scene.add(points);
  }

  /* --- Create a single 3D disc (vinyl record) --- */
  function createDisc3D(discData, index) {
    const group = new THREE.Group();
    group.userData = { discId: discData.id, index };

    const color = new THREE.Color(discData.color);

    // --- Vinyl body (cylinder) ---
    const vinylGeo = new THREE.CylinderGeometry(2, 2, 0.12, 64, 1);
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.85,
      roughness: 0.2,
    });
    const vinyl = new THREE.Mesh(vinylGeo, vinylMat);
    vinyl.castShadow = true;
    vinyl.receiveShadow = true;
    group.add(vinyl);

    // --- Grooves (multiple thin torus rings) ---
    for (let r = 0.5; r < 1.85; r += 0.12) {
      const grooveGeo = new THREE.TorusGeometry(r, 0.008, 4, 64);
      const grooveMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.15,
      });
      const groove = new THREE.Mesh(grooveGeo, grooveMat);
      groove.rotation.x = Math.PI / 2;
      groove.position.y = 0.065;
      group.add(groove);
    }

    // --- Label (center colored area – top) ---
    const labelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.14, 64, 1);
    const labelMat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.3,
      roughness: 0.5,
      emissive: color,
      emissiveIntensity: 0.3,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.castShadow = true;
    group.add(label);

    // --- Center hole ---
    const holeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    group.add(hole);

    // --- Rim glow ring ---
    const rimGeo = new THREE.TorusGeometry(2.0, 0.025, 8, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // --- Iridescent sheen on top surface ---
    const sheenGeo = new THREE.CylinderGeometry(1.95, 1.95, 0.005, 64, 1);
    const sheenMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.25,
    });
    const sheen = new THREE.Mesh(sheenGeo, sheenMat);
    sheen.position.y = 0.07;
    group.add(sheen);

    // Tilt the disc so it faces the camera more
    group.rotation.x = Math.PI * 0.08;

    return group;
  }

  function buildShelfDiscs() {
    // Remove old
    shelfDiscs3D.forEach(d => shelfScene.remove(d));
    shelfDiscs3D = [];

    const count = discs.length;
    discs.forEach((disc, i) => {
      const mesh = createDisc3D(disc, i);
      shelfScene.add(mesh);
      shelfDiscs3D.push(mesh);
    });
  }

  function layoutCarousel(time) {
    const count = shelfDiscs3D.length;
    if (count === 0) return;

    const radius = Math.max(5, count * 1.3);

    shelfDiscs3D.forEach((group, i) => {
      const angle = carouselAngle + (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius + 3;

      group.position.x = x;
      group.position.z = z;
      group.position.y = Math.sin(time * 0.8 + i * 0.7) * 0.15;

      // Spin each disc slowly
      group.children[0].rotation.y += 0.005;
      group.children.forEach((child, ci) => {
        if (ci > 0) child.rotation.y = group.children[0].rotation.y;
      });

      // Face camera slightly
      const scale = THREE.MathUtils.mapLinear(z, -radius * 2, 5, 0.5, 1.0);
      const clampedScale = THREE.MathUtils.clamp(scale, 0.45, 1.0);
      group.scale.setScalar(clampedScale);

      // Highlight hovered
      if (hoveredDisc === group) {
        group.scale.setScalar(clampedScale * 1.15);
      }
    });
  }

  function animateShelf() {
    shelfAnimId = requestAnimationFrame(animateShelf);

    const time = performance.now() * 0.001;

    // Auto-rotate
    if (autoRotate && !isDragging) {
      targetCarouselAngle += 0.0015;
    }

    // Smooth lerp
    carouselAngle += (targetCarouselAngle - carouselAngle) * 0.06;

    layoutCarousel(time);

    // Rotate particles
    shelfScene.children.forEach(c => {
      if (c.userData && c.userData.isParticles) {
        c.rotation.y = time * 0.02;
      }
    });

    shelfRenderer.render(shelfScene, shelfCamera);
  }

  function stopShelfAnim() {
    if (shelfAnimId) { cancelAnimationFrame(shelfAnimId); shelfAnimId = null; }
  }

  // --- Shelf Interactions ---
  function getCanvasCoords(e) {
    const rect = $('#shelf-canvas').getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  function onShelfMouseDown(e) {
    isDragging = true;
    autoRotate = false;
    dragStartX = e.clientX;
    dragStartAngle = targetCarouselAngle;
  }

  function onShelfMouseMove(e) {
    const coords = getCanvasCoords(e);
    shelfMouse.set(coords.x, coords.y);

    if (isDragging) {
      const dx = e.clientX - dragStartX;
      targetCarouselAngle = dragStartAngle + dx * 0.005;
      tooltip.classList.add('hidden');
      return;
    }

    // Raycast hover
    shelfRaycaster.setFromCamera(shelfMouse, shelfCamera);
    let hit = null;
    for (const group of shelfDiscs3D) {
      const intersects = shelfRaycaster.intersectObjects(group.children, true);
      if (intersects.length > 0) { hit = group; break; }
    }

    if (hit !== hoveredDisc) {
      hoveredDisc = hit;
      $('#shelf-canvas').style.cursor = hit ? 'pointer' : 'grab';

      if (hit) {
        const disc = discs.find(d => d.id === hit.userData.discId);
        if (disc) {
          tooltip.innerHTML = `
            <div class="tt-genre" style="color:${disc.color}">${escHtml(disc.genre)}</div>
            <div class="tt-count">${disc.messages.length} メッセージ</div>
            <div class="tt-hint">クリックで開く</div>`;
          tooltip.classList.remove('hidden');
        }
      } else {
        tooltip.classList.add('hidden');
      }
    }

    if (hoveredDisc) {
      const rect = $('#shelf-3d-container').getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
    }
  }

  function onShelfMouseUp(e) {
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 3000);
  }

  function onShelfMouseLeave() {
    isDragging = false;
    hoveredDisc = null;
    tooltip.classList.add('hidden');
    setTimeout(() => { autoRotate = true; }, 1000);
  }

  function onShelfClick(e) {
    if (Math.abs(e.clientX - dragStartX) > 5) return; // was a drag

    const coords = getCanvasCoords(e);
    shelfRaycaster.setFromCamera(new THREE.Vector2(coords.x, coords.y), shelfCamera);

    for (const group of shelfDiscs3D) {
      const intersects = shelfRaycaster.intersectObjects(group.children, true);
      if (intersects.length > 0) {
        openDisc(group.userData.discId);
        return;
      }
    }
  }

  // Touch support
  let touchStartX = 0;
  function onShelfTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      autoRotate = false;
      touchStartX = e.touches[0].clientX;
      dragStartX = touchStartX;
      dragStartAngle = targetCarouselAngle;
    }
  }
  function onShelfTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStartX;
      targetCarouselAngle = dragStartAngle + dx * 0.005;
    }
  }
  function onShelfTouchEnd(e) {
    if (isDragging && Math.abs((e.changedTouches[0]?.clientX || 0) - touchStartX) < 10) {
      // Tap → click
      const touch = e.changedTouches[0];
      const coords = getCanvasCoords(touch);
      shelfRaycaster.setFromCamera(new THREE.Vector2(coords.x, coords.y), shelfCamera);
      for (const group of shelfDiscs3D) {
        const intersects = shelfRaycaster.intersectObjects(group.children, true);
        if (intersects.length > 0) { openDisc(group.userData.discId); break; }
      }
    }
    isDragging = false;
    setTimeout(() => { autoRotate = true; }, 3000);
  }

  function onShelfWheel(e) {
    e.preventDefault();
    targetCarouselAngle += e.deltaY * 0.002;
    autoRotate = false;
    clearTimeout(onShelfWheel._timer);
    onShelfWheel._timer = setTimeout(() => { autoRotate = true; }, 2000);
  }

  function onShelfResize() {
    const container = $('#shelf-3d-container');
    const w = container.clientWidth;
    const h = container.clientHeight;
    shelfCamera.aspect = w / h;
    shelfCamera.updateProjectionMatrix();
    shelfRenderer.setSize(w, h);

    if (discRenderer) {
      const dc = $('#disc-3d-container');
      const dw = dc.clientWidth;
      const dh = dc.clientHeight;
      discCamera.aspect = dw / dh;
      discCamera.updateProjectionMatrix();
      discRenderer.setSize(dw, dh);
    }
  }

  // ======================================================
  //  THREE.JS — DISC DETAIL VIEW (Single spinning disc)
  // ======================================================
  let discScene, discCamera, discRenderer, discMesh, discAnimId;

  function initDiscScene() {
    const container = $('#disc-3d-container');
    const canvas = $('#disc-canvas');
    const w = container.clientWidth;
    const h = container.clientHeight;

    discScene = new THREE.Scene();

    discCamera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    discCamera.position.set(0, 3.5, 5);
    discCamera.lookAt(0, 0, 0);

    discRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    discRenderer.setSize(w, h);
    discRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    discRenderer.shadowMap.enabled = true;
    discRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    discRenderer.toneMappingExposure = 1.4;

    // Lights
    discScene.add(new THREE.AmbientLight(0x333355, 0.5));

    const spot = new THREE.SpotLight(0xffffff, 2.0, 40, Math.PI / 5, 0.4, 1);
    spot.position.set(0, 10, 5);
    spot.castShadow = true;
    discScene.add(spot);

    const pl1 = new THREE.PointLight(0x6C63FF, 1.5, 20);
    pl1.position.set(-4, 2, 3);
    discScene.add(pl1);

    const pl2 = new THREE.PointLight(0xFF6584, 1.0, 20);
    pl2.position.set(4, 2, 3);
    discScene.add(pl2);

    // We'll add the disc mesh per-disc open
  }

  function buildDetailDisc(discData) {
    // Remove previous
    if (discMesh) { discScene.remove(discMesh); }

    const color = new THREE.Color(discData.color);
    const group = new THREE.Group();

    // --- Main vinyl body ---
    const bodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 128, 1);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0a,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // --- Grooves (more detailed) ---
    for (let r = 0.7; r < 2.4; r += 0.08) {
      const gGeo = new THREE.TorusGeometry(r, 0.006, 4, 128);
      const gMat = new THREE.MeshStandardMaterial({
        color: 0x181818,
        metalness: 0.95,
        roughness: 0.1,
      });
      const g = new THREE.Mesh(gGeo, gMat);
      g.rotation.x = Math.PI / 2;
      g.position.y = 0.08;
      group.add(g);
    }

    // --- Iridescent rainbow reflection ---
    const iriGeo = new THREE.CylinderGeometry(2.45, 2.45, 0.005, 128, 1);
    const iriMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transparent: true,
      opacity: 0.15,
      envMapIntensity: 2.0,
    });
    const iri = new THREE.Mesh(iriGeo, iriMat);
    iri.position.y = 0.085;
    group.add(iri);

    // --- Label ---
    const lblGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.17, 64, 1);
    const lblMat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.6,
      emissive: color,
      emissiveIntensity: 0.4,
    });
    const lbl = new THREE.Mesh(lblGeo, lblMat);
    lbl.castShadow = true;
    group.add(lbl);

    // --- Label ring decoration ---
    const lrGeo = new THREE.TorusGeometry(0.7, 0.02, 8, 64);
    const lrMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
    });
    const lr = new THREE.Mesh(lrGeo, lrMat);
    lr.rotation.x = Math.PI / 2;
    lr.position.y = 0.09;
    group.add(lr);

    // --- Center hole ---
    const hGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 32);
    const hMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0 });
    const h = new THREE.Mesh(hGeo, hMat);
    group.add(h);

    // --- Center hole ring ---
    const chGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 32);
    const chMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.05,
    });
    const ch = new THREE.Mesh(chGeo, chMat);
    ch.rotation.x = Math.PI / 2;
    ch.position.y = 0.09;
    group.add(ch);

    // --- Outer rim ---
    const rimGeo = new THREE.TorusGeometry(2.5, 0.04, 12, 128);
    const rimMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // --- Glow ring ---
    const glowGeo = new THREE.TorusGeometry(2.6, 0.15, 8, 128);
    const glowMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.08,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = Math.PI / 2;
    group.add(glow);

    // Tilt slightly
    group.rotation.x = Math.PI * 0.1;

    discMesh = group;
    discScene.add(discMesh);
  }

  function animateDisc() {
    discAnimId = requestAnimationFrame(animateDisc);
    const time = performance.now() * 0.001;

    if (discMesh) {
      discMesh.rotation.y += 0.008;
      // Gentle float
      discMesh.position.y = Math.sin(time * 0.6) * 0.1;
    }

    discRenderer.render(discScene, discCamera);
  }

  function stopDiscAnim() {
    if (discAnimId) { cancelAnimationFrame(discAnimId); discAnimId = null; }
  }

  // ========== View Navigation ==========
  function showView(view) {
    $$('.view').forEach(v => v.classList.remove('active'));
    view.classList.add('active');
    view.style.animation = 'none';
    void view.offsetWidth;
    view.style.animation = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openDisc(discId) {
    currentDiscId = discId;
    const disc = discs.find(d => d.id === discId);
    if (!disc) return;

    // Stop shelf anim, start disc anim
    stopShelfAnim();

    if (!discRenderer) initDiscScene();
    buildDetailDisc(disc);
    stopDiscAnim();
    animateDisc();

    renderDiscInfo(disc);
    showView(discView);
  }

  function goHome() {
    currentDiscId = null;
    stopDiscAnim();

    // Rebuild shelf if data changed
    buildShelfDiscs();
    if (!shelfAnimId) animateShelf();

    showView(shelfView);
  }

  function renderDiscInfo(disc) {
    $('#disc-genre').textContent = disc.genre;
    $('#disc-genre').style.background = `linear-gradient(135deg, #fff, ${disc.color})`;
    $('#disc-genre').style.webkitBackgroundClip = 'text';
    $('#disc-genre').style.webkitTextFillColor = 'transparent';
    $('#disc-description').textContent = disc.description;
    $('#disc-msg-count').textContent = `${disc.messages.length} メッセージ`;
    $('#disc-msg-count').style.color = disc.color;
    $('#disc-msg-count').style.borderColor = disc.color + '44';
    $('#disc-msg-count').style.background = disc.color + '1a';

    renderMessages(disc);
  }

  function renderMessages(disc) {
    messagesList.innerHTML = '';
    if (disc.messages.length === 0) {
      messagesList.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">✎</div>
          <p class="empty-state-text">まだメッセージがありません。<br/>最初の声を書き込んでみませんか？</p>
        </div>`;
      return;
    }

    const sorted = [...disc.messages].sort((a, b) => new Date(b.time) - new Date(a.time));
    sorted.forEach((msg, idx) => {
      const card = document.createElement('div');
      card.className = 'msg-card';
      card.style.animationDelay = `${idx * .06}s`;

      const d = new Date(msg.time);
      const dateStr = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

      card.innerHTML = `
        <div class="msg-nick" style="color:${disc.color}">${escHtml(msg.nick || '匿名')}</div>
        <div class="msg-body">${escHtml(msg.body)}</div>
        <div class="msg-time">${dateStr}</div>`;

      messagesList.appendChild(card);
    });

    // Dynamic accent color for ::before
    let styleEl = $('#dynamic-msg-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-msg-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .msg-card::before { background: ${disc.color} !important; }
      .msg-nick::before { color: ${disc.color} !important; }
    `;
  }

  // ========== Modals ==========
  function openModal(el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal(el) { el.classList.remove('open'); document.body.style.overflow = ''; }

  $$('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal($('#' + btn.dataset.close)));
  });
  $$('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov); });
  });

  // Color picker
  let selectedColor = '#6C63FF';
  $$('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      $$('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      selectedColor = sw.dataset.color;
    });
  });

  // Form: Add Disc
  btnAddDisc.addEventListener('click', () => {
    formDisc.reset();
    $$('.color-swatch').forEach(s => s.classList.remove('active'));
    $('.color-swatch').classList.add('active');
    selectedColor = '#6C63FF';
    openModal(modalDisc);
  });

  formDisc.addEventListener('submit', e => {
    e.preventDefault();
    const genre = $('#input-genre').value.trim();
    const desc = $('#input-desc').value.trim();
    if (!genre || !desc) return;

    discs.unshift({
      id: _uid(), genre, description: desc, color: selectedColor, messages: [],
    });
    saveData(discs);
    buildShelfDiscs();
    closeModal(modalDisc);
    formDisc.reset();
  });

  // Form: Add Message
  btnAddMsg.addEventListener('click', () => { formMsg.reset(); openModal(modalMsg); });

  formMsg.addEventListener('submit', e => {
    e.preventDefault();
    const nick = $('#input-nick').value.trim() || '匿名';
    const body = $('#input-msg').value.trim();
    if (!body || !currentDiscId) return;

    const disc = discs.find(d => d.id === currentDiscId);
    if (!disc) return;

    disc.messages.push({
      id: _uid(), nick, body, time: new Date().toISOString(),
    });
    saveData(discs);
    renderDiscInfo(disc);

    // Update detail disc to show new count
    if (discMesh) buildDetailDisc(disc);

    closeModal(modalMsg);
    formMsg.reset();
  });

  // Nav
  btnBack.addEventListener('click', goHome);
  logoHome.addEventListener('click', goHome);

  // ========== Utility ==========
  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ========== Init ==========
  initShelfScene();
})();
