/* ============================================================
   CYBERPUNK PORTFOLIO — INTERACTIVE ENGINE
   Particles, Code Rain, Custom Cursor, 3D Cards, Animations
   ============================================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initPreloader();
  initCustomCursor();
  initParticles();
  initCodeRain();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initProjectCards3D();
  initMagneticButtons();
  initSmoothScroll();
  initParallaxShapes();
  initContactForm();
  initCertModal();
  initResumeModal();
  initTerminal();
  initGithubGrid();
  initReferralsSlider();
});

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  });
  // Fallback: hide after 3s no matter what
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 600);
  }, 3000);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  if (window.innerWidth <= 768) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const glow = document.getElementById('cursorGlow');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring + glow follow
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .btn, .skill-tag, .project-card, .cert-card, .profile-card, .contact-item, .hamburger, .form-input, .form-textarea, .nav-link, .slider-btn, .slider-dot, .github-cell, .terminal-input'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });
}

/* ============================================================
   PARTICLE SYSTEM (Canvas)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mousePos = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 120;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_RADIUS = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  // Create particles
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.1;
      this.alpha = this.baseAlpha;
      // Randomize color between cyan, purple, magenta
      const colors = [
        [0, 240, 255],   // cyan
        [139, 92, 246],  // purple
        [255, 0, 170],   // magenta
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Mouse interaction — attract nearby particles
      const dx = mousePos.x - this.x;
      const dy = mousePos.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        this.vx += (dx / dist) * force * 0.02;
        this.vy += (dy / dist) * force * 0.02;
        this.alpha = Math.min(this.baseAlpha + force * 0.5, 1);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Dampen velocity
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha * 0.15})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    particles.forEach(p => {
      const dx = mousePos.x - p.x;
      const dy = mousePos.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const alpha = (1 - dist / MOUSE_RADIUS) * 0.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   CODE RAIN (Matrix Effect)
   ============================================================ */
function initCodeRain() {
  const canvas = document.getElementById('code-rain-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン0123456789ABCDEF{}[]<>/\\|;:+-=*&^%$#@!';
  const charArray = chars.split('');
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = new Array(columns).fill(1);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  });

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00f0ff';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Vary brightness
      const brightness = Math.random();
      if (brightness > 0.7) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
      } else if (brightness > 0.4) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
      } else {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
      }

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ============================================================
   TYPING EFFECT
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  const phrases = [
    'Full Stack Applications',
    'AI-Powered Solutions',
    'Modern Web Experiences',
    'Scalable MERN Apps',
    'Innovative Chatbots',
    'Beautiful Interfaces',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      currentText = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    el.textContent = currentText;

    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  // Start after hero animation
  setTimeout(type, 1500);
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

/* ============================================================
   SKILL BARS ANIMATION
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          const width = entry.target.getAttribute('data-width');
          setTimeout(() => {
            entry.target.style.width = width + '%';
          }, 200);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   3D TILT EFFECT ON PROJECT CARDS
   ============================================================ */
function initProjectCards3D() {
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

      // Move glow with mouse
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 240, 255, 0.06) 0%, transparent 50%),
        rgba(15, 15, 25, 0.7)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.background = '';
    });
  });
}

/* ============================================================
   MAGNETIC BUTTON EFFECT
   ============================================================ */
function initMagneticButtons() {
  if (window.innerWidth <= 768) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   PARALLAX FLOATING SHAPES
   ============================================================ */
function initParallaxShapes() {
  const shapes = document.querySelectorAll('.shape');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 15;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

/* ============================================================
   CONTACT FORM — REAL EMAIL VIA FORMSUBMIT.CO
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('formSubmit');
    const originalHTML = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<span style="color: var(--bg-primary)">Sending...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Gather form data
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formsubmit.co/ajax/juneadbaba61@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await response.json();

      if (data.success === 'true' || data.success === true || response.ok) {
        // Success
        btn.innerHTML = '<span style="color: var(--bg-primary)">✓ Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #10b981)';
        btn.style.opacity = '1';
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      // Error state
      btn.innerHTML = '<span style="color: #fff">✕ Failed. Try again</span>';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 3000);
    }
  });
}

/* ============================================================
   CERTIFICATION PREVIEW MODAL
   ============================================================ */
function initCertModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalIssuer = document.getElementById('certModalIssuer');
  const modalDate = document.getElementById('certModalDate');
  const closeBtn = document.getElementById('certModalClose');
  const overlay = document.getElementById('certModalOverlay');

  const certCards = document.querySelectorAll('.cert-card[data-cert-img]');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgPath = card.getAttribute('data-cert-img');
      const name = card.querySelector('.cert-name').textContent;
      const issuer = card.querySelector('.cert-issuer').textContent;
      const date = card.querySelector('.cert-date').textContent;

      modalImg.src = imgPath;
      modalTitle.textContent = name;
      modalIssuer.textContent = issuer;
      modalDate.textContent = date;

      modal.classList.add('active');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modalImg.src = '';
    }, 400);
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================================
   RESUME PREVIEW MODAL
   ============================================================ */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (!modal) return;

  const openBtns = [
    document.getElementById('heroResumeBtn'),
    document.getElementById('navResumeBtn')
  ];
  const closeBtn = document.getElementById('resumeModalClose');
  const overlay = document.getElementById('resumeModalOverlay');

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================================
   INTERACTIVE HOLOGRAPHIC TERMINAL CONSOLE
   ============================================================ */
