<<<<<<< HEAD
const canvas = document.getElementById('bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  const pointer = { x: width / 2, y: height / 2, active: false };

  const nodes = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45
  }));

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;

      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (pointer.active && distance < 180) {
        node.vx += dx * 0.0004;
        node.vy += dy * 0.0004;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 + (140 - dist) / 280})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawBackground);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('pointermove', event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  window.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  resizeCanvas();
  drawBackground();
}

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const btn = document.getElementById('submit-btn');

if (form && status && btn) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Thanks! Your message has been sent.';
        status.className = 'status success';
        form.reset();
        btn.textContent = 'Message Sent!';
      } else {
        const result = await response.json();
        status.textContent = result.errors ? result.errors.map(error => error.message).join(', ') : 'Oops! There was a problem submitting your form.';
        status.className = 'status error';
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    } catch (error) {
      status.textContent = 'Oops! There was a problem submitting your form.';
      status.className = 'status error';
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}
=======
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const nodes = Array.from({ length: 85 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
    ctx.fill();
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 - dist / 150})`; 
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

// Keep your handleSubmit function here as it was!
>>>>>>> f018298fc62e812f9d4fa36d1f4979c72dde9dc0
