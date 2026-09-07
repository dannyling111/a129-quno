/* 群哦不自做播放器。只把引擎 iframe 套进剧哦的 .player-box，
   控件/样式一律用剧哦的 player-bili.css + bili-player.js。 */
(function () {
  const DRAMA = "https://dannyling111.github.io/A129/drama/";
  const onPages = (() => {
    try { return /\.github\.io$/i.test(location.hostname); } catch (e) { return false; }
  })();
  const playBase = onPages ? DRAMA + "play.html" : "/drama-engine/play.html";
  const FALLBACK = {
    lecture: "p-0049-teach.txt",
    theater: "p-0337-teach.txt",
    pixel: "p-0337-scene.txt",
  };

  function playUrl(file) {
    return playBase + "?kiosk=1&src=warehouse/" + file;
  }

  function rewrite(src) {
    let s = String(src || "");
    if (!s) return s;
    if (!(s.includes("kiosk=1") || s.includes("play.html"))) {
      if (s.includes("theater/?list=canon50") || s.includes("theater?list=canon50"))
        s = playUrl(FALLBACK.lecture);
      else if (/\/theater\/?(\?|#|$)/.test(s) && !s.includes("play.html"))
        s = playUrl(FALLBACK.theater);
      else if (s.includes("/pixelactor"))
        s = playUrl(FALLBACK.pixel);
    }
    if (!onPages) s = s.replace(DRAMA + "play.html", "/drama-engine/play.html");
    return s;
  }

  function markCrossOrigin(iframe, box) {
    try {
      void iframe.contentWindow.document;
      box.classList.remove("quno-xorigin");
    } catch (e) {
      box.classList.add("quno-xorigin");
    }
  }

  function wrap(iframe) {
    if (!iframe || iframe.dataset.qunoBili === "1") return;
    const raw = iframe.getAttribute("src") || iframe.src || "";
    const next = rewrite(raw);
    if (next && next !== raw) {
      iframe.src = next;
      iframe.setAttribute("src", next);
    }
    iframe.dataset.qunoBili = "1";
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.setAttribute("allowfullscreen", "");

    let box = iframe.closest(".player-box");
    if (!box) {
      const overlay = iframe.closest(".z-40");
      box = document.createElement("div");
      box.className = "player-box";
      const titleEl = overlay && overlay.querySelector("header .truncate");
      box.dataset.title = titleEl ? titleEl.textContent.trim() : iframe.getAttribute("title") || "";
      const parent = iframe.parentElement;
      if (!parent) return;
      parent.insertBefore(box, iframe);
      box.appendChild(iframe);
      if (overlay) {
        overlay.querySelectorAll('[data-quno="sound-gate"]').forEach(function (el) { el.remove(); });
        parent.classList.add("quno-engine-stage");
      }
    }

    const onLoad = function () { markCrossOrigin(iframe, box); };
    iframe.addEventListener("load", onLoad);
    try { if (iframe.contentWindow) onLoad(); } catch (e) {}
  }

  function scan() {
    document
      .querySelectorAll(
        "iframe[title='engine'], iframe[title='lector'], .z-40 iframe, iframe[src*='drama/play.html'], iframe[src*='drama-engine/play.html'], iframe[src*='theater'], iframe[src*='pixelactor']"
      )
      .forEach(wrap);
  }

  const obs = new MutationObserver(scan);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
  setTimeout(scan, 400);
  setTimeout(scan, 1200);
})();
