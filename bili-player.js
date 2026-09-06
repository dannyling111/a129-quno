/* 剧哩哔哩播放壳。Drama Engine 只出画面，操作全在视频里。 */
(function () {
  const KEY_DM = "juli-bili-danmaku-v1";
  const KEY_ASPECT = "juli-bili-aspect-v1";
  const KEY_SKIN = "juli-bili-skin-v1";
  const STOCK = [
    "这就是实时演出来的？",
    "粉红进度条回来了",
    "快进看看下一句",
    "全屏看更清楚",
    "弹幕开着更有人气",
    "不是成片，是引擎当场演",
    "讲席这条可以多看一遍",
    "倍速 1.25 刚刚好",
    "人物库的人直接上场",
    "这条我收藏了"
  ];
  const ASPECTS = [
    { id: "wide", label: "横屏 16:9", ratio: "16 / 9" },
    { id: "tall", label: "竖屏 9:16", ratio: "9 / 16" },
    { id: "square", label: "方形 1:1", ratio: "1 / 1" }
  ];
  const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
  function clock(seconds) {
    const s = Math.max(0, Number(seconds) || 0);
    return Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  }
  function win(iframe) {
    try { return iframe && iframe.contentWindow; } catch (e) { return null; }
  }
  function loadMine() {
    try { return JSON.parse(localStorage.getItem(KEY_DM) || "[]"); } catch (e) { return []; }
  }
  function saveMine(list) {
    try { localStorage.setItem(KEY_DM, JSON.stringify(list.slice(-80))); } catch (e) {}
  }
  function loadAspect() {
    const v = localStorage.getItem(KEY_ASPECT);
    return ASPECTS.some((a) => a.id === v) ? v : "wide";
  }
  function loadSkin() {
    return localStorage.getItem(KEY_SKIN) === "yt" ? "yt" : "bili";
  }
  function hideEngine(iframe) {
    const w = win(iframe);
    if (!w) return;
    let doc;
    try { doc = w.document; } catch (e) { return; }
    if (!doc) return;
    let style = doc.getElementById("juli-embed-skin");
    if (!style) {
      style = doc.createElement("style");
      style.id = "juli-embed-skin";
      if (!doc.head) return;
      doc.head.appendChild(style);
    }
    style.textContent = "body.kiosk #side,body.kiosk #tl,body.kiosk #tlbar,body.kiosk #track,body.kiosk #kprog,body.kiosk #infobar,body.kiosk #prerolltip,body.kiosk #fps,body.kiosk #slate,body.kiosk #hud,body.kiosk #mutedbadge,body.kiosk #pbar,body.kiosk .quickbar,body.kiosk #tabs,body.kiosk .tabs{display:none!important}body.kiosk #app{display:block!important}body.kiosk #main,body.kiosk #stagewrap,body.kiosk #frame{inset:0;width:100%!important;height:100%!important;max-width:none!important;box-shadow:none!important;padding:0!important}body.kiosk .bub .who,body.kiosk .castchip,body.kiosk .nameplate{display:none!important}";
    try { doc.body.classList.add("kiosk", "embed"); } catch (e) {}
  }
  function ensureShell(box) {
    const leftover = box.nextElementSibling;
    if (leftover && leftover.classList.contains("bili-dock")) leftover.remove();
    let shell = box.querySelector(".bili-shell");
    if (shell) shell.remove();
    shell = document.createElement("div");
    shell.className = "bili-shell";
    shell.innerHTML = [
      '<div class="bili-hit" data-bili-hit></div>',
      '<div class="bili-danmaku" data-bili-danmaku aria-hidden="true"></div>',
      '<div class="bili-boost" data-bili-boost hidden>2.0×</div>',
      '<button type="button" class="bili-center" data-bili-center aria-label="播放"></button>',
      '<div class="bili-chrome" data-bili-chrome>',
      '  <div class="bili-top" data-bili-title>剧哩</div>',
      '  <div class="bili-ctrl">',
      '    <div class="bili-progress" data-bili-bar role="slider" aria-label="进度"><span class="bili-fill" data-bili-fill></span><i class="bili-knob" data-bili-knob></i></div>',
      '    <div class="bili-row">',
      '      <button type="button" class="bili-ico" data-bili-play title="播放/暂停">▶</button>',
      '      <div class="bili-time"><span data-bili-now>0:00</span><i>/</i><span data-bili-dur>0:00</span></div>',
      '      <form class="bili-send" data-bili-form><input maxlength="24" placeholder="发个弹幕吧" data-bili-input autocomplete="off"><button type="submit">发送</button></form>',
      '      <button type="button" class="bili-ico on" data-bili-dm title="弹幕">弹</button>',
      '      <div class="bili-popwrap">',
      '        <button type="button" class="bili-ico" data-bili-speed-btn title="倍速">倍速</button>',
      '        <div class="bili-pop" data-bili-speed-pop>' + SPEEDS.map((s) => '<button type="button" data-speed="' + s + '">' + s + "×</button>").join("") + "</div>",
      "      </div>",
      '      <div class="bili-popwrap">',
      '        <button type="button" class="bili-ico" data-bili-aspect-btn title="画幅">画幅</button>',
      '        <div class="bili-pop" data-bili-aspect-pop>' + ASPECTS.map((a) => '<button type="button" data-aspect="' + a.id + '">' + a.label + "</button>").join("") + "</div>",
      "      </div>",
      '      <button type="button" class="bili-ico" data-bili-full title="全屏">全屏</button>',
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
    box.appendChild(shell);
    const gate = box.querySelector(".sndgate");
    if (gate) gate.remove();
    return shell;
  }
  function hashHue(text) {
    let n = 0;
    for (let i = 0; i < text.length; i++) n = (n * 33 + text.charCodeAt(i)) >>> 0;
    return 320 + (n % 40);
  }
  function spawnDanmaku(layer, text, mine) {
    if (!layer || !text) return;
    const el = document.createElement("span");
    el.className = "bili-fly" + (mine ? " mine" : "");
    el.textContent = text;
    el.style.top = 8 + Math.floor(Math.random() * 58) + "%";
    const fly = 7 + Math.random() * 5;
    el.style.animationDuration = fly + "s";
    if (!mine) el.style.color = "hsl(" + hashHue(text) + " 80% 82%)";
    layer.appendChild(el);
    setTimeout(() => el.remove(), fly * 1000 + 80);
  }
  function applyAspect(box, iframe, id) {
    const spec = ASPECTS.find((a) => a.id === id) || ASPECTS[0];
    box.dataset.aspect = spec.id;
    box.style.setProperty("--bili-ratio", spec.ratio);
    if (iframe) iframe.style.aspectRatio = spec.ratio.replace(/\s+/g, "");
    try { localStorage.setItem(KEY_ASPECT, spec.id); } catch (e) {}
    box.querySelectorAll("[data-aspect]").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.aspect === spec.id);
    });
  }
  function applySkin(box, skin) {
    box.dataset.skin = skin;
    try { localStorage.setItem(KEY_SKIN, skin); } catch (e) {}
  }
  function bind(iframe) {
    if (!iframe || iframe.dataset.biliBound === "7") return;
    iframe.dataset.biliBound = "7";
    const box = iframe.closest(".player-box");
    if (!box) return;
    box.tabIndex = 0;
    const shell = ensureShell(box);
    const playBtn = shell.querySelector("[data-bili-play]");
    const centerBtn = shell.querySelector("[data-bili-center]");
    const track = shell.querySelector("[data-bili-bar]");
    const fill = shell.querySelector("[data-bili-fill]");
    const knob = shell.querySelector("[data-bili-knob]");
    const nowEl = shell.querySelector("[data-bili-now]");
    const durEl = shell.querySelector("[data-bili-dur]");
    const fullBtn = shell.querySelector("[data-bili-full]");
    const dmBtn = shell.querySelector("[data-bili-dm]");
    const form = shell.querySelector("[data-bili-form]");
    const input = shell.querySelector("[data-bili-input]");
    const layer = shell.querySelector("[data-bili-danmaku]");
    const titleEl = shell.querySelector("[data-bili-title]");
    const hit = shell.querySelector("[data-bili-hit]");
    const boost = shell.querySelector("[data-bili-boost]");
    const speedBtn = shell.querySelector("[data-bili-speed-btn]");
    const speedPop = shell.querySelector("[data-bili-speed-pop]");
    const aspectBtn = shell.querySelector("[data-bili-aspect-btn]");
    const aspectPop = shell.querySelector("[data-bili-aspect-pop]");
    let dur = 0, dragging = false, dmOn = true, lastTick = -1, speed = 1;
    let holdTimer = 0, holding = false, holdSpeed = 1, holdMoved = false;
    let holdX = 0, holdY = 0, hideTimer = 0;
    const pageTitle = document.querySelector(".watch-title");
    if (titleEl && pageTitle) titleEl.textContent = pageTitle.textContent.trim();
    applyAspect(box, iframe, loadAspect());
    applySkin(box, loadSkin());
    box.classList.add("is-paused", "show-chrome");
    function api() {
      const w = win(iframe);
      return w && w.DRAMA ? w : null;
    }
    function info() {
      try { return api().DRAMA.info() || {}; } catch (e) { return {}; }
    }
    function now() {
      try { return Number(api().t) || 0; } catch (e) { return 0; }
    }
    function playing() {
      try { return !!api().playing; } catch (e) { return false; }
    }
    function arm() {
      const w = win(iframe);
      try { w.__armAudio && w.__armAudio(); } catch (e) {}
      try { w.snd && w.snd.enable && w.snd.enable(); } catch (e) {}
      try { w.DramaSound && w.DramaSound.enable && w.DramaSound.enable(); } catch (e) {}
    }
    function closePops() {
      speedPop.classList.remove("open");
      aspectPop.classList.remove("open");
    }
    function showChrome() {
      box.classList.add("show-chrome");
      clearTimeout(hideTimer);
      if (playing()) {
        hideTimer = setTimeout(() => {
          if (!dragging && !holding) box.classList.remove("show-chrome");
        }, 2400);
      }
    }
    function setSpeed(v) {
      const w = api() || win(iframe);
      const n = Number(v) || 1;
      speed = n;
      speedBtn.textContent = n === 1 ? "倍速" : n + "×";
      speedPop.querySelectorAll("[data-speed]").forEach((btn) => {
        btn.classList.toggle("on", Number(btn.dataset.speed) === n);
      });
      try { w.setSpeed(n); } catch (e) {
        try { w.speed = n; if (w.snd) w.snd.speed = n; } catch (err) {}
      }
    }
    function setPlaying(on) {
      const w = api();
      arm();
      if (w) {
        try { w.DRAMA.play(!!on); } catch (e) {}
        try { w.playing = !!on; } catch (e) {}
      }
      box.classList.toggle("is-paused", !on);
      if (on) showChrome();
      else {
        box.classList.add("show-chrome");
        clearTimeout(hideTimer);
      }
      try { box.blur(); } catch (e) {}
      paint();
    }
    function jump(to) {
      const w = api();
      const length = dur || info().dur || 0;
      const next = Math.max(0, Math.min(length || to, to));
      arm();
      if (!w) return;
      try {
        if (w.DRAMA.frameAt) w.DRAMA.frameAt(next);
        else { w.DRAMA.seek(next); w.DRAMA.step && w.DRAMA.step(); }
      } catch (e) {
        try { w.t = next; } catch (err) {}
      }
      paint();
    }
    function pool() {
      const out = STOCK.slice();
      try {
        const data = info();
        [data.lines, data.subs, data.shots, data.script].forEach((bag) => {
          if (!Array.isArray(bag)) return;
          bag.forEach((item) => {
            const text = typeof item === "string" ? item : item && (item.line || item.text || item.say || item.title);
            if (text && String(text).trim().length > 1) out.push(String(text).trim().slice(0, 24));
          });
        });
      } catch (e) {}
      loadMine().forEach((x) => { if (x && x.text) out.push(x.text); });
      return out;
    }
    function paint() {
      const data = info();
      if (data.dur) dur = data.dur;
      const t = now();
      if (nowEl) nowEl.textContent = clock(t);
      if (durEl) durEl.textContent = clock(dur);
      const pct = dur ? Math.min(100, (t / dur) * 100) : 0;
      if (fill && !dragging) fill.style.width = pct + "%";
      if (knob && !dragging) knob.style.left = pct + "%";
      const on = playing();
      if (playBtn) playBtn.textContent = on ? "Ⅱ" : "▶";
      box.classList.toggle("is-paused", !on);
      hideEngine(iframe);
      if (dmOn && on && box.dataset.skin !== "yt") {
        const sec = Math.floor(t);
        if (sec !== lastTick) {
          lastTick = sec;
          loadMine().filter((x) => Math.floor(x.at) === sec).forEach((x) => spawnDanmaku(layer, x.text, true));
          if (sec % 3 === 0 || Math.random() < 0.32) {
            const list = pool();
            spawnDanmaku(layer, list[Math.floor(Math.random() * list.length)], false);
          }
        }
      }
    }
    function clientX(ev) {
      if (ev.clientX != null) return ev.clientX;
      if (ev.touches && ev.touches[0]) return ev.touches[0].clientX;
      if (ev.changedTouches && ev.changedTouches[0]) return ev.changedTouches[0].clientX;
      return 0;
    }
    function seekFromEvent(ev) {
      const length = dur || info().dur || 0;
      if (!length || !track) return;
      const r = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX(ev) - r.left) / r.width));
      fill.style.width = x * 100 + "%";
      knob.style.left = x * 100 + "%";
      jump(x * length);
    }
    playBtn.onclick = (ev) => { ev.stopPropagation(); setPlaying(!playing()); };
    centerBtn.onclick = (ev) => { ev.stopPropagation(); setPlaying(!playing()); };
    fullBtn.onclick = (ev) => {
      ev.stopPropagation();
      if (!document.fullscreenElement) box.requestFullscreen && box.requestFullscreen();
      else document.exitFullscreen && document.exitFullscreen();
    };
    dmBtn.onclick = (ev) => {
      ev.stopPropagation();
      dmOn = !dmOn;
      dmBtn.classList.toggle("on", dmOn);
      layer.style.display = dmOn && box.dataset.skin !== "yt" ? "" : "none";
    };
    speedBtn.onclick = (ev) => {
      ev.stopPropagation();
      aspectPop.classList.remove("open");
      speedPop.classList.toggle("open");
    };
    aspectBtn.onclick = (ev) => {
      ev.stopPropagation();
      speedPop.classList.remove("open");
      aspectPop.classList.toggle("open");
    };
    speedPop.onclick = (ev) => {
      const btn = ev.target.closest("[data-speed]");
      if (!btn) return;
      setSpeed(btn.dataset.speed);
      speedPop.classList.remove("open");
    };
    aspectPop.onclick = (ev) => {
      const btn = ev.target.closest("[data-aspect]");
      if (!btn) return;
      applyAspect(box, iframe, btn.dataset.aspect);
      aspectPop.classList.remove("open");
    };
    form.onsubmit = (ev) => {
      ev.preventDefault();
      const text = String(input.value || "").trim().slice(0, 24);
      if (!text) return;
      saveMine(loadMine().concat({ text: text, at: now(), t: Date.now() }));
      spawnDanmaku(layer, text, true);
      input.value = "";
    };
    form.addEventListener("pointerdown", (ev) => ev.stopPropagation());
    function onTrackDown(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      dragging = true;
      track.classList.add("is-drag");
      if (track.setPointerCapture && ev.pointerId != null) {
        try { track.setPointerCapture(ev.pointerId); } catch (e) {}
      }
      seekFromEvent(ev);
      showChrome();
    }
    function onTrackMove(ev) {
      if (!dragging) return;
      ev.preventDefault();
      seekFromEvent(ev);
    }
    function onTrackUp(ev) {
      if (!dragging) return;
      ev.preventDefault();
      seekFromEvent(ev);
      dragging = false;
      track.classList.remove("is-drag");
      showChrome();
    }
    track.addEventListener("pointerdown", onTrackDown);
    track.addEventListener("pointermove", onTrackMove);
    track.addEventListener("pointerup", onTrackUp);
    track.addEventListener("pointercancel", () => { dragging = false; track.classList.remove("is-drag"); });
    track.addEventListener("touchstart", onTrackDown, { passive: false });
    track.addEventListener("touchmove", onTrackMove, { passive: false });
    track.addEventListener("touchend", onTrackUp, { passive: false });
    hit.addEventListener("pointerdown", (ev) => {
      arm();
      closePops();
      holdMoved = false;
      holdX = ev.clientX;
      holdY = ev.clientY;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        holding = true;
        holdSpeed = speed;
        setSpeed(2);
        if (boost) boost.hidden = false;
        if (!playing()) setPlaying(true);
      }, 380);
    });
    hit.addEventListener("pointermove", (ev) => {
      if (Math.abs(ev.clientX - holdX) > 12 || Math.abs(ev.clientY - holdY) > 12) holdMoved = true;
    });
    hit.addEventListener("pointerup", () => {
      clearTimeout(holdTimer);
      if (holding) {
        holding = false;
        setSpeed(holdSpeed);
        if (boost) boost.hidden = true;
      } else if (!holdMoved) {
        setPlaying(!playing());
      }
      showChrome();
    });
    hit.addEventListener("pointercancel", () => {
      clearTimeout(holdTimer);
      if (holding) {
        holding = false;
        setSpeed(holdSpeed);
        if (boost) boost.hidden = true;
      }
    });
    box.addEventListener("pointermove", showChrome);
    box.addEventListener("click", (ev) => {
      if (!ev.target.closest(".bili-popwrap")) closePops();
    });
    box.addEventListener("dblclick", (ev) => {
      if (ev.target.closest(".bili-ctrl")) return;
      fullBtn.click();
    });
    box.addEventListener("keydown", (ev) => {
      if (ev.target.closest("input,select,textarea")) return;
      if (ev.code === "Space") { ev.preventDefault(); setPlaying(!playing()); }
      if (ev.code === "ArrowLeft") jump(now() - 10);
      if (ev.code === "ArrowRight") jump(now() + 10);
      if (ev.key === "f" || ev.key === "F") fullBtn.click();
      if (ev.key === "d" || ev.key === "D") dmBtn.click();
    });
    iframe.addEventListener("load", () => { hideEngine(iframe); paint(); });
    setSpeed(1);
    setInterval(paint, 250);
    paint();
  }
  function scan() {
    document.querySelectorAll(".bili-dock").forEach((el) => el.remove());
    document.querySelectorAll(".player-box iframe").forEach(bind);
  }
  const root = document.getElementById("main") || document.getElementById("app") || document.documentElement;
  if (root) new MutationObserver(scan).observe(root, { childList: true, subtree: true });
  scan();
})();
