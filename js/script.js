// ── CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function loop() {
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
  rx += (mx - rx) * 0.09;
  ry += (my - ry) * 0.09;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a,button,label,.proj-card,.strength-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('is-hover'));
});

// ── THEME TOGGLE ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const stored = localStorage.getItem('elton-theme');
if (stored === 'dark') html.setAttribute('data-theme', 'dark');

themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('elton-theme', next);
});

// ── NAV STUCK ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 40));

// ── TYPEWRITER ──
const roles = [
  'currently learning React.js',
  'building web projects',
  'studying for OJT',
  'exploring JavaScript',
  'growing every day'
];
let ri = 0, ci = 0, del = false;
const typer = document.getElementById('typer');

function type() {
  const w = roles[ri];
  if (!del) {
    typer.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 1900); return; }
  } else {
    typer.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, del ? 48 : 82);
}
setTimeout(type, 1100);

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      const pf = document.getElementById('progFill');
      if (e.target.closest('#about') && pf) pf.classList.add('animate');
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal,.reveal-x,.reveal-scale').forEach(el => obs.observe(el));

// ── TIMELINE REVEAL ──
const tlObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.tl').forEach((t, i) => {
        setTimeout(() => t.classList.add('in'), i * 110);
      });
    }
  });
}, { threshold: 0.05 });
const tlc = document.getElementById('tlContainer');
if (tlc) tlObs.observe(tlc);

// ── LEARNING BAR ANIMATIONS ──
const lObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.li-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 120);
      });
    }
  });
}, { threshold: 0.1 });
const lc = document.getElementById('learningCard');
if (lc) lObs.observe(lc);

// ── PHOTO UPLOAD (clean, no remove/change buttons) ──
const photo = document.getElementById('profilePhoto');
const photoContainer = document.getElementById('photoContainer');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const photoInput = document.getElementById('photoInput');

// Show saved photo on load
const savedPhoto = localStorage.getItem('elton_pp');
if (savedPhoto) {
  photo.src = savedPhoto;
  photo.style.display = 'block';
  uploadPlaceholder.style.display = 'none';
}

// Click anywhere on the container to upload a new photo
photoContainer.addEventListener('click', () => {
  photoInput.click();
});

// Handle file selection
function loadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataURL = ev.target.result;
    localStorage.setItem('elton_pp', dataURL);
    photo.src = dataURL;
    photo.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ── CONTACT FORM ──
function handleSend(btn) {
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    document.getElementById('form-msg').style.display = 'block';
  }, 1300);
}

// ── SUBTLE PARALLAX (hero blob) ──
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 18;
  const y = (e.clientY / window.innerHeight - 0.5) * 12;
  const hero = document.getElementById('hero');
  if (hero) hero.style.setProperty('--px', x + 'px');
});

/* =================================================================
   AESTHETIC 3D TECH ORB BACKGROUND
   ================================================================= */