function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');

  if (!terminalInput || !terminalOutput || !terminalBody) return;

  const commands = {
    help: `Available commands:
  <span class="terminal-cmd">about</span>     - Summary of Mohammed Junead Baba
  <span class="terminal-cmd">skills</span>    - Technical capabilities matrix
  <span class="terminal-cmd">projects</span>  - Review core deployed projects
  <span class="terminal-cmd">hack</span>      - Execute diagnostic penetration scan
  <span class="terminal-cmd">clear</span>     - Wipe terminal display
  <span class="terminal-cmd">help</span>      - Print command list`,
    about: `Mohammed Junead Baba
  Role       : Full Stack Developer & AI/ML Enthusiast
  College    : CSE Student at CVR College of Engineering
  CGPA       : 8.94 (Major) / 8.67 (AI/ML Minor)
  Status     : Open to opportunities, internships & hackathons`,
    skills: `Technical Stack Matrix:
  Languages  : JavaScript, Python, Java, C, TSX, HTML5, CSS3
  Frameworks : React.js, Node.js, Express.js, Bootstrap
  Databases  : MongoDB, MySQL, Firebase, Supabase
  Dev Tools  : Git, GitHub, VS Code, NLP APIs, REST APIs`,
    projects: `Core Projects Catalog:
  1. <span class="terminal-cmd">ShopNest</span>     - Amazon Clone (MERN + UPI Payments)
  2. <span class="terminal-cmd">EduCore</span>      - Learning Platform (Supabase + Node)
  3. <span class="terminal-cmd">Edu-bot</span>      - AI College Chatbot (NLP + Bootstrap)
  4. <span class="terminal-cmd">EZTap</span>        - Ticket Tracking Portal (REST APIs)
  5. <span class="terminal-cmd">CourtConnect</span> - Sport Venue Booking (LocalStorage)`
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      const inputLower = input.toLowerCase();

      // Display what the user typed
      const inputLine = document.createElement('div');
      inputLine.className = 'terminal-line';
      inputLine.innerHTML = `<span class="terminal-prompt">guest@cyberdeck:~$</span> ${input}`;
      terminalOutput.appendChild(inputLine);

      // Execute command
      if (inputLower === 'clear') {
        terminalOutput.innerHTML = '';
      } else if (inputLower === 'hack') {
        runHackSequence();
      } else if (inputLower === '') {
        // Do nothing
      } else if (commands[inputLower]) {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-output-line';
        outputLine.innerHTML = commands[inputLower];
        terminalOutput.appendChild(outputLine);
      } else {
        const errorLine = document.createElement('div');
        errorLine.className = 'terminal-output-line';
        errorLine.style.color = 'var(--neon-red)';
        errorLine.innerHTML = `Command not recognized: <span class="terminal-cmd">${input}</span>. Type <span class="terminal-cmd">help</span> for instruction grid.`;
        terminalOutput.appendChild(errorLine);
      }

      // Reset input and scroll
      terminalInput.value = '';
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  // Focus input when clicking terminal card body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  function runHackSequence() {
    terminalInput.disabled = true;
    const steps = [
      { text: "INJECTING EXPLOIT BUFFER...", color: "var(--neon-amber)" },
      { text: "ESTABLISHING OVERFLOW SCANNER...", color: "var(--neon-purple)" },
      { text: "ACQUIRING ROOT ACCESS SCHEMATIC...", color: "var(--neon-purple)" },
      { text: "STREAK INTELLIGENCE: EXCEEDED EXPECTATIONS", color: "var(--neon-green)" },
      { text: "Mohammed Junead Baba's mainframe secure.", color: "var(--neon-cyan)" },
      { text: "HACK COMPLETED. ROOT NODE ACQUIRED.", color: "var(--neon-green)" }
    ];

    let delay = 0;
    steps.forEach((step, idx) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'terminal-output-line';
        line.style.color = step.color;
        line.style.fontWeight = 'bold';
        line.textContent = step.text;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        if (idx === steps.length - 1) {
          terminalInput.disabled = false;
          terminalInput.focus();
        }
      }, delay);
      delay += Math.random() * 400 + 300;
    });
  }
}

