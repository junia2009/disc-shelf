/* ============================================
   DISC SHELF — Portal App Logic (Three.js 3D)
   ============================================ */
(() => {
  // 現在選択中のカテゴリ
  let currentCategory = 'セキュリティ';
  'use strict';
  // ===== ワープボタンでカテゴリ循環切り替え =====
  window.addEventListener('DOMContentLoaded', () => {
    const warpBtn = document.getElementById('warp-portal-btn');
    const catLabel = document.getElementById('current-category-label');
    function updateCategoryLabel() {
      if (catLabel) catLabel.textContent = currentCategory;
    }
    if (warpBtn) {
      warpBtn.addEventListener('click', () => {
        const categories = ['セキュリティ', 'ゲーム', 'その他'];
        let idx = categories.indexOf(currentCategory);
        idx = (idx + 1) % categories.length;
        currentCategory = categories[idx];
        buildShelfDiscs();
        updateCategoryLabel();
      });
    }
    // 初期表示も反映
    updateCategoryLabel();
  });

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
      category: 'その他',
    },
    {
      id: 'my-timer',
      name: 'My タイマー',
      description: '自分用に作成したタイマーアプリ',
      color: '#FF6584',
      url: 'https://junia2009.github.io/app_timer/',
      repo: 'https://github.com/junia2009/app_timer',
      tags: ['JS', 'tool'],
      category: 'その他',
    },
    {
      id: 'grow_model',
      name: 'GROWモデルシート',
      description: 'GROWモデルの実戦用アプリ',
      color: '#00C9A7',
      url: 'https://junia2009.github.io/grow-recruiter-app/',
      repo: 'https://github.com/junia2009/grow-recruiter-app',
      tags: ['HTML', 'tool'],
      category: 'その他',
    },
    {
      id: 'base64-decoder',
      name: 'Base64デコーダー',
      description: 'Base64の暗号化および復号を実施する',
      color: '#00B4D8',
      url: 'https://junia2009.github.io/base64-decoder/',
      repo: 'https://github.com/junia2009/base64-decoder',
      tags: ['JS', 'tool'],
      category: 'セキュリティ',
    },
    {
      id: 'rsa-decoder',
      name: 'RSA デコーダー',
      description: 'RSA暗号の暗号化もしくは復号を実施する',
      color: '#FFD700',
      url: 'https://junia2009.github.io/RSA_decoder/',
      repo: 'https://github.com/junia2009/RSA_decoder',
      tags: ['JS', 'tool'],
      category: 'セキュリティ',
    },
    {
      id: 'caesar-decoder',
      name: 'Caesarデコーダー',
      description: 'シーザー暗号の復号を実施する',
      color: '#FF9800', // オレンジ系で映える
      url: 'https://junia2009.github.io/caesar_decoder/',
      repo: 'https://github.com/junia2009/caesar_decoder',
      tags: ['JS', 'tool'],
      category: 'セキュリティ',
    },
    {
      id: 'hex-decoder',
      name: 'Hexデコーダー',
      description: 'Hexを文字列に復号する。',
      color: '#00C853', // 緑系
      url: 'https://junia2009.github.io/hex-decoder/',
      repo: 'https://github.com/junia2009/hex-decoder/',
      tags: ['JS', 'tool'],
      category: 'セキュリティ',
    },
    {
      id: 'log_hunter',
      name: 'ログハンター',
      description: 'ログファイルから怪しい箇所やフラグを抽出する。',
      color: '#00D2FF', // シアン系（既存と被らない色）
      url: 'https://junia2009.github.io/log_hunter/',
      repo: 'https://github.com/junia2009/log_hunter/',
      tags: ['JS', 'tool'],
      category: 'セキュリティ',
    },
    {
    id: 'photo-geo-locator',
    name: 'Photoジオグラフィ',
    description: '写真の位置情報を調査する',
    color: '#FFC312', // イエロー系（未使用色）
    url: 'https://junia2009.github.io/photo_geo_locator/',
    repo: 'https://github.com/junia2009/photo_geo_locator',
    tags: ['JS', 'tool'],
    category: 'セキュリティ',
    },
    {
    id: 'cosmic-shooter',
    name: 'Cosmic Shooter',
    description: '宇宙を舞台にしたシューティングゲーム',
    color: '#FFC312', 
    url: 'https://junia2009.github.io/cosmic_shooter/',
    repo: 'https://github.com/junia2009/cosmic_shooter',
    tags: ['JS', 'tool'],
    category: 'ゲーム',
    },
    {
    id: 'breaking-block',
    name: 'Breaking Block',
    description: 'ブロック崩し',
    color: '#E53935', // 赤系
    url: 'https://junia2009.github.io/breaking_block/',
    repo: 'https://github.com/junia2009/breaking_block',
    tags: ['JS', 'tool'],
    category: 'ゲーム',
    },
    {
    id: 'my-aquarium',
    name: 'エビ育成',
    description: '癒しを求めてエビを育成するためのゲーム',
    color: '#26C6DA', // アクア系
    url: 'https://junia2009.github.io/my_aquarium/',
    repo: 'https://github.com/junia2009/my_aquarium/',
    tags: ['JS', 'game'],
    category: 'ゲーム',
    },
    {
      id: 'soliaire',
      name: 'ソリティア',
      description: '宇宙空間に浮かぶテーブルで遊ぶ、Three.js製3Dクロンダイク・ソリティア。',
      color: '#00BCD4',
      url: 'https://junia2009.github.io/card_game_1/',
      repo: 'https://github.com/junia2009/card_game_1',
      tags: ['Three.js', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'void_runner',
      name: 'ボイドランナー',
      description: '宇宙を舞台にしたHTML5 Canvas製エンドレスランニングゲーム。',
      color: '#651FFF',
      url: 'https://junia2009.github.io/void-runner/',
      repo: 'https://github.com/junia2009/void-runner',
      tags: ['Canvas', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'planet_pazzle',
      name: 'プラネットパズル',
      description: '惑星タイルを3枚揃えて消すマッチ3パズルゲーム。全405枚クリアを目指せ。',
      color: '#5C6BC0',
      url: 'https://junia2009.github.io/planet-puzzle/',
      repo: 'https://github.com/junia2009/planet-puzzle',
      tags: ['JS', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'Family_memo',
      name: '家族めも',
      description: '家族で共有できるメモアプリ。',
      color: '#FF7043',
      url: 'https://memo0901-7138a.web.app',
      repo: 'https://console.firebase.google.com/project/memo0901-7138a/hosting/sites/memo0901-7138a',
      tags: ['Firebase', 'tool'],
      category: 'その他',
    },
    {
      id: 'dragon-cradle',
      name: 'Dragon Cradle',
      description: 'ドラゴンを育てて戦わせる育成バトルゲーム',
      color: '#7B2FFF',
      url: 'https://junia2009.github.io/dragon-cradle/',
      repo: 'https://github.com/junia2009/dragon-cradle',
      tags: ['Three.js', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'droid-navi',
      name: 'RT91 Navi',
      description: 'RT91アストロメク・ナビゲータードロイド - 天気・時刻をお届け',
      color: '#b31e22',
      url: 'https://junia2009.github.io/droid_navi/',
      repo: 'https://github.com/junia2009/droid_navi',
      tags: ['Three.js', 'PWA'],
      category: 'その他',
    },
    {
      id: 'suudoku-resolver',
      name: 'ナンプレ解くマン',
      description: '写真撮影、もしくは写真選択で数独を自動解読する',
      color: '#43A047',
      url: 'https://junia2009.github.io/suudoku_resolver/',
      repo: 'https://github.com/junia2009/suudoku_resolver',
      tags: ['JS', 'OCR'],
      category: 'その他',
    },
    {
      id: 'othello',
      name: 'オセロ',
      description: '定番ボードゲーム、オセロ。',
      color: '#424242',
      url: 'https://junia2009.github.io/Othello/',
      repo: 'https://github.com/junia2009/Othello',
      tags: ['HTML', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'hover-dodge',
      name: 'ホバードッジ',
      description: 'ホバー操作で障害物を避けるアクションゲーム。',
      color: '#F50057',
      url: 'https://junia2009.github.io/hover-dodge/',
      repo: 'https://github.com/junia2009/hover-dodge',
      tags: ['HTML', 'game'],
      category: 'ゲーム',
    },
    {
      id: 'netguard-rpg',
      name: 'NETGUARD://',
      description: 'サイバー空間を舞台にしたアクションRPG (HTML5/Canvas)。',
      color: '#00E5FF',
      url: 'https://junia2009.github.io/netguard-rpg/',
      repo: 'https://github.com/junia2009/netguard-rpg',
      tags: ['Canvas', 'RPG'],
      category: 'ゲーム',
    },
    {
      id: 'webdev-reference',
      name: 'Webdev リファレンス',
      description: 'JS / HTML5 / Three.js / CSS のリファレンスサイト（PWA対応）。',
      color: '#2196F3',
      url: 'https://junia2009.github.io/webdev-reference/',
      repo: 'https://github.com/junia2009/webdev-reference',
      tags: ['HTML', 'PWA', 'reference'],
      category: 'その他',
    },
    {
      id: 'relax-space',
      name: 'リラックススペース',
      description: '癒しのリラックス空間体験。',
      color: '#B388FF',
      url: 'https://junia2009.github.io/relax_space/',
      repo: 'https://github.com/junia2009/relax_space',
      tags: ['JS', 'relax'],
      category: 'その他',
    },
    {
      id: 'room-maker',
      name: 'ルームメイカー',
      description: '部屋のレイアウトを作成するツール。',
      color: '#8D6E63',
      url: 'https://junia2009.github.io/room_maker/',
      repo: 'https://github.com/junia2009/room_maker',
      tags: ['JS', 'tool'],
      category: 'その他',
    },
    {
      id: 'cosmic-score',
      name: 'Cosmic Score',
      description: 'ピアノロールとGemini AIを搭載したブラウザ音楽スタジオ。',
      color: '#E91E63',
      url: 'https://junia2009.github.io/cosmic-score/',
      repo: 'https://github.com/junia2009/cosmic-score',
      tags: ['JS', 'AI', 'music'],
      category: 'その他',
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
  let isDragging = false, dragStartX = 0, dragStartY = 0, dragStartAngle = 0;
  let dragLockAxis = null; // 'x' | 'y' | null
  let hoveredDisc = null;
  // ground/groundMatをグローバル化
  let ground = null;
  let groundMat = null;

  // ===== 3Dシリンダー: 段管理 =====
  const DISCS_PER_ROW = 6;     // 1段あたりの最大枚数
  const ROW_GAP = 2.6;          // 段間のY距離
  const SWIPE_THRESHOLD = 60;   // 段切替に必要な縦スワイプ距離(px)
  const AXIS_LOCK_THRESHOLD = 20; // ドラッグ軸ロック判定距離(px)
  let activeRow = 0;            // 現在のアクティブ段
  let activeRowFloat = 0;       // アニメーション用補間値
  let totalRows = 1;            // 総段数
  let rowDistribution = [];     // 各段の枚数 [6, 5] 等

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
    groundMat = new THREE.MeshStandardMaterial({
      color: 0x08080f, metalness: 0.9, roughness: 0.4,
      transparent: true, opacity: 0.5,
    });
    ground = new THREE.Mesh(groundGeo, groundMat);
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

  /* ---------- Twinkling Star Field ---------- */
  let starSizes, starPhases;

  function createParticleField(scene) {
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    starSizes  = new Float32Array(count);
    starPhases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xcfc9ff),
      new THREE.Color(0xa8d8ff),
      new THREE.Color(0xffd6e0),
      new THREE.Color(0xb8ffec),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - .5) * 60;
      pos[i * 3 + 1] = (Math.random() - .5) * 35;
      pos[i * 3 + 2] = (Math.random() - .5) * 60;
      starSizes[i]  = 0.04 + Math.random() * 0.12;
      starPhases[i] = Math.random() * Math.PI * 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(starSizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.1, vertexColors: true,
      transparent: true, opacity: 0.85, sizeAttenuation: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    pts.userData.isParticles = true;
    scene.add(pts);
  }

  function twinkleStars(time) {
    const pts = shelfScene.children.find(c => c.userData?.isParticles);
    if (!pts) return;
    const sizes = pts.geometry.attributes.size;
    for (let i = 0; i < sizes.count; i++) {
      const base = starSizes[i];
      const flicker = Math.sin(time * (1.5 + (i % 5) * 0.4) + starPhases[i]);
      sizes.array[i] = base * (0.5 + 0.5 * flicker);
    }
    sizes.needsUpdate = true;
  }

  /* ---------- Shooting Stars ---------- */
  const shootingStars = [];

  function spawnShootingStar() {
    const colors = [0xffffff, 0xcfc9ff, 0xa8d8ff, 0xffd6e0, 0xb8ffec];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Start position: random spot in the upper area
    const sx = (Math.random() - 0.5) * 40;
    const sy = 8 + Math.random() * 10;
    const sz = -5 - Math.random() * 20;

    // Direction: downward at an angle
    const angle = (-0.3 - Math.random() * 0.5);
    const speed = 18 + Math.random() * 14;
    const dx = (Math.random() > 0.5 ? 1 : -1) * speed * Math.cos(angle);
    const dy = speed * Math.sin(angle);
    const dz = (Math.random() - 0.5) * 4;

    const tailLen = 8;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(tailLen * 3);
    const alphas = new Float32Array(tailLen);
    for (let i = 0; i < tailLen; i++) {
      positions[i * 3] = sx; positions[i * 3 + 1] = sy; positions[i * 3 + 2] = sz;
      alphas[i] = 1.0 - i / tailLen;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color, size: 0.12, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const mesh = new THREE.Points(geo, mat);
    shelfScene.add(mesh);

    shootingStars.push({
      mesh, geo, mat, tailLen,
      x: sx, y: sy, z: sz, dx, dy, dz,
      life: 0, maxLife: 1.2 + Math.random() * 0.6,
    });
  }

  let lastShootTime = 0;
  function updateShootingStars(time, dt) {
    // Spawn: random interval 2–6 sec
    if (time - lastShootTime > 2 + Math.random() * 4) {
      spawnShootingStar();
      lastShootTime = time;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.life += dt;
      s.x += s.dx * dt;
      s.y += s.dy * dt;
      s.z += s.dz * dt;

      const posArr = s.geo.attributes.position.array;
      // Shift tail
      for (let j = (s.tailLen - 1) * 3; j >= 3; j -= 3) {
        posArr[j] = posArr[j - 3];
        posArr[j + 1] = posArr[j - 2];
        posArr[j + 2] = posArr[j - 1];
      }
      posArr[0] = s.x; posArr[1] = s.y; posArr[2] = s.z;
      s.geo.attributes.position.needsUpdate = true;

      // Fade out
      const fade = Math.max(0, 1 - s.life / s.maxLife);
      s.mat.opacity = fade * 0.9;

      if (s.life >= s.maxLife) {
        shelfScene.remove(s.mesh);
        s.geo.dispose(); s.mat.dispose();
        shootingStars.splice(i, 1);
      }
    }
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

    // ===== 各マテリアルに透明度の動的制御を仕込む =====
    // baseOpacity を覚えておき、後段で row フェード倍率を掛けて適用する
    const matRefs = [];
    group.traverse(child => {
      if (child.material) {
        child.material.transparent = true;
        matRefs.push({ mat: child.material, base: child.material.opacity });
      }
    });
    group.userData.matRefs = matRefs;
    return group;
  }

  // 段フェード倍率（0.0〜1.0）を適用
  function setDiscRowOpacity(group, factor) {
    const refs = group.userData.matRefs;
    if (!refs) return;
    for (let i = 0; i < refs.length; i++) {
      refs[i].mat.opacity = refs[i].base * factor;
    }
  }

  function buildShelfDiscs() {
    shelfDiscs3D.forEach(d => shelfScene.remove(d));
    shelfDiscs3D = [];
    // ground色をカテゴリごとに変更
    if (groundMat) {
      let color = 0x08080f;
      if (currentCategory === 'セキュリティ') color = 0x1976d2; // 青ベース
      else if (currentCategory === 'ゲーム') color = 0xd32f2f; // 赤ベース
      else if (currentCategory === 'その他') color = 0xffc107; // 黄ベース
      groundMat.color.setHex(color);
    }
    // 選択中カテゴリのみ表示
    const filtered = DISCS.filter(d => d.category === currentCategory);

    // ===== 段分割: 枚数に応じて均等に配分 =====
    const count = filtered.length;
    totalRows = Math.max(1, Math.ceil(count / DISCS_PER_ROW));
    rowDistribution = [];
    let remaining = count;
    for (let r = 0; r < totalRows; r++) {
      const rowsLeft = totalRows - r;
      const thisRow = Math.ceil(remaining / rowsLeft);
      rowDistribution.push(thisRow);
      remaining -= thisRow;
    }

    // ===== ディスク生成（rowIndex / colIndex / rowSize をuserDataに保持） =====
    let discIdx = 0;
    rowDistribution.forEach((rowSize, rowIndex) => {
      for (let col = 0; col < rowSize; col++) {
        const disc = filtered[discIdx];
        const mesh = createDisc3D(disc, discIdx);
        mesh.userData.rowIndex = rowIndex;
        mesh.userData.colIndex = col;
        mesh.userData.rowSize = rowSize;
        shelfScene.add(mesh);
        shelfDiscs3D.push(mesh);
        discIdx++;
      }
    });

    // 段位置をリセット
    activeRow = 0;
    activeRowFloat = 0;
    updateRowIndicator();
    // カテゴリ切り替えUIのイベント設定
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const cat = btn.getAttribute('data-category');
          if (cat && cat !== currentCategory) {
            currentCategory = cat;
            buildShelfDiscs();
          }
          // ボタンのactive状態切替
          document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
      // 初期カテゴリボタンにactive付与
      const firstBtn = document.querySelector('.category-btn[data-category="' + currentCategory + '"]');
      if (firstBtn) firstBtn.classList.add('active');
    });
  }

  function layoutCarousel(time) {
    if (!shelfDiscs3D.length) return;

    shelfDiscs3D.forEach((group, i) => {
      const { rowIndex, colIndex, rowSize } = group.userData;
      // 段距離（実数）。0=アクティブ、±1=隣接、絶対値が大きいほど遠い段
      const dRow = rowIndex - activeRowFloat;
      const absD = Math.abs(dRow);

      // ===== 段フェード: 0距離=完全表示、1距離以上=完全透明 =====
      // ease-out で急速にフェードアウト（中間で両段が薄く見える時間を短縮）
      const t = Math.min(absD, 1);
      const rowOpacity = (1 - t) * (1 - t); // quadratic ease-out

      // 不可視ならレンダリング停止して終了
      group.visible = rowOpacity > 0.03;
      if (!group.visible) {
        setDiscRowOpacity(group, 0);
        return;
      }

      // 各段ごとに半径を決定（段内の枚数に応じてコンパクトに）
      const radius = Math.max(5, rowSize * 1.1);

      const angle = carouselAngle + (colIndex / rowSize) * Math.PI * 2;
      group.position.x = Math.sin(angle) * radius;
      group.position.z = Math.cos(angle) * radius - radius + 3;

      // Y位置: 切替中に上段は上へ、下段は下へスライド（フェードと連動）
      const baseY = -dRow * ROW_GAP;
      const bobble = Math.sin(time * 0.8 + i * 0.7) * 0.15;
      group.position.y = baseY + bobble;

      // ディスクの自転
      group.children[0].rotation.y += 0.005;
      group.children.forEach((c, ci) => { if (ci > 0) c.rotation.y = group.children[0].rotation.y; });

      // スケールはアクティブ段でフル、フェード時はわずかに縮小
      const rowScale = THREE.MathUtils.lerp(0.85, 1.0, rowOpacity);

      // 奥行きスケール（既存ロジック）
      const z = group.position.z;
      const depthScale = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(z, -radius * 2, 5, 0.5, 1.0), 0.45, 1.0
      );

      const finalScale = depthScale * rowScale;
      group.scale.setScalar(hoveredDisc === group ? finalScale * 1.15 : finalScale);

      // マテリアル透明度を適用
      setDiscRowOpacity(group, rowOpacity);
    });
  }

  let prevTime = 0;
  function animateShelf() {
    shelfAnimId = requestAnimationFrame(animateShelf);
    const time = performance.now() * 0.001;
    const dt = Math.min(time - prevTime, 0.1);
    prevTime = time;

    if (autoRotate && !isDragging) targetCarouselAngle += 0.0015;
    carouselAngle += (targetCarouselAngle - carouselAngle) * 0.225;
    // 段切替のスムーズ補間
    activeRowFloat += (activeRow - activeRowFloat) * 0.12;
    layoutCarousel(time);

    // Twinkle stars
    twinkleStars(time);
    shelfScene.children.forEach(c => {
      if (c.userData?.isParticles) c.rotation.y = time * 0.015;
    });

    // Shooting stars
    updateShootingStars(time, dt);

    shelfRenderer.render(shelfScene, shelfCamera);
  }

  function stopShelfAnim() { if (shelfAnimId) { cancelAnimationFrame(shelfAnimId); shelfAnimId = null; } }

  // ===== 段切替 =====
  function changeRow(delta) {
    const target = activeRow + delta;
    if (target < 0 || target >= totalRows) return false;
    activeRow = target;
    updateRowIndicator();
    autoRotate = false;
    clearTimeout(changeRow._t);
    changeRow._t = setTimeout(() => { autoRotate = true; }, 3000);
    return true;
  }

  function updateRowIndicator() {
    const ind = document.getElementById('row-indicator');
    if (!ind) return;
    if (totalRows <= 1) {
      ind.style.display = 'none';
      ind.innerHTML = '';
      return;
    }
    ind.style.display = '';
    ind.innerHTML = '';
    for (let i = 0; i < totalRows; i++) {
      const dot = document.createElement('div');
      dot.className = 'row-dot' + (i === activeRow ? ' active' : '');
      dot.setAttribute('data-row', i);
      ind.appendChild(dot);
    }
  }

  // --- Interactions ---
  function canvasCoords(e) {
    const r = $('#shelf-canvas').getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 };
  }

  function onMouseDown(e) {
    isDragging = true;
    autoRotate = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartAngle = targetCarouselAngle;
    dragLockAxis = null;
  }
  function onMouseUp(e) {
    if (dragLockAxis === 'y' && e) {
      const dy = e.clientY - dragStartY;
      if (dy < -SWIPE_THRESHOLD) changeRow(1);       // 上スワイプ→次段
      else if (dy > SWIPE_THRESHOLD) changeRow(-1);  // 下スワイプ→前段
    }
    isDragging = false;
    dragLockAxis = null;
    setTimeout(() => { autoRotate = true; }, 3000);
  }
  function onMouseLeave() {
    isDragging = false;
    dragLockAxis = null;
    hoveredDisc = null;
    tooltip.classList.add('hidden');
    setTimeout(() => { autoRotate = true; }, 1000);
  }

  function onMouseMove(e) {
    const c = canvasCoords(e);
    shelfMouse.set(c.x, c.y);

    if (isDragging) {
      // 軸ロック判定
      if (!dragLockAxis) {
        const dx = Math.abs(e.clientX - dragStartX);
        const dy = Math.abs(e.clientY - dragStartY);
        if (dx > AXIS_LOCK_THRESHOLD || dy > AXIS_LOCK_THRESHOLD) {
          dragLockAxis = dx > dy ? 'x' : 'y';
        }
      }
      if (dragLockAxis === 'x') {
        targetCarouselAngle = dragStartAngle + (e.clientX - dragStartX) * 0.005;
      }
      tooltip.classList.add('hidden');
      return;
    }

    shelfRaycaster.setFromCamera(shelfMouse, shelfCamera);
    let hit = null;
    for (const g of shelfDiscs3D) {
      if (!g.visible) continue;
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
    if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5) return;
    if (dragLockAxis) return; // ドラッグ操作後はクリック扱いしない
    const c = canvasCoords(e);
    shelfRaycaster.setFromCamera(new THREE.Vector2(c.x, c.y), shelfCamera);
    for (const g of shelfDiscs3D) {
      if (!g.visible) continue;
      if (shelfRaycaster.intersectObjects(g.children, true).length) {
        openDisc(g.userData.discId);
        return;
      }
    }
  }

  let touchStartX = 0, touchStartY = 0;
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true; autoRotate = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      dragStartX = touchStartX;
      dragStartY = touchStartY;
      dragStartAngle = targetCarouselAngle;
      dragLockAxis = null;
    }
  }
  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const tx = e.touches[0].clientX;
      const ty = e.touches[0].clientY;
      // 軸ロック判定
      if (!dragLockAxis) {
        const dx = Math.abs(tx - dragStartX);
        const dy = Math.abs(ty - dragStartY);
        if (dx > AXIS_LOCK_THRESHOLD || dy > AXIS_LOCK_THRESHOLD) {
          dragLockAxis = dx > dy ? 'x' : 'y';
        }
      }
      if (dragLockAxis === 'x') {
        targetCarouselAngle = dragStartAngle + (tx - dragStartX) * 0.005;
      }
    }
  }
  function onTouchEnd(e) {
    const t = e.changedTouches[0];
    const tx = t?.clientX || 0;
    const ty = t?.clientY || 0;

    if (dragLockAxis === 'y') {
      // 縦スワイプ → 段切替
      const dy = ty - touchStartY;
      if (dy < -SWIPE_THRESHOLD) changeRow(1);
      else if (dy > SWIPE_THRESHOLD) changeRow(-1);
    } else if (isDragging && !dragLockAxis &&
               Math.abs(tx - touchStartX) < 10 && Math.abs(ty - touchStartY) < 10) {
      // タップ → ディスク選択
      const c = canvasCoords(t);
      shelfRaycaster.setFromCamera(new THREE.Vector2(c.x, c.y), shelfCamera);
      for (const g of shelfDiscs3D) {
        if (!g.visible) continue;
        if (shelfRaycaster.intersectObjects(g.children, true).length) { openDisc(g.userData.discId); break; }
      }
    }
    isDragging = false;
    dragLockAxis = null;
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
  // ===== 一覧ビュー切り替え・生成ロジック =====
    const listView = document.getElementById('list-view');
    const btnListView = document.getElementById('btn-list-view');
    const btnBackShelf = document.getElementById('btn-back-shelf');
    const discListContainer = document.getElementById('disc-list-container');
    const listSearch = document.getElementById('list-search');
    const shelfViewSection = document.getElementById('shelf-view');

    // カテゴリの表示順と色定義
    const CATEGORY_ORDER = ['セキュリティ', 'ゲーム', 'その他'];
    const CATEGORY_COLOR = {
      'セキュリティ': '#4fc3f7',
      'ゲーム':       '#ef9a9a',
      'その他':       '#fff176',
    };

    function showListView() {
      shelfViewSection.classList.remove('active');
      listView.classList.add('active');
      if (listSearch) listSearch.value = '';
      renderDiscList('');
    }
    function hideListView() {
      listView.classList.remove('active');
      shelfViewSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (btnListView) btnListView.addEventListener('click', showListView);
    if (btnBackShelf) btnBackShelf.addEventListener('click', hideListView);

    // 検索ボックス: 入力のたびに再描画
    if (listSearch) {
      listSearch.addEventListener('input', () => renderDiscList(listSearch.value));
    }

    // iOS: リスト内をタップしたとき、キーボードが出ていれば先に閉じる
    // → ズーム戻しによるレイアウト移動の前に blur() を済ませ、起動リンクを1タップで確実に押せるようにする
    if (discListContainer && listSearch) {
      discListContainer.addEventListener('touchstart', () => {
        if (document.activeElement === listSearch) listSearch.blur();
      }, { passive: true });
    }

    function renderDiscList(query = '') {
      if (!discListContainer) return;
      discListContainer.innerHTML = '';

      const q = query.trim().toLowerCase();

      // フィルタリング
      const filtered = q
        ? DISCS.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.tags.some(t => t.toLowerCase().includes(q))
          )
        : DISCS;

      // ヒット0件
      if (!filtered.length) {
        const msg = document.createElement('p');
        msg.className = 'list-no-results';
        msg.textContent = `「${query}」に一致するアプリは見つかりませんでした`;
        discListContainer.appendChild(msg);
        return;
      }

      // カテゴリごとにグループ化して順番通りに出力
      const grouped = Object.fromEntries(CATEGORY_ORDER.map(c => [c, []]));
      filtered.forEach(d => {
        const cat = grouped[d.category] ? d.category : 'その他';
        grouped[cat].push(d);
      });

      CATEGORY_ORDER.forEach(cat => {
        const discs = grouped[cat];
        if (!discs.length) return;

        // カテゴリヘッダー
        const header = document.createElement('div');
        header.className = 'list-category-header';
        header.innerHTML = `<span class="list-category-badge" style="background:${CATEGORY_COLOR[cat]}22;color:${CATEGORY_COLOR[cat]};border-color:${CATEGORY_COLOR[cat]}55">${esc(cat)}</span><span class="list-category-count">${discs.length}</span>`;
        discListContainer.appendChild(header);

        // ディスクカード一覧
        const ul = document.createElement('ul');
        ul.className = 'disc-list';
        discs.forEach(disc => {
          const li = document.createElement('li');
          li.className = 'disc-list-item';
          li.style.setProperty('--disc-color', disc.color);
          li.style.borderLeft = `4px solid ${disc.color}`;
          li.innerHTML = `
            <div class="disc-list-main">
              <div class="disc-list-title-row">
                <span class="disc-list-dot" style="background:${disc.color};box-shadow:0 0 6px ${disc.color}88"></span>
                <span class="disc-list-name">${esc(disc.name)}</span>
              </div>
              <span class="disc-list-desc">${esc(disc.description)}</span>
              <div class="disc-list-tags">${disc.tags.map(t => `<span class="disc-list-tag">#${esc(t)}</span>`).join('')}</div>
            </div>
            <div class="disc-list-links">
              <a href="${disc.url}" target="_blank" rel="noopener" class="disc-list-link disc-list-link--launch" style="border-color:${disc.color}66;color:${disc.color}">▶ 起動</a>
              <a href="${disc.repo}" target="_blank" rel="noopener" class="disc-list-link disc-list-link--repo">⟨/⟩ リポジトリ</a>
            </div>
          `;
          ul.appendChild(li);
        });
        discListContainer.appendChild(ul);
      });
    } // end renderDiscList

  initShelfScene();
})();