(function() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;

  const OUTER_RADIUS = 140;
  const INNER_RADIUS = 70;
  const RING_RADIUS = 165;
  const RING_PARTICLES = 40;
  const AMBIENT_PARTICLES = 80;
  const RING_ROT_SPEED = 0.003;
  const ORB_ROT_SPEED = 0.002;
  const SCROLL_DEPTH = 0.08;
  const MOUSE_TILT = 0.004;

  let angleX = 0, angleY = 0;
  let ringAngle = 0;
  let scrollOffset = 0;
  let mouseX = 0.5, mouseY = 0.5;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / width;
    mouseY = e.clientY / height;
  });

  window.addEventListener('scroll', () => {
    scrollOffset = window.pageYOffset * SCROLL_DEPTH;
  });

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      glowInner: isDark ? 'rgba(91,130,184, 0.12)' : 'rgba(27,43,69, 0.08)',
      glowMid:   isDark ? 'rgba(125,163,211, 0.06)' : 'rgba(38,63,99, 0.04)',
      glowOuter: 'transparent',
      outerLineMain:   isDark ? 'rgba(125,163,211, 0.25)' : 'rgba(27,43,69, 0.2)',
      outerLineAccent: isDark ? 'rgba(224,96,48, 0.35)' : 'rgba(201,75,18, 0.3)',
      innerLine:       isDark ? 'rgba(200,215,235, 0.35)' : 'rgba(65,85,125, 0.3)',
      innerAccentLine: isDark ? 'rgba(224,96,48, 0.4)' : 'rgba(201,75,18, 0.35)',
      outerDot:   isDark ? 'rgba(125,163,211, 0.8)' : 'rgba(27,43,69, 0.75)',
      innerDot:   isDark ? 'rgba(200,215,235, 0.95)' : 'rgba(65,85,125, 0.9)',
      accentDot:  isDark ? 'rgba(240,112,64, 0.95)' : 'rgba(224,96,48, 0.9)',
      ringColor:      isDark ? 'rgba(224,96,48, 0.3)' : 'rgba(201,75,18, 0.3)',
      ringParticle:   isDark ? 'rgba(224,96,48, 0.9)' : 'rgba(201,75,18, 0.85)',
      ringParticleGlow: isDark ? 'rgba(224,96,48, 0.2)' : 'rgba(201,75,18, 0.15)',
      ambientParticle: isDark ? 'rgba(125,163,211, 0.4)' : 'rgba(27,43,69, 0.35)',
      ambientAccent:   isDark ? 'rgba(224,96,48, 0.5)' : 'rgba(201,75,18, 0.45)',
    };
  }

  function rotate(px, py, pz, ax, ay) {
    let x1 = px * Math.cos(ay) - pz * Math.sin(ay);
    let z1 = px * Math.sin(ay) + pz * Math.cos(ay);
    let y1 = py * Math.cos(ax) - z1 * Math.sin(ax);
    let z2 = py * Math.sin(ax) + z1 * Math.cos(ax);
    return { x: x1, y: y1, z: z2 };
  }

  const latBands = 16, lonBands = 24;
  let outerPoints = [];
  for (let i = 0; i <= latBands; i++) {
    outerPoints[i] = [];
    let theta = (i / latBands) * Math.PI;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    for (let j = 0; j <= lonBands; j++) {
      let phi = (j / lonBands) * Math.PI * 2;
      outerPoints[i][j] = {
        x: Math.cos(phi) * sinTheta,
        y: cosTheta,
        z: Math.sin(phi) * sinTheta,
        isAccent: (i === 0 || i === latBands) ? false : (Math.random() < 0.08)
      };
    }
  }

  const innerLatBands = 8, innerLonBands = 12;
  let innerPoints = [];
  for (let i = 0; i <= innerLatBands; i++) {
    innerPoints[i] = [];
    let theta = (i / innerLatBands) * Math.PI;
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    for (let j = 0; j <= innerLonBands; j++) {
      let phi = (j / innerLonBands) * Math.PI * 2;
      innerPoints[i][j] = {
        x: Math.cos(phi) * sinTheta,
        y: cosTheta,
        z: Math.sin(phi) * sinTheta,
        isAccent: (Math.random() < 0.15)
      };
    }
  }

  let ringParticlesArr = [];
  for (let i = 0; i < RING_PARTICLES; i++) {
    ringParticlesArr.push({ baseAngle: (i / RING_PARTICLES) * Math.PI * 2 });
  }

  let ambientParticles = [];
  for (let i = 0; i < AMBIENT_PARTICLES; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      accent: Math.random() < 0.25,
    });
  }

  function drawAmbientParticles(scrollOff) {
    const colors = getColors();
    for (let p of ambientParticles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
      let drawY = p.y + scrollOff * 0.3;
      let drawX = p.x;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.accent ? colors.ambientAccent : colors.ambientParticle;
      ctx.fill();
      if (p.radius > 2.0) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.accent ? 'rgba(224,96,48, 0.08)' : 'rgba(125,163,211, 0.06)';
        ctx.fill();
      }
    }
  }

  function draw() {
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2 + scrollOffset;

    const targetAngleX = (mouseY - 0.5) * 0.5;
    const targetAngleY = (mouseX - 0.5) * 0.5;
    angleX += (targetAngleX - angleX) * 0.02;
    angleY += (targetAngleY - angleY) * 0.02;
    angleY += ORB_ROT_SPEED;
    ringAngle += RING_ROT_SPEED;

    drawAmbientParticles(scrollOffset);

    const glowGradient = ctx.createRadialGradient(centerX, centerY, INNER_RADIUS * 0.5, centerX, centerY, OUTER_RADIUS * 2.4);
    glowGradient.addColorStop(0, colors.glowInner);
    glowGradient.addColorStop(0.5, colors.glowMid);
    glowGradient.addColorStop(1, colors.glowOuter);
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, OUTER_RADIUS * 2.4, 0, Math.PI * 2);
    ctx.fill();

    // outer sphere lines
    for (let i = 0; i <= latBands; i++) {
      for (let j = 0; j < lonBands; j++) {
        let p1 = outerPoints[i][j], p2 = outerPoints[i][j+1];
        let r1 = rotate(p1.x,p1.y,p1.z,angleX,angleY), r2 = rotate(p2.x,p2.y,p2.z,angleX,angleY);
        let sc1=300/(300+r1.z*OUTER_RADIUS), sc2=300/(300+r2.z*OUTER_RADIUS);
        let sx1=centerX+r1.x*OUTER_RADIUS*sc1, sy1=centerY+r1.y*OUTER_RADIUS*sc1;
        let sx2=centerX+r2.x*OUTER_RADIUS*sc2, sy2=centerY+r2.y*OUTER_RADIUS*sc2;
        let zAvg=(r1.z+r2.z)*0.5, alpha=0.25-Math.abs(zAvg)*0.18; if(alpha<0.05)alpha=0.05;
        if(i%3===0){ctx.setLineDash([4,3]); ctx.strokeStyle=colors.outerLineAccent;}
        else{ctx.setLineDash([]); ctx.strokeStyle=colors.outerLineMain;}
        ctx.globalAlpha=alpha; ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.moveTo(sx1,sy1); ctx.lineTo(sx2,sy2); ctx.stroke();
      }
    }
    for (let j=0; j<=lonBands; j++) {
      for (let i=0; i<latBands; i++) {
        let p1=outerPoints[i][j], p2=outerPoints[i+1][j];
        let r1=rotate(p1.x,p1.y,p1.z,angleX,angleY), r2=rotate(p2.x,p2.y,p2.z,angleX,angleY);
        let sc1=300/(300+r1.z*OUTER_RADIUS), sc2=300/(300+r2.z*OUTER_RADIUS);
        let sx1=centerX+r1.x*OUTER_RADIUS*sc1, sy1=centerY+r1.y*OUTER_RADIUS*sc1;
        let sx2=centerX+r2.x*OUTER_RADIUS*sc2, sy2=centerY+r2.y*OUTER_RADIUS*sc2;
        let zAvg=(r1.z+r2.z)*0.5, alpha=0.25-Math.abs(zAvg)*0.18; if(alpha<0.05)alpha=0.05;
        ctx.strokeStyle=j%5===0?colors.outerLineAccent:colors.outerLineMain;
        ctx.globalAlpha=alpha; ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.moveTo(sx1,sy1); ctx.lineTo(sx2,sy2); ctx.stroke();
      }
    }
    ctx.setLineDash([]); ctx.globalAlpha=1;

    // outer dots
    for(let i=0;i<=latBands;i++){
      for(let j=0;j<=lonBands;j++){
        let p=outerPoints[i][j], r=rotate(p.x,p.y,p.z,angleX,angleY);
        let sc=300/(300+r.z*OUTER_RADIUS);
        let sx=centerX+r.x*OUTER_RADIUS*sc, sy=centerY+r.y*OUTER_RADIUS*sc;
        let sz=2.0/(1+Math.abs(r.z)*0.8); if(sz<0.4)continue;
        ctx.beginPath(); ctx.arc(sx,sy,sz,0,Math.PI*2);
        ctx.fillStyle=p.isAccent?colors.accentDot:colors.outerDot; ctx.fill();
      }
    }

    // inner core
    for(let i=0;i<=innerLatBands;i++){
      for(let j=0;j<innerLonBands;j++){
        let p1=innerPoints[i][j], p2=innerPoints[i][j+1];
        let r1=rotate(p1.x,p1.y,p1.z,angleX*1.2,angleY*1.2), r2=rotate(p2.x,p2.y,p2.z,angleX*1.2,angleY*1.2);
        let sc1=300/(300+r1.z*INNER_RADIUS), sc2=300/(300+r2.z*INNER_RADIUS);
        let sx1=centerX+r1.x*INNER_RADIUS*sc1, sy1=centerY+r1.y*INNER_RADIUS*sc1;
        let sx2=centerX+r2.x*INNER_RADIUS*sc2, sy2=centerY+r2.y*INNER_RADIUS*sc2;
        let zAvg=(r1.z+r2.z)*0.5, alpha=0.5-Math.abs(zAvg)*0.35; if(alpha<0.12)alpha=0.12;
        ctx.strokeStyle=i%2===0?colors.innerAccentLine:colors.innerLine;
        ctx.globalAlpha=alpha; ctx.lineWidth=0.9;
        ctx.beginPath(); ctx.moveTo(sx1,sy1); ctx.lineTo(sx2,sy2); ctx.stroke();
      }
    }
    for(let i=0;i<=innerLatBands;i++){
      for(let j=0;j<=innerLonBands;j++){
        let p=innerPoints[i][j], r=rotate(p.x,p.y,p.z,angleX*1.2,angleY*1.2);
        let sc=300/(300+r.z*INNER_RADIUS);
        let sx=centerX+r.x*INNER_RADIUS*sc, sy=centerY+r.y*INNER_RADIUS*sc;
        let sz=3.4/(1+Math.abs(r.z)*0.5); if(sz<0.8)continue;
        ctx.beginPath(); ctx.arc(sx,sy,sz,0,Math.PI*2);
        ctx.fillStyle=p.isAccent?colors.accentDot:colors.innerDot; ctx.fill();
        ctx.beginPath(); ctx.arc(sx,sy,sz*2.0,0,Math.PI*2);
        ctx.fillStyle=p.isAccent?'rgba(224,96,48,0.1)':'rgba(125,163,211,0.08)'; ctx.fill();
      }
    }
    ctx.globalAlpha=1;

    // ring
    const ringSegments=80;
    ctx.beginPath();
    for(let i=0;i<=ringSegments;i++){
      let angle=(i/ringSegments)*Math.PI*2;
      let px=Math.cos(angle)*RING_RADIUS, py=0, pz=Math.sin(angle)*RING_RADIUS;
      let r=rotate(px,py,pz,angleX*0.5,angleY*0.5);
      let sc=300/(300+r.z*RING_RADIUS);
      let sx=centerX+r.x*sc, sy=centerY+r.y*sc;
      if(i===0)ctx.moveTo(sx,sy); else ctx.lineTo(sx,sy);
    }
    ctx.strokeStyle=colors.ringColor; ctx.lineWidth=1.2; ctx.setLineDash([6,4]); ctx.stroke();
    ctx.setLineDash([]);
    for(let i=0;i<RING_PARTICLES;i++){
      let particle=ringParticlesArr[i], angle=particle.baseAngle+ringAngle;
      let px=Math.cos(angle)*RING_RADIUS, py=0, pz=Math.sin(angle)*RING_RADIUS;
      let r=rotate(px,py,pz,angleX*0.5,angleY*0.5);
      let sc=300/(300+r.z*RING_RADIUS);
      let sx=centerX+r.x*sc, sy=centerY+r.y*sc;
      let size=2.4/(1+Math.abs(r.z)*0.5);
      ctx.beginPath(); ctx.arc(sx,sy,size*3,0,Math.PI*2); ctx.fillStyle=colors.ringParticleGlow; ctx.fill();
      ctx.beginPath(); ctx.arc(sx,sy,size,0,Math.PI*2); ctx.fillStyle=colors.ringParticle; ctx.fill();
    }
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();
})();