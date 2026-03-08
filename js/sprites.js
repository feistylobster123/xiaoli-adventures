// ============================================
// XIAOLI ADVENTURES - Sprite Drawing System
// All sprites drawn procedurally on canvas
// ============================================

const Sprites = {
  // Draw Xiaoli the cat (grey and white fluffy cat)
  drawXiaoli(ctx, x, y, w, h, frame, state) {
    ctx.save();
    ctx.translate(x, y);

    const bounce = state === 'run' ? Math.sin(frame * 0.3) * 3 : 0;
    const squish = state === 'jump' ? 0.85 : (state === 'land' ? 1.15 : 1);
    const stretch = state === 'jump' ? 1.15 : (state === 'land' ? 0.85 : 1);

    ctx.translate(w/2, h);
    ctx.scale(squish, stretch);
    ctx.translate(-w/2, -h);
    ctx.translate(0, bounce);

    // Tail
    ctx.save();
    const tailWag = Math.sin(frame * 0.15) * 0.3;
    ctx.translate(w * 0.1, h * 0.4);
    ctx.rotate(tailWag - 0.5);
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-w * 0.3, -h * 0.3, -w * 0.15, -h * 0.5);
    ctx.quadraticCurveTo(-w * 0.05, -h * 0.35, w * 0.05, -h * 0.1);
    ctx.fill();
    // Fluffy tail tip
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(-w * 0.15, -h * 0.48, w * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body - grey with white belly
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.55, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // White belly patch
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.ellipse(w * 0.55, h * 0.6, w * 0.2, h * 0.22, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Fluff tufts on body
    ctx.fillStyle = '#d1d5db';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * (0.35 + i * 0.12), h * 0.42, w * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legs
    const legFrame = state === 'run' ? frame : 0;
    const frontLegAngle = Math.sin(legFrame * 0.3) * 0.3;
    const backLegAngle = Math.sin(legFrame * 0.3 + Math.PI) * 0.3;

    // Back legs
    ctx.fillStyle = '#9ca3af';
    ctx.save();
    ctx.translate(w * 0.25, h * 0.75);
    ctx.rotate(backLegAngle);
    ctx.fillRect(-4, 0, 8, h * 0.25);
    ctx.fillStyle = '#e5e7eb'; // white paws
    ctx.fillRect(-5, h * 0.2, 10, 6);
    ctx.restore();

    ctx.save();
    ctx.translate(w * 0.35, h * 0.75);
    ctx.rotate(frontLegAngle * 0.8);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(-4, 0, 8, h * 0.25);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(-5, h * 0.2, 10, 6);
    ctx.restore();

    // Front legs
    ctx.save();
    ctx.translate(w * 0.65, h * 0.75);
    ctx.rotate(frontLegAngle);
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(-4, 0, 8, h * 0.25);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(-5, h * 0.2, 10, 6);
    ctx.restore();

    ctx.save();
    ctx.translate(w * 0.75, h * 0.75);
    ctx.rotate(backLegAngle * 0.8);
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(-4, 0, 8, h * 0.25);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(-5, h * 0.2, 10, 6);
    ctx.restore();

    // Head
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.32, w * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // White face patch
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(w * 0.73, h * 0.36, w * 0.17, 0, Math.PI * 2);
    ctx.fill();

    // Cheek fluff
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(w * 0.58, h * 0.38, w * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.38, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.18);
    ctx.lineTo(w * 0.5, h * -0.02);
    ctx.lineTo(w * 0.65, h * 0.15);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.8, h * 0.15);
    ctx.lineTo(w * 0.85, h * -0.02);
    ctx.lineTo(w * 0.92, h * 0.18);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(w * 0.57, h * 0.18);
    ctx.lineTo(w * 0.53, h * 0.03);
    ctx.lineTo(w * 0.63, h * 0.16);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.82, h * 0.16);
    ctx.lineTo(w * 0.85, h * 0.03);
    ctx.lineTo(w * 0.9, h * 0.18);
    ctx.fill();

    // Eyes
    const blinkCycle = Math.floor(frame / 60) % 8;
    const isBlinking = blinkCycle === 0 && (frame % 60) > 55;

    if (isBlinking) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.63, h * 0.3);
      ctx.lineTo(w * 0.68, h * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.76, h * 0.3);
      ctx.lineTo(w * 0.81, h * 0.3);
      ctx.stroke();
    } else {
      // Eye whites
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(w * 0.65, h * 0.3, w * 0.055, w * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.78, h * 0.3, w * 0.055, w * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils (look forward)
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(w * 0.67, h * 0.3, w * 0.035, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.3, w * 0.035, 0, Math.PI * 2);
      ctx.fill();

      // Eye shine
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(w * 0.66, h * 0.285, w * 0.012, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.79, h * 0.285, w * 0.012, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.37);
    ctx.lineTo(w * 0.70, h * 0.39);
    ctx.lineTo(w * 0.74, h * 0.39);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.39);
    ctx.lineTo(w * 0.70, h * 0.42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.39);
    ctx.lineTo(w * 0.74, h * 0.42);
    ctx.stroke();

    // Whiskers
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    // Left whiskers
    ctx.beginPath(); ctx.moveTo(w * 0.58, h * 0.36); ctx.lineTo(w * 0.42, h * 0.33); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.58, h * 0.38); ctx.lineTo(w * 0.40, h * 0.39); ctx.stroke();
    // Right whiskers
    ctx.beginPath(); ctx.moveTo(w * 0.86, h * 0.36); ctx.lineTo(w * 1.02, h * 0.33); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.86, h * 0.38); ctx.lineTo(w * 1.04, h * 0.39); ctx.stroke();

    ctx.restore();
  },

  // Draw Xiaoli with captain's hat
  drawComplaintCaptain(ctx, x, y, w, h, frame) {
    this.drawXiaoli(ctx, x, y, w, h, frame, 'idle');

    ctx.save();
    ctx.translate(x, y);

    // Captain's hat
    const hatX = w * 0.7;
    const hatY = h * -0.05;

    // Hat brim
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.ellipse(hatX, hatY + 12, w * 0.3, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hat top
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(hatX - w * 0.2, hatY + 10);
    ctx.lineTo(hatX - w * 0.15, hatY - 12);
    ctx.quadraticCurveTo(hatX, hatY - 18, hatX + w * 0.15, hatY - 12);
    ctx.lineTo(hatX + w * 0.2, hatY + 10);
    ctx.fill();

    // Hat band
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(hatX - w * 0.18, hatY + 2, w * 0.36, 5);

    // Anchor emblem
    ctx.fillStyle = '#fbbf24';
    ctx.font = `bold ${w * 0.12}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText('\u2693', hatX, hatY);

    ctx.restore();
  },

  // Draw cardboard box
  drawBox(ctx, x, y, w, h, hasTreats) {
    ctx.save();
    ctx.translate(x, y);

    // Box shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(4, h - 4, w, 8);

    // Box body
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(0, h * 0.3, w, h * 0.7);

    // Box front face (darker)
    ctx.fillStyle = '#c4956a';
    ctx.fillRect(2, h * 0.35, w - 4, h * 0.6);

    // Box flaps (open)
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(-6, h * 0.1);
    ctx.lineTo(w * 0.3, h * 0.15);
    ctx.lineTo(w * 0.3, h * 0.3);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, h * 0.3);
    ctx.lineTo(w + 6, h * 0.1);
    ctx.lineTo(w * 0.7, h * 0.15);
    ctx.lineTo(w * 0.7, h * 0.3);
    ctx.fill();

    // Tape
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(w * 0.35, h * 0.35, w * 0.3, h * 0.5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(w * 0.38, h * 0.35, w * 0.24, h * 0.5);

    // Treats indicator
    if (hasTreats) {
      ctx.fillStyle = '#f472b6';
      ctx.font = `${w * 0.35}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('\u2764', w * 0.5, h * 0.08);
    }

    ctx.restore();
  },

  // Draw dog (enemy)
  drawDog(ctx, x, y, w, h, frame) {
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(frame * 0.2) * 2;
    ctx.translate(0, bounce);

    // Tail
    ctx.save();
    ctx.translate(w * 0.1, h * 0.35);
    ctx.rotate(Math.sin(frame * 0.2) * 0.4);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-3, -h * 0.25, 6, h * 0.25);
    ctx.restore();

    // Body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(w * 0.45, h * 0.55, w * 0.35, h * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    const legBounce = Math.sin(frame * 0.25) * 0.2;
    ctx.fillStyle = '#92400e';
    [0.25, 0.4, 0.55, 0.7].forEach((lx, i) => {
      ctx.save();
      ctx.translate(w * lx, h * 0.72);
      ctx.rotate(i % 2 === 0 ? legBounce : -legBounce);
      ctx.fillRect(-4, 0, 8, h * 0.28);
      ctx.restore();
    });

    // Head
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.38, w * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(w * 0.92, h * 0.42, w * 0.12, w * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(w * 0.98, h * 0.4, w * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.33, w * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(w * 0.83, h * 0.33, w * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Ears (floppy)
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(w * 0.68, h * 0.28, w * 0.08, w * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tongue (sometimes)
    if (Math.sin(frame * 0.1) > 0.5) {
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.ellipse(w * 0.95, h * 0.5, w * 0.04, w * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  // Draw food plate
  drawFoodPlate(ctx, x, y, w, h, isFresh, frame) {
    ctx.save();
    ctx.translate(x, y);

    // Plate
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.8, w * 0.45, h * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.75, w * 0.38, h * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isFresh) {
      // Fresh food - colorful, appetizing
      ctx.fillStyle = '#ef4444'; // meat
      ctx.beginPath();
      ctx.ellipse(w * 0.4, h * 0.65, w * 0.15, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22c55e'; // greens
      ctx.beginPath();
      ctx.ellipse(w * 0.6, h * 0.62, w * 0.12, h * 0.08, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b'; // side
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.72, w * 0.1, h * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steam
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const sx = w * (0.35 + i * 0.15);
        const waveOffset = Math.sin(frame * 0.05 + i) * 4;
        ctx.beginPath();
        ctx.moveTo(sx, h * 0.55);
        ctx.quadraticCurveTo(sx + waveOffset, h * 0.4, sx - waveOffset, h * 0.25);
        ctx.stroke();
      }

      // Sparkle
      ctx.fillStyle = '#fbbf24';
      const sparkle = Math.sin(frame * 0.1) * 0.5 + 0.5;
      ctx.globalAlpha = sparkle;
      ctx.font = `${w * 0.2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('\u2728', w * 0.8, h * 0.4);
      ctx.globalAlpha = 1;
    } else {
      // Stale food - grey, unappetizing
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.65, w * 0.18, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4b5563';
      ctx.beginPath();
      ctx.ellipse(w * 0.55, h * 0.7, w * 0.1, h * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stink lines
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 2; i++) {
        const sx = w * (0.4 + i * 0.2);
        const drift = Math.sin(frame * 0.04 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(sx, h * 0.5);
        ctx.quadraticCurveTo(sx + drift, h * 0.35, sx - drift, h * 0.2);
        ctx.stroke();
      }

      // Flies
      ctx.fillStyle = '#1f2937';
      for (let i = 0; i < 2; i++) {
        const fx = w * 0.5 + Math.sin(frame * 0.08 + i * Math.PI) * w * 0.3;
        const fy = h * 0.3 + Math.cos(frame * 0.06 + i * Math.PI) * h * 0.15;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
        // Wings
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.ellipse(fx - 2, fy - 1, 3, 1.5, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(fx + 2, fy - 1, 3, 1.5, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1f2937';
      }
    }

    ctx.restore();
  },

  // Draw bird (outdoor bonus)
  drawBird(ctx, x, y, w, h, frame) {
    ctx.save();
    ctx.translate(x, y);

    const flapAngle = Math.sin(frame * 0.3) * 0.5;

    // Body
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.5, w * 0.25, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.4, w * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(w * 0.9, h * 0.38);
    ctx.lineTo(w * 1.05, h * 0.42);
    ctx.lineTo(w * 0.9, h * 0.45);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.38, w * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.save();
    ctx.translate(w * 0.45, h * 0.4);
    ctx.rotate(flapAngle);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-w * 0.2, -h * 0.4, w * 0.1, -h * 0.25);
    ctx.fill();
    ctx.restore();

    // Tail
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.45);
    ctx.lineTo(w * 0.05, h * 0.3);
    ctx.lineTo(w * 0.1, h * 0.55);
    ctx.fill();

    ctx.restore();
  },

  // Draw grass tuft
  drawGrass(ctx, x, y, w, frame) {
    ctx.save();
    ctx.translate(x, y);
    const sway = Math.sin(frame * 0.03 + x * 0.01) * 2;

    const grassColors = ['#22c55e', '#16a34a', '#4ade80'];
    const heights = [18, 21, 15, 20, 17]; // fixed heights to avoid per-frame jitter
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = grassColors[i % 3];
      ctx.beginPath();
      ctx.moveTo(i * (w / 5), 0);
      ctx.quadraticCurveTo(i * (w / 5) + sway, -heights[i], i * (w / 5) + 3, 0);
      ctx.fill();
    }

    ctx.restore();
  },

  // Draw the owner (woman giving pets)
  drawOwner(ctx, x, y, w, h, frame) {
    ctx.save();
    ctx.translate(x, y);

    // Hair
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.12, w * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.32, h * 0.12, w * 0.36, h * 0.15);

    // Face
    ctx.fillStyle = '#fcd9b6';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.15, w * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.16, w * 0.07, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(w * 0.44, h * 0.13, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.56, h * 0.13, 2, 0, Math.PI * 2);
    ctx.fill();

    // Body / dress
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.25);
    ctx.lineTo(w * 0.2, h * 0.7);
    ctx.lineTo(w * 0.8, h * 0.7);
    ctx.lineTo(w * 0.7, h * 0.25);
    ctx.fill();

    // Petting arm
    const petMotion = Math.sin(frame * 0.1) * 5;
    ctx.fillStyle = '#fcd9b6';
    ctx.save();
    ctx.translate(w * 0.7, h * 0.35);
    ctx.rotate(0.5);
    ctx.fillRect(0, 0, w * 0.35, 8);
    // Hand
    ctx.beginPath();
    ctx.arc(w * 0.35, 4 + petMotion, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Hearts floating up
    ctx.fillStyle = '#f472b6';
    ctx.font = '14px sans-serif';
    const heartY = Math.sin(frame * 0.05) * 10;
    ctx.globalAlpha = 0.7;
    ctx.fillText('\u2764', w * 0.8, h * 0.2 + heartY);
    ctx.fillText('\u2764', w * 0.9, h * 0.1 - heartY);
    ctx.globalAlpha = 1;

    // Legs
    ctx.fillStyle = '#374151';
    ctx.fillRect(w * 0.35, h * 0.7, 8, h * 0.25);
    ctx.fillRect(w * 0.55, h * 0.7, 8, h * 0.25);

    // Shoes
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(w * 0.33, h * 0.93, 14, 6);
    ctx.fillRect(w * 0.53, h * 0.93, 14, 6);

    ctx.restore();
  },

  // Draw scratch effect
  drawScratch(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.globalAlpha = Math.max(0, 1 - frame * 0.05);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + frame * 0.1;
      const len = 15 + frame * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  // Draw treat callout
  drawTreatCallout(ctx, x, y, frame) {
    const scale = Math.min(1, frame * 0.1);
    const alpha = Math.max(0, 1 - frame * 0.03);

    ctx.save();
    ctx.translate(x, y - 20 - frame * 1.5);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;

    // Bubble
    ctx.fillStyle = '#fdf2f8';
    ctx.beginPath();
    ctx.roundRect(-40, -25, 80, 35, 10);
    ctx.fill();

    ctx.strokeStyle = '#f9a8d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-40, -25, 80, 35, 10);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#be185d';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TREATS!', 0, -4);

    // Little triangle
    ctx.fillStyle = '#fdf2f8';
    ctx.beginPath();
    ctx.moveTo(-5, 10);
    ctx.lineTo(5, 10);
    ctx.lineTo(0, 18);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  // Draw swat effect (for stale food)
  drawSwat(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = Math.max(0, 1 - frame * 0.04);

    // POW effect
    const scale = 0.5 + frame * 0.05;
    ctx.scale(scale, scale);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SWAT!', 0, 0);

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  // Draw cloud
  drawCloud(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';

    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, -5, 25, 0, Math.PI * 2);
    ctx.arc(50, 0, 20, 0, Math.PI * 2);
    ctx.arc(15, -15, 18, 0, Math.PI * 2);
    ctx.arc(35, -18, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // Draw indoor furniture (background detail)
  drawCouch(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(0, h * 0.3, w, h * 0.5, 8);
    ctx.fill();

    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.roundRect(0, h * 0.3, w * 0.15, h * 0.4, 6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(w * 0.85, h * 0.3, w * 0.15, h * 0.4, 6);
    ctx.fill();

    // Cushions
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(w * 0.18, h * 0.35, w * 0.28, h * 0.3, 6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(w * 0.54, h * 0.35, w * 0.28, h * 0.3, 6);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#92400e';
    ctx.fillRect(w * 0.05, h * 0.78, 6, h * 0.22);
    ctx.fillRect(w * 0.9, h * 0.78, 6, h * 0.22);

    ctx.restore();
  },

  drawWindow(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(4, 4, w/2 - 6, h/2 - 6);
    ctx.fillRect(w/2 + 2, 4, w/2 - 6, h/2 - 6);
    ctx.fillRect(4, h/2 + 2, w/2 - 6, h/2 - 6);
    ctx.fillRect(w/2 + 2, h/2 + 2, w/2 - 6, h/2 - 6);

    ctx.restore();
  },

  // Draw grass bonus pickup (outdoor collectible)
  drawGrassBonus(ctx, x, y, w, h, frame) {
    ctx.save();
    ctx.translate(x, y);

    // Glowing patch of lush grass
    const glow = Math.sin(frame * 0.08) * 0.15 + 0.85;
    ctx.globalAlpha = glow;

    // Base grass patch
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.8, w * 0.45, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tall grass blades
    const sway = Math.sin(frame * 0.05) * 3;
    const bladeColors = ['#22c55e', '#4ade80', '#86efac', '#4ade80', '#22c55e'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = bladeColors[i];
      ctx.beginPath();
      ctx.moveTo(w * (0.15 + i * 0.17), h * 0.8);
      ctx.quadraticCurveTo(w * (0.15 + i * 0.17) + sway, h * 0.1, w * (0.18 + i * 0.17), h * 0.8);
      ctx.fill();
    }

    // Sparkle
    ctx.fillStyle = '#fbbf24';
    ctx.globalAlpha = Math.sin(frame * 0.12) * 0.4 + 0.6;
    ctx.font = `${w * 0.3}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('\u2728', w * 0.5, h * 0.3);

    ctx.globalAlpha = 1;
    ctx.restore();
  },

  drawTree(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);

    // Trunk
    ctx.fillStyle = '#92400e';
    ctx.fillRect(w * 0.35, h * 0.5, w * 0.3, h * 0.5);

    // Foliage layers
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.1, h * 0.4);
    ctx.lineTo(w * 0.9, h * 0.4);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.15);
    ctx.lineTo(w * 0.05, h * 0.55);
    ctx.lineTo(w * 0.95, h * 0.55);
    ctx.fill();

    ctx.restore();
  }
};
