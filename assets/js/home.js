// Homepage behaviour for _layouts/home.liquid: lattice hero (Babai rounding), typed tagline,
// nav scroll-spy, BibTeX toggles, email copy. Theme switching itself is al_folio_core's theme.js.
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav: highlight the link for the section in view
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".vk-nav-links a"));
  var targets = navLinks.map(function (a) {
    return document.getElementById(a.getAttribute("href").slice(1));
  });
  function spy() {
    var y = window.scrollY + 120,
      cur = 0,
      best = -Infinity;
    targets.forEach(function (t, i) {
      if (!t) return;
      var top = t.getBoundingClientRect().top + window.scrollY;
      if (top <= y && top > best) {
        best = top;
        cur = i;
      }
    });
    // the last section is too short to reach the top; light it up once the page bottom is reached
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) cur = navLinks.length - 1;
    // fade the fixed b1/b2 glyph near the footer so it never sits on top of the credits
    document.body.classList.toggle("vk-near-bottom", window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160);
    navLinks.forEach(function (a, i) {
      a.classList.toggle("active", i === cur);
    });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // BibTeX toggles
  document.querySelectorAll("[data-vk-bib]").forEach(function (b) {
    b.addEventListener("click", function () {
      var el = document.getElementById(b.getAttribute("data-vk-bib"));
      if (!el) return;
      var open = el.classList.toggle("open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // email copy (address assembled at runtime so it is not in the HTML for scrapers)
  var copyBtn = document.getElementById("vk-copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var addr = copyBtn.getAttribute("data-u") + "@" + copyBtn.getAttribute("data-d");
      var done = function () {
        copyBtn.textContent = "Copied";
        setTimeout(function () {
          copyBtn.textContent = "Copy";
        }, 1500);
      };
      var fallback = function () {
        var shown = document.getElementById("vk-email-text");
        shown.textContent = addr;
        var r = document.createRange();
        r.selectNodeContents(shown);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      };
      try {
        navigator.clipboard.writeText(addr).then(done, fallback);
      } catch (e) {
        fallback();
      }
    });
  }

  // typed tagline
  var el = document.getElementById("vk-typed");
  if (el) {
    var phrases = [];
    try {
      phrases = JSON.parse(el.getAttribute("data-phrases") || "[]");
    } catch (e) {}
    if (!phrases.length) phrases = [el.textContent];
    if (reduce) {
      el.textContent = phrases.join(" · ");
    } else {
      var pi = 0,
        ci = 0,
        del = false;
      (function tick() {
        var p = phrases[pi];
        ci += del ? -1 : 1;
        el.textContent = p.slice(0, ci);
        var wait = del ? 35 : 70;
        if (!del && ci === p.length) {
          del = true;
          wait = 1600;
        } else if (del && ci === 0) {
          del = false;
          pi = (pi + 1) % phrases.length;
          wait = 300;
        }
        setTimeout(tick, wait);
      })();
    }
  }

  // E: interactive lattice with Babai rounding
  var cv = document.getElementById("vk-lattice");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var W = 0,
    H = 0,
    dpr = 1,
    col = {};
  var b1 = { x: 64, y: 0 },
    b2 = { x: 24, y: 54 };
  var det = b1.x * b2.y - b2.x * b1.y;
  var mouse = null,
    t0 = performance.now();

  function readColors() {
    var cs = getComputedStyle(root);
    col.accent = cs.getPropertyValue("--vk-accent").trim() || "#1d6b74";
    col.muted = cs.getPropertyValue("--vk-muted").trim() || "#5a6173";
    if (reduce) draw(0);
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) draw(0);
  }
  function toBasis(px, py, ox, oy) {
    var x = px - ox,
      y = py - oy;
    return { a: (x * b2.y - y * b2.x) / det, b: (b1.x * y - b1.y * x) / det };
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var ox = (t * 0.008) % b1.x,
      oy = (t * 0.004) % b2.y;
    var rows = Math.ceil(H / b2.y) + 3,
      cols = Math.ceil(W / b1.x) + 4;
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = col.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var j = -2; j < rows; j++) {
      var y = oy + j * b2.y,
        sx = ox + j * b2.x;
      ctx.moveTo(sx - cols * b1.x, y);
      ctx.lineTo(sx + cols * b1.x, y);
    }
    for (var i = -rows; i < cols; i++) {
      var x0 = ox + i * b1.x;
      ctx.moveTo(x0 - 2 * b2.x, oy - 2 * b2.y);
      ctx.lineTo(x0 + rows * b2.x, oy + rows * b2.y);
    }
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = col.accent;
    for (var j2 = -2; j2 < rows; j2++) {
      for (var i2 = -rows; i2 < cols; i2++) {
        var px = ox + i2 * b1.x + j2 * b2.x,
          py = oy + j2 * b2.y;
        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) continue;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, 6.283);
        ctx.fill();
      }
    }
    if (mouse) {
      var c = toBasis(mouse.x, mouse.y, ox, oy);
      var a = Math.round(c.a),
        b = Math.round(c.b);
      var vx = ox + a * b1.x + b * b2.x,
        vy = oy + b * b2.y;
      var fa = Math.floor(c.a),
        fb = Math.floor(c.b);
      var qx = ox + fa * b1.x + fb * b2.x,
        qy = oy + fb * b2.y;
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.moveTo(qx, qy);
      ctx.lineTo(qx + b1.x, qy + b1.y);
      ctx.lineTo(qx + b1.x + b2.x, qy + b1.y + b2.y);
      ctx.lineTo(qx + b2.x, qy + b2.y);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = col.accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(vx, vy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(vx, vy, 5, 0, 6.283);
      ctx.fillStyle = col.accent;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.5, 0, 6.283);
      ctx.strokeStyle = col.muted;
      ctx.stroke();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = col.muted;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText("t", mouse.x + 7, mouse.y - 6);
      ctx.fillText("v = " + a + "·b₁ + " + b + "·b₂", vx + 8, vy + 14);
    }
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    draw(now - t0);
    requestAnimationFrame(loop);
  }
  window.addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect();
    var x = e.clientX - r.left,
      y = e.clientY - r.top;
    mouse = x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x: x, y: y } : null;
    if (reduce) draw(0);
  });
  document.addEventListener("pointerleave", function () {
    mouse = null;
    if (reduce) draw(0);
  });
  // theme.js flips data-theme on <html>; re-read the palette when it does
  new MutationObserver(readColors).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", resize);
  readColors();
  resize();
  if (!reduce) requestAnimationFrame(loop);
  else draw(0);
})();