/* ============================================================
   CYBERNETIC GITHUB ACTIVITY GRID POPULATION
   ============================================================ */
async function initGithubGrid() {
  const grid = document.getElementById('githubGrid');
  if (!grid) return;

  const totalCells = 28 * 7; // 196 cells
  grid.innerHTML = '';

  // Render a loading state / fallback grid first
  renderFallbackGrid(grid, totalCells);

  try {
    const response = await fetch('https://github-contributions-api.deno.dev/junead20.json?flat=true');
    if (!response.ok) throw new Error('Failed to fetch contributions');
    
    const data = await response.json();
    if (!data || !data.contributions || data.contributions.length === 0) {
      throw new Error('Invalid contributions data');
    }

    const contributions = data.contributions;
    const startIndex = Math.max(0, contributions.length - totalCells);
    const recentContributions = contributions.slice(startIndex);

    // Clear loading/fallback grid
    grid.innerHTML = '';

    // Render the real contributions
    recentContributions.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'github-cell';
      
      let level = 0;
      if (day.contributionLevel === 'FIRST_QUARTILE') level = 1;
      else if (day.contributionLevel === 'SECOND_QUARTILE') level = 2;
      else if (day.contributionLevel === 'THIRD_QUARTILE') level = 3;
      else if (day.contributionLevel === 'FOURTH_QUARTILE') level = 4;

      cell.classList.add(`level-${level}`);
      
      // Set coloring for custom glow shadow
      if (level === 1) cell.style.color = '#0e4429';
      if (level === 2) cell.style.color = '#006d32';
      if (level === 3) cell.style.color = '#26a641';
      if (level === 4) cell.style.color = '#39d353';

      // Formatting date nicely
      const dateObj = new Date(day.date);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);

      // Set tooltip text
      const count = day.contributionCount;
      const tooltipText = `${count} contribution${count === 1 ? '' : 's'} on ${formattedDate}`;
      cell.title = tooltipText;

      grid.appendChild(cell);
    });

  } catch (error) {
    console.error('Error fetching GitHub contribution data:', error);
    // Keep fallback grid but remove the loading title
    Array.from(grid.children).forEach(cell => {
      cell.title = 'Connection issues. Simulated telemetry online.';
    });
  }
}

function renderFallbackGrid(grid, totalCells) {
  grid.innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'github-cell';

    // Randomize activity level
    const rand = Math.random();
    let level = 0;
    if (rand > 0.96) level = 4;
    else if (rand > 0.90) level = 3;
    else if (rand > 0.80) level = 2;
    else if (rand > 0.55) level = 1;

    cell.classList.add(`level-${level}`);
    if (level === 1) cell.style.color = '#0e4429';
    if (level === 2) cell.style.color = '#006d32';
    if (level === 3) cell.style.color = '#26a641';
    if (level === 4) cell.style.color = '#39d353';
    
    cell.title = 'Mock data (connecting to GitHub Matrix...)';
    grid.appendChild(cell);
  }
}

/* ============================================================
   PEER & MENTOR REFERRALS SLIDER
   ============================================================ */
function initReferralsSlider() {
  const track = document.getElementById('referralsTrack');
  if (!track) return;

  const cards = document.querySelectorAll('.referral-card');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  
  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;
  let isHovered = false;

  function goToSlide(index) {
    currentIndex = index;

    cards.forEach((card, i) => {
      card.classList.remove('active', 'prev-slide');
      dots[i].classList.remove('active');

      if (i === currentIndex) {
        card.classList.add('active');
        dots[i].classList.add('active');
      } else if (i < currentIndex) {
        card.classList.add('prev-slide');
      }
    });
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % cards.length;
    goToSlide(nextIdx);
  }

  function prevSlide() {
    const prevIdx = (currentIndex - 1 + cards.length) % cards.length;
    goToSlide(prevIdx);
  }

  // Navigation handlers
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      goToSlide(idx);
      resetAutoSlide();
    });
  });

  // Keyboard navigation
  const referralsSection = document.getElementById('referrals');
  document.addEventListener('keydown', (e) => {
    // Only trigger if referrals section is visible in view
    const rect = referralsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom >= 0;
    if (inView) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
      }
    }
  });

  // Auto slider loop
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 7000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Hover detection
  const sliderContainer = document.querySelector('.referrals-slider-container');
  sliderContainer.addEventListener('mouseenter', () => isHovered = true);
  sliderContainer.addEventListener('mouseleave', () => isHovered = false);

  startAutoSlide();
}
