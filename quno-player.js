/* 群哦引擎卡片：不要把 theater/pixelactor 选项页挂出来。
   改挂 Drama Engine kiosk 成片，外面包剧哦那层哔哩播放壳。 */
(function () {
  const PLAY =
    "https://dannyling111.github.io/A129/drama/play.html?kiosk=1&src=warehouse/";
  const FALLBACK = {
    lecture: PLAY + "p-0049-teach.txt",
    theater: PLAY + "p-0337-teach.txt",
    pixel: PLAY + "p-0337-scene.txt",
    board: PLAY + "p-0193-teach.txt",
  };

  function rewrite(src) {
    const s = String(src || "");
    if (!s) return s;
    if (s.includes("kiosk=1") || s.includes("play.html")) return s;
    if (s.includes("theater/?list=canon50") || s.includes("theater?list=canon50"))
      return FALLBACK.lecture;
    if (/\/theater\/?(\?|#|$)/.test(s) && !s.includes("play.html"))
      return FALLBACK.theater;
    if (s.includes("/pixelactor")) return FALLBACK.pixel;
    return s;
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
    if (iframe.closest(".player-box")) return;

    const overlay = iframe.closest(".z-40");
    const box = document.createElement("div");
    box.className = "player-box quno-engine-player";
    const title =
      overlay && overlay.querySelector("header .truncate")
        ? overlay.querySelector("header .truncate").textContent.trim()
        : iframe.getAttribute("title") || "3D 引擎成片";
    box.dataset.title = title;

    const parent = iframe.parentElement;
    if (!parent) return;
    parent.insertBefore(box, iframe);
    box.appendChild(iframe);
    iframe.style.position = "relative";
    iframe.style.inset = "auto";
    iframe.style.width = "100%";
    iframe.style.height = "auto";
    iframe.style.aspectRatio = "16 / 9";
    iframe.style.pointerEvents = "none";

    if (overlay) {
      overlay.querySelectorAll('[data-quno="sound-gate"]').forEach(function (el) {
        el.remove();
      });
      parent.classList.add("quno-engine-stage");
    }
  }

  function scan() {
    document
      .querySelectorAll(
        "iframe[title='engine'], iframe[title='lector'], .z-40 iframe, iframe[src*='drama/play.html'], iframe[src*='theater'], iframe[src*='pixelactor']"
      )
      .forEach(wrap);
  }

  const obs = new MutationObserver(scan);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }
  setTimeout(scan, 400);
  setTimeout(scan, 1200);
})();
