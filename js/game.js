// ============================================
// XIAOLI ADVENTURES - Main Game Engine
// An auto-scrolling platformer starring
// Xiaoli the grey & white floofball
// ============================================

(function() {
  'use strict';

  // ---- Canvas Setup ----
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Game dimensions (logical)
  const GAME_W = 480;
  const GAME_H = 320;

  function resizeCanvas() {
    canvas.width = GAME_W;
    canvas.height = GAME_H;

    // Fit canvas to viewport while preserving 3:2 aspect ratio
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspectRatio = GAME_W / GAME_H;

    let cssW, cssH;
    if (vw / vh > aspectRatio) {
      // Viewport is wider than canvas -- fit to height
      cssH = vh;
      cssW = vh * aspectRatio;
    } else {
      // Viewport is taller than canvas -- fit to width
      cssW = vw;
      cssH = vw / aspectRatio;
    }

    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ---- Game State ----
  const STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    OUTDOOR: 'outdoor',
    COMPLAINT: 'complaint',
    TRANSITION: 'transition'
  };

  let game = {
    state: STATE.MENU,
    frame: 0,
    score: 0,
    scrollSpeed: 3,
    baseScrollSpeed: 3,
    maxScrollSpeed: 6,

    // Xiaoli
    player: {
      x: 80,
      y: 0,
      w: 60,
      h: 55,
      vy: 0,
      grounded: true,
      health: 60,
      maxHealth: 100,
      animState: 'run',
      invincible: 0,
      scratching: 0,
      doubleJumped: false
    },

    // Scene
    scene: 'indoor',
    outdoorTimer: 0,
    outdoorDuration: 600, // 10 seconds at 60fps
    transitionAlpha: 0,
    transitionTarget: null,

    // Ground
    groundY: GAME_H - 50,

    // Entities
    entities: [],
    effects: [],
    particles: [],

    // Background elements
    bgElements: [],
    clouds: [],

    // Spawning
    spawnTimer: 0,
    spawnInterval: 90,
    minSpawnInterval: 50,
    difficultyTimer: 0,

    // Complaint captain
    complaintShown: false,

    // Screen shake
    shakeTimer: 0,
    shakeIntensity: 0,

    // Score popups
    popups: [],

    // High score
    highScore: (function() { try { return parseInt(localStorage.getItem('xiaoli-highscore') || '0', 10); } catch(e) { return 0; } })()
  };

  // ---- Platforms ----
  let platforms = [];

  function resetPlatforms() {
    platforms = [
      // The main ground is implicit, but we track floating platforms
    ];
  }

  // ---- Initialize ----
  function initGame() {
    game.state = STATE.PLAYING;
    game.frame = 0;
    game.score = 0;
    game.scrollSpeed = game.baseScrollSpeed;
    game.scene = 'indoor';
    game.outdoorTimer = 0;
    game.transitionAlpha = 0;
    game.complaintShown = false;

    game.player.y = game.groundY - game.player.h;
    game.player.vy = 0;
    game.player.grounded = true;
    game.player.health = 60;
    game.player.invincible = 0;
    game.player.scratching = 0;
    game.player.doubleJumped = false;
    game.player.animState = 'run';

    game.shakeTimer = 0;
    game.shakeIntensity = 0;

    game.entities = [];
    game.effects = [];
    game.particles = [];
    game.popups = [];

    game.bgElements = [];
    game.clouds = [];

    game.spawnTimer = 0;
    game.spawnInterval = 90;
    game.difficultyTimer = 0;

    resetPlatforms();

    // Initial clouds
    for (let i = 0; i < 4; i++) {
      game.clouds.push({
        x: Math.random() * GAME_W,
        y: 20 + Math.random() * 60,
        scale: 0.4 + Math.random() * 0.6,
        speed: 0.2 + Math.random() * 0.3
      });
    }

    // Initial background elements
    spawnBgElement(100);
    spawnBgElement(300);

    updateUI();
  }

  // ---- UI Updates ----
  function updateUI() {
    document.getElementById('score').textContent = game.score;

    // Update high score
    if (game.score > game.highScore) {
      game.highScore = game.score;
      try { localStorage.setItem('xiaoli-highscore', String(game.highScore)); } catch(e) { /* private browsing */ }
    }

    const hiEl = document.getElementById('hi-score');
    if (hiEl) {
      if (game.score > 0 && game.score >= game.highScore) {
        hiEl.textContent = 'NEW BEST!';
        hiEl.style.color = '#fbbf24';
      } else if (game.highScore > 0) {
        hiEl.textContent = 'HI ' + game.highScore;
        hiEl.style.color = '';
      }
    }

    const healthBar = document.getElementById('health-bar');
    const healthPct = (game.player.health / game.player.maxHealth) * 100;
    healthBar.style.width = healthPct + '%';

    healthBar.classList.remove('low', 'medium', 'full');
    if (healthPct >= 100) healthBar.classList.add('full');
    else if (healthPct <= 25) healthBar.classList.add('low');
    else if (healthPct <= 50) healthBar.classList.add('medium');
  }

  // ---- Spawning ----
  function spawnEntity() {
    const types = game.scene === 'outdoor'
      ? ['bird', 'bird', 'bird', 'grass_bonus']
      : ['box', 'dog', 'fresh_food', 'stale_food', 'box', 'fresh_food'];

    const type = types[Math.floor(Math.random() * types.length)];
    const x = GAME_W + 20;

    switch (type) {
      case 'box':
        game.entities.push({
          type: 'box',
          x, y: game.groundY - 45,
          w: 45, h: 45,
          active: true
        });
        break;

      case 'dog':
        game.entities.push({
          type: 'dog',
          x, y: game.groundY - 50,
          w: 55, h: 50,
          active: true,
          hitCooldown: 0
        });
        break;

      case 'fresh_food':
        game.entities.push({
          type: 'food',
          x, y: game.groundY - 35,
          w: 40, h: 35,
          fresh: true,
          active: true
        });
        break;

      case 'stale_food':
        game.entities.push({
          type: 'food',
          x, y: game.groundY - 35,
          w: 40, h: 35,
          fresh: false,
          active: true
        });
        break;

      case 'bird':
        game.entities.push({
          type: 'bird',
          x,
          y: game.groundY - 100 - Math.random() * 80,
          w: 35, h: 25,
          active: true,
          vy: Math.sin(Math.random() * Math.PI) * 0.5
        });
        break;

      case 'grass_bonus':
        game.entities.push({
          type: 'grass_bonus',
          x, y: game.groundY - 30,
          w: 35, h: 30,
          active: true
        });
        break;
    }
  }

  function spawnBgElement(forceX) {
    const x = forceX || GAME_W + 50;
    if (game.scene === 'indoor') {
      const types = ['couch', 'window'];
      const type = types[Math.floor(Math.random() * types.length)];
      game.bgElements.push({
        type,
        x,
        y: type === 'window' ? 40 : game.groundY - 80,
        w: type === 'couch' ? 100 : 50,
        h: type === 'couch' ? 80 : 60
      });
    } else {
      game.bgElements.push({
        type: 'tree',
        x,
        y: game.groundY - 100,
        w: 60,
        h: 100
      });
    }
  }

  // ---- Collision Detection ----
  function boxCollision(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  // ---- Particle System ----
  function emitParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      game.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 1) * 4,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  // ---- Screen Shake ----
  function triggerShake(intensity, duration) {
    game.shakeIntensity = intensity || 6;
    game.shakeTimer = duration || 15;
  }

  // ---- Score Popup ----
  function addPopup(x, y, text, className) {
    const popup = document.createElement('div');
    popup.className = 'score-popup ' + (className || '');
    popup.textContent = text;

    // Convert game coords to screen coords
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / GAME_W;
    const scaleY = rect.height / GAME_H;
    popup.style.left = (x * scaleX + rect.left) + 'px';
    popup.style.top = (y * scaleY + rect.top) + 'px';

    document.getElementById('game-wrapper').appendChild(popup);
    setTimeout(() => popup.remove(), 1800);
  }

  // ---- Scene Transitions ----
  function startOutdoorMode() {
    game.transitionTarget = 'outdoor';
    game.state = STATE.TRANSITION;
    game.transitionAlpha = 0;

    // Show flash
    const flash = document.getElementById('outdoor-flash');
    flash.classList.remove('hidden');
    flash.classList.add('showing');
    setTimeout(() => {
      flash.classList.remove('showing');
      flash.classList.add('hidden');
    }, 1000);
  }

  function endOutdoorMode() {
    game.transitionTarget = 'indoor';
    game.state = STATE.TRANSITION;
    game.transitionAlpha = 0;
  }

  // Random complaint texts for variety
  const complaintTexts = [
    'Xiaoli lodges a formal complaint about inadequate treat supplies.',
    'Xiaoli demands to speak with the manager of this household.',
    'Xiaoli files grievance #847: too many dogs, not enough boxes.',
    'Captain Xiaoli reports unacceptable working conditions.',
    'Xiaoli insists this was NOT her fault and wants it on record.',
    'Xiaoli submits a strongly worded letter to the complaints department.',
    'Xiaoli would like it noted that she tried her best.',
    'Xiaoli reminds everyone she is a HOUSE cat, not a fighter.',
  ];

  function triggerComplaint() {
    game.state = STATE.COMPLAINT;
    game.complaintShown = true;

    // Update complaint text and score display
    const isNewHigh = game.score > 0 && game.score >= game.highScore;
    const textEl = document.getElementById('complaint-text');
    if (textEl) {
      textEl.textContent = complaintTexts[Math.floor(Math.random() * complaintTexts.length)];
    }
    const scoreEl = document.getElementById('complaint-score');
    if (scoreEl) {
      scoreEl.textContent = 'Score: ' + game.score + (isNewHigh ? '  NEW BEST!' : '');
    }

    const overlay = document.getElementById('complaint-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('showing');

    // Draw complaint scene on a mini canvas
    const scene = document.getElementById('complaint-scene');
    scene.innerHTML = '';
    const miniCanvas = document.createElement('canvas');
    miniCanvas.width = 200;
    miniCanvas.height = 200;
    scene.appendChild(miniCanvas);

    const mctx = miniCanvas.getContext('2d');
    let cframe = 0;

    let complaintAnimId = null;
    function drawComplaintScene() {
      if (game.state !== STATE.COMPLAINT) {
        if (complaintAnimId) cancelAnimationFrame(complaintAnimId);
        return;
      }
      mctx.clearRect(0, 0, 200, 200);

      // Floor
      mctx.fillStyle = '#f3f4f6';
      mctx.fillRect(0, 160, 200, 40);

      // Xiaoli with hat
      Sprites.drawComplaintCaptain(mctx, 50, 95, 60, 55, cframe);

      // Owner petting
      Sprites.drawOwner(mctx, 120, 60, 60, 110, cframe);

      cframe++;
      complaintAnimId = requestAnimationFrame(drawComplaintScene);
    }
    drawComplaintScene();
  }

  function resumeFromComplaint() {
    game.state = STATE.PLAYING;
    game.player.health = game.player.maxHealth * 0.5;
    game.player.invincible = 120; // 2 seconds of invincibility
    game.complaintShown = false;
    game.entities = [];

    const overlay = document.getElementById('complaint-overlay');
    overlay.classList.remove('showing');
    overlay.classList.add('hidden');

    updateUI();
  }

  // ---- Input ----
  let jumpPressed = false;
  let jumpBuffered = false;

  function handleJump() {
    if (game.state === STATE.MENU) {
      startGame();
      return;
    }
    if (game.state !== STATE.PLAYING && game.state !== STATE.OUTDOOR) return;

    if (game.player.grounded) {
      game.player.vy = -9.5;
      game.player.grounded = false;
      game.player.doubleJumped = false;
      game.player.animState = 'jump';
      emitParticles(game.player.x + game.player.w/2, game.player.y + game.player.h, '#d1d5db', 5);

      // Outdoor jump bonus
      if (game.scene === 'outdoor') {
        game.score += 5;
        addPopup(game.player.x, game.player.y - 10, '+5', 'birds');
      }
    } else if (!game.player.doubleJumped) {
      // Double jump! Cats always land on their feet
      game.player.vy = -8;
      game.player.doubleJumped = true;
      game.player.animState = 'jump';
      emitParticles(game.player.x + game.player.w/2, game.player.y + game.player.h, '#e5e7eb', 4);
      emitParticles(game.player.x + game.player.w/2, game.player.y + game.player.h, '#f9a8d4', 3);
    } else {
      jumpBuffered = true;
    }
  }

  // Touch / click
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJump();
  }, { passive: false });

  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleJump();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (!jumpPressed) {
        jumpPressed = true;
        handleJump();
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      jumpPressed = false;
    }
  });

  // Start button
  document.getElementById('start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });

  // Continue button
  document.getElementById('continue-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    resumeFromComplaint();
  });

  // Show high score on title screen
  const titleHi = document.getElementById('title-highscore');
  if (titleHi && game.highScore > 0) {
    titleHi.textContent = 'BEST: ' + game.highScore;
  }

  function startGame() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hiding');
    setTimeout(() => {
      startScreen.style.display = 'none';
      initGame();
    }, 400);
  }

  // ---- Update ----
  function update() {
    if (game.state !== STATE.PLAYING && game.state !== STATE.OUTDOOR && game.state !== STATE.TRANSITION) return;

    game.frame++;

    // Handle transition
    if (game.state === STATE.TRANSITION) {
      game.transitionAlpha += 0.03;
      if (game.transitionAlpha >= 1) {
        game.scene = game.transitionTarget;
        game.bgElements = [];
        game.entities = [];
        spawnBgElement(100);
        spawnBgElement(300);

        if (game.scene === 'outdoor') {
          game.state = STATE.OUTDOOR;
          game.outdoorTimer = game.outdoorDuration;
        } else {
          game.state = STATE.PLAYING;
        }
        game.transitionAlpha = 0;
      }
      return;
    }

    // Outdoor timer
    if (game.state === STATE.OUTDOOR) {
      game.outdoorTimer--;
      if (game.outdoorTimer <= 0) {
        endOutdoorMode();
        return;
      }
      // Bonus points while outside
      if (game.frame % 30 === 0) {
        game.score += 2;
      }
    }

    // Difficulty scaling
    game.difficultyTimer++;
    if (game.difficultyTimer % 600 === 0) { // Every 10 seconds
      game.scrollSpeed = Math.min(game.maxScrollSpeed, game.scrollSpeed + 0.2);
      game.spawnInterval = Math.max(game.minSpawnInterval, game.spawnInterval - 5);
    }

    // Player physics
    const p = game.player;

    // Gravity
    if (!p.grounded) {
      p.vy += 0.45;
      p.y += p.vy;

      // Land on ground
      if (p.y >= game.groundY - p.h) {
        p.y = game.groundY - p.h;
        p.vy = 0;
        p.grounded = true;
        p.doubleJumped = false;
        p.animState = 'land';
        setTimeout(() => { if (p.grounded) p.animState = 'run'; }, 100);

        // Buffer jump
        if (jumpBuffered) {
          jumpBuffered = false;
          handleJump();
        }
      }
    }

    // Invincibility cooldown
    if (p.invincible > 0) p.invincible--;
    if (p.scratching > 0) p.scratching--;

    // Spawn entities
    game.spawnTimer++;
    if (game.spawnTimer >= game.spawnInterval) {
      game.spawnTimer = 0;
      spawnEntity();
    }

    // Spawn background elements
    if (game.frame % 180 === 0) {
      spawnBgElement();
    }

    // Update entities
    game.entities.forEach(ent => {
      ent.x -= game.scrollSpeed;

      if (ent.type === 'bird') {
        ent.y += Math.sin(game.frame * 0.05 + ent.x * 0.01) * 0.5;
      }

      // Off screen
      if (ent.x + ent.w < -20) {
        ent.active = false;
        return;
      }

      // Collision with player
      if (!ent.active) return;
      if (!boxCollision(p, ent)) return;

      switch (ent.type) {
        case 'box':
          // Jump into box for treats!
          ent.active = false;
          game.score += 25;
          addPopup(ent.x, ent.y - 20, 'TREATS! +25', 'treats');
          emitParticles(ent.x + ent.w/2, ent.y, '#f472b6', 10);
          emitParticles(ent.x + ent.w/2, ent.y, '#fbbf24', 8);
          game.effects.push({ type: 'treats', x: ent.x + ent.w/2, y: ent.y - 10, frame: 0 });
          break;

        case 'dog':
          if (p.invincible > 0) return;
          // Scratch the dog but take damage
          p.health -= 20;
          p.invincible = 60;
          p.scratching = 30;
          game.score += 5; // small points for scratching
          addPopup(ent.x, ent.y - 20, 'SCRATCH! -20hp', '');
          emitParticles(ent.x + ent.w/2, ent.y + ent.h/2, '#fbbf24', 8);
          game.effects.push({ type: 'scratch', x: ent.x + ent.w/2, y: ent.y + ent.h/2, frame: 0 });
          triggerShake(8, 20);

          if (p.health <= 0) {
            p.health = 0;
            triggerComplaint();
          }
          break;

        case 'food':
          ent.active = false;
          if (ent.fresh) {
            // Fresh food restores health
            p.health = Math.min(p.maxHealth, p.health + 15);
            game.score += 10;
            addPopup(ent.x, ent.y - 20, '+15hp +10', 'health');
            emitParticles(ent.x + ent.w/2, ent.y, '#4ade80', 8);

            // Check if health is full -> outdoor time!
            if (p.health >= p.maxHealth && game.scene === 'indoor') {
              startOutdoorMode();
            }
          } else {
            // Stale food - swat it away!
            game.score += 2;
            addPopup(ent.x, ent.y - 20, 'SWAT! +2', '');
            game.effects.push({ type: 'swat', x: ent.x + ent.w/2, y: ent.y, frame: 0 });
            emitParticles(ent.x + ent.w/2, ent.y, '#9ca3af', 5);
          }
          break;

        case 'bird':
          // Swat birds for points
          ent.active = false;
          game.score += 15;
          addPopup(ent.x, ent.y - 20, '+15', 'birds');
          emitParticles(ent.x + ent.w/2, ent.y, '#93c5fd', 8);
          break;

        case 'grass_bonus':
          // Roll in the grass for health + points
          ent.active = false;
          p.health = Math.min(p.maxHealth, p.health + 10);
          game.score += 8;
          addPopup(ent.x, ent.y - 20, '+10hp +8', 'health');
          emitParticles(ent.x + ent.w/2, ent.y, '#4ade80', 10);
          emitParticles(ent.x + ent.w/2, ent.y, '#22c55e', 6);
          break;
      }
    });

    // Remove inactive entities
    game.entities = game.entities.filter(e => e.active);

    // Update effects
    game.effects.forEach(e => e.frame++);
    game.effects = game.effects.filter(e => e.frame < 40);

    // Update particles
    game.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life--;
    });
    game.particles = game.particles.filter(p => p.life > 0);

    // Update background
    game.bgElements.forEach(bg => {
      bg.x -= game.scrollSpeed * 0.5;
    });
    game.bgElements = game.bgElements.filter(bg => bg.x + bg.w > -50);

    game.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -80) {
        c.x = GAME_W + 40;
        c.y = 20 + Math.random() * 60;
      }
    });

    // Update screen shake
    if (game.shakeTimer > 0) {
      game.shakeTimer--;
    }

    // Passive score
    if (game.frame % 60 === 0) {
      game.score += 1;
    }

    updateUI();
  }

  // ---- Render ----
  function render() {
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    if (game.state === STATE.MENU) {
      renderMenu();
      return;
    }

    // Sky
    if (game.scene === 'indoor') {
      // Indoor background
      const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.6, '#fde68a');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Wall pattern
      ctx.fillStyle = 'rgba(251,191,36,0.1)';
      for (let i = 0; i < GAME_W; i += 40) {
        ctx.fillRect(i, 0, 1, game.groundY);
      }
      for (let i = 0; i < game.groundY; i += 30) {
        ctx.fillRect(0, i, GAME_W, 1);
      }
    } else {
      // Outdoor background
      const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
      grad.addColorStop(0, '#7dd3fc');
      grad.addColorStop(0.5, '#bae6fd');
      grad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Sun
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(GAME_W - 60, 50, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(GAME_W - 60, 50, 22, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = 'rgba(251,191,36,0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + game.frame * 0.01;
        ctx.beginPath();
        ctx.moveTo(GAME_W - 60 + Math.cos(angle) * 35, 50 + Math.sin(angle) * 35);
        ctx.lineTo(GAME_W - 60 + Math.cos(angle) * 48, 50 + Math.sin(angle) * 48);
        ctx.stroke();
      }
    }

    // Clouds
    game.clouds.forEach(c => {
      Sprites.drawCloud(ctx, c.x, c.y, c.scale);
    });

    // Background elements
    game.bgElements.forEach(bg => {
      switch (bg.type) {
        case 'couch': Sprites.drawCouch(ctx, bg.x, bg.y, bg.w, bg.h); break;
        case 'window': Sprites.drawWindow(ctx, bg.x, bg.y, bg.w, bg.h); break;
        case 'tree': Sprites.drawTree(ctx, bg.x, bg.y, bg.w, bg.h); break;
      }
    });

    // Ground
    if (game.scene === 'indoor') {
      // Wood floor
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(0, game.groundY, GAME_W, GAME_H - game.groundY);

      // Floor boards
      ctx.strokeStyle = '#c4956a';
      ctx.lineWidth = 1;
      for (let i = 0; i < GAME_W; i += 60) {
        const offset = (game.frame * game.scrollSpeed) % 60;
        ctx.beginPath();
        ctx.moveTo(i - offset, game.groundY);
        ctx.lineTo(i - offset, GAME_H);
        ctx.stroke();
      }

      // Baseboard
      ctx.fillStyle = '#92400e';
      ctx.fillRect(0, game.groundY, GAME_W, 4);
    } else {
      // Grass ground
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, game.groundY, GAME_W, GAME_H - game.groundY);

      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, game.groundY, GAME_W, 4);

      // Grass tufts
      for (let i = 0; i < GAME_W; i += 30) {
        const offset = (game.frame * game.scrollSpeed * 0.5) % 30;
        Sprites.drawGrass(ctx, i - offset, game.groundY, 20, game.frame);
      }

      // Dirt below
      ctx.fillStyle = '#92400e';
      ctx.fillRect(0, game.groundY + 15, GAME_W, GAME_H - game.groundY - 15);
    }

    // Entities
    game.entities.forEach(ent => {
      switch (ent.type) {
        case 'box':
          Sprites.drawBox(ctx, ent.x, ent.y, ent.w, ent.h, true);
          break;
        case 'dog':
          Sprites.drawDog(ctx, ent.x, ent.y, ent.w, ent.h, game.frame);
          break;
        case 'food':
          Sprites.drawFoodPlate(ctx, ent.x, ent.y, ent.w, ent.h, ent.fresh, game.frame);
          break;
        case 'bird':
          Sprites.drawBird(ctx, ent.x, ent.y, ent.w, ent.h, game.frame);
          break;
        case 'grass_bonus':
          Sprites.drawGrassBonus(ctx, ent.x, ent.y, ent.w, ent.h, game.frame);
          break;
      }
    });

    // Player (Xiaoli)
    const p = game.player;
    ctx.save();

    // Flash when invincible
    if (p.invincible > 0 && Math.floor(game.frame / 4) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    Sprites.drawXiaoli(ctx, p.x, p.y, p.w, p.h, game.frame, p.animState);
    ctx.restore();

    // Effects
    game.effects.forEach(e => {
      switch (e.type) {
        case 'treats':
          Sprites.drawTreatCallout(ctx, e.x, e.y, e.frame);
          break;
        case 'scratch':
          Sprites.drawScratch(ctx, e.x, e.y, e.frame);
          break;
        case 'swat':
          Sprites.drawSwat(ctx, e.x, e.y, e.frame);
          break;
      }
    });

    // Particles
    game.particles.forEach(part => {
      ctx.globalAlpha = part.life / part.maxLife;
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Outdoor timer bar
    if (game.state === STATE.OUTDOOR || game.scene === 'outdoor') {
      const timerPct = game.outdoorTimer / game.outdoorDuration;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(GAME_W * 0.1, GAME_H - 15, GAME_W * 0.8, 8);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(GAME_W * 0.1, GAME_H - 15, GAME_W * 0.8 * timerPct, 8);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OUTSIDE TIME', GAME_W / 2, GAME_H - 20);
    }

    // Transition overlay
    if (game.state === STATE.TRANSITION) {
      ctx.fillStyle = `rgba(0,0,0,${game.transitionAlpha})`;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = game.transitionAlpha;
      if (game.transitionTarget === 'outdoor') {
        ctx.fillText('OUTSIDE TIME!', GAME_W / 2, GAME_H / 2);
      } else {
        ctx.fillText('Back Inside...', GAME_W / 2, GAME_H / 2);
      }
      ctx.globalAlpha = 1;
    }
  }

  function renderMenu() {
    // Draw a preview scene behind the menu
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Floating particles
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 20; i++) {
      const px = (Math.sin(game.frame * 0.01 + i * 1.5) + 1) * GAME_W / 2;
      const py = (Math.cos(game.frame * 0.008 + i * 2) + 1) * GAME_H / 2;
      ctx.beginPath();
      ctx.arc(px, py, 2 + Math.sin(i) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    game.frame++;
  }

  // ---- Game Loop ----
  function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
  }

  // Show high score on title screen
  function updateTitleHighScore() {
    const el = document.getElementById('title-highscore');
    if (el && game.highScore > 0) {
      el.textContent = 'BEST: ' + game.highScore;
    }
  }
  updateTitleHighScore();

  gameLoop();

})();
