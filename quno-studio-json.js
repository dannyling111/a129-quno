/* 群哦 · JSON 组题 overlay
 * 不替换现有 SPA。只修：复制提示词（读 DOM、不再「先写主题」）、输出改 JSON、粘贴 JSON 生成群。
 * v=20260907-json
 */
(function () {
  if (window.__QUNO_JSON_OVERLAY__) return;
  window.__QUNO_JSON_OVERLAY__ = 1;

  var NICK = {"全动画派":"p-0007","最小干预派":"p-0126","精益派":"p-0017","结构派":"p-0663","自然派":"p-0027","自然光派":"p-0040","资本配置派":"p-0056","指数纪律派":"p-0058","刻意练习派":"p-0090","工具派":"p-0092","弹性设计派":"p-0122","视觉舒适派":"p-0127","数据契约派":"p-0143","限制动画派":"p-0151","风味化学派":"p-0601","性能派":"p-0176","输出派":"p-0232","市场派":"p-0251","工匠派":"p-0274","社群叙事派":"p-0303","现金流派":"p-0309","能力派":"p-0312","机器学习派":"p-0339","配方派":"p-0458","报表痕迹派":"p-0489","能量平衡派":"p-0498","剪辑构成派":"p-0613","视觉开发派":"p-0622","战略稀缺派":"p-0632","公共说理派":"p-0814","行为派":"p-0841","舒适实证派":"p-0849","核桃油不黄":"p-0001","唐望舒":"p-0002","Nikolai":"p-0003","Elias":"p-0004","Nadia":"p-0005","江知野":"p-0006","苏星禾":"p-0007","Amara":"p-0008","裴澜":"p-0009","柳未晞":"p-0010","洱海边的人":"p-1001","白石不说谎":"p-1002","伞先走":"p-1003","清和车票":"p-1004","不听完整的歌":"p-1005","充电器自备":"p-1006","代理声明书":"p-0801","眩光超过19":"p-0127","先别看p值":"p-0205","1到4kHz让路":"p-0392","期限溢价":"p-0618","先分母后分子":"p-0744","叶屿":"p-0337","商未晞":"p-0193","Zara Rahman":"p-0049","裴三省":"p-0484","白屿":"p-0340","Sofia Bergström":"p-0194","Rafael Ivanov":"p-0343","商秋池":"p-0054","Zara Moreau":"p-0060","宋素心":"p-0058"};
  var NAME = {"苏星禾":"p-0007","谢昭":"p-0011","叶知白":"p-0017","Elias Lindqvist":"p-0019","唐令仪":"p-0027","Rafael Haddad":"p-0040","Amara Ferreira":"p-0056","宋素心":"p-0058","侯未晞":"p-0090","施昭华":"p-0092","Milo Rahman":"p-0122","温拾玉":"p-0126","顾长庚":"p-0127","Iris Marchetti":"p-0143","Ivo Bergström":"p-0151","Noor Tanaka":"p-0169","裴知白":"p-0176","江昭华":"p-0232","Mira Okafor":"p-0251","Kai Rahman":"p-0274","Ada Lindqvist":"p-0303","叶语迟":"p-0309","阮见微":"p-0312","林觅":"p-0339","祁疏桐":"p-0458","樊未晞":"p-0489","Ada Tanaka":"p-0498","柳与之":"p-0601","Zara Marchetti":"p-0613","卫川":"p-0622","Theo Nakamura":"p-0632","薛见微":"p-0663","樊澈":"p-0814","叶秋池":"p-0841","温知白":"p-0849","Rina Lindqvist":"p-0001","唐望舒":"p-0002","Nikolai Marchetti":"p-0003","Elias Tanaka":"p-0004","Nadia Osei":"p-0005","江知野":"p-0006","Amara Vargas":"p-0008","裴澜":"p-0009","柳未晞":"p-0010","路洱海":"p-1001","于白石":"p-1002","刁艳":"p-1003","韦清和":"p-1004","Stella Hernandez":"p-1005","潘泽":"p-1006","应见微":"p-0801","沈知白":"p-0205","顾星禾":"p-0392","韩听澜":"p-0618","岑知行":"p-0744","叶屿":"p-0337","商未晞":"p-0193","Zara Rahman":"p-0049","裴三省":"p-0484","白屿":"p-0340","Sofia Bergström":"p-0194","Rafael Ivanov":"p-0343","商秋池":"p-0054","Zara Moreau":"p-0060"};

  var JSON_SPEC =
    "【输出格式 · 必须遵守】\n" +
    "只输出一个 JSON 对象。不要前言、不要作者按、不要 Markdown 代码块、不要“以上是讨论”。\n" +
    "从 { 开始，到配对的 } 结束。\n\n" +
    "形状：\n" +
    "{\n" +
    '  "name": "不超过8个字的群名",\n' +
    '  "notice": "一句群规",\n' +
    '  "messages": [\n' +
    '    { "nick": "名单里的昵称", "text": "内容，可多行，可含 Markdown 表" }\n' +
    "  ]\n" +
    "}\n\n" +
    "字段只能用 name / notice / messages / nick / text。\n" +
    "需要 @ 时写成 @昵称。\n" +
    "需要对照就把 Markdown 表写进对应那条的 text。\n" +
    "需要成篇写「[公众号] 标题」再跟不超过 6 句正文。\n" +
    "需要黑板写「[黑板]」然后几行先验 / 变量。\n\n" +
    "【禁止】\n" +
    "1. 不要视频、mp4、分镜、拍摄词、3D 引擎、引擎现场、语音条、波形。\n" +
    "2. 字必须写出来。这一场只有文本。\n" +
    "3. 不要给名单以外的人发言，不要写「主持人」「系统旁白」。\n" +
    "4. 后一个人必须接前一个人的点；先 @ 再表态。";

  var HARD =
    "【硬约束】\n" +
    "1. 按时间顺序写一场群聊。每人至少一条。\n" +
    "2. 路径可以改，口径必须写明。\n" +
    "3. 不要输出 JSON 以外的任何说明。";

  var SAMPLE =
    '{\n' +
    '  "name": "仓位夜话",\n' +
    '  "notice": "只谈机制。没有一级源，先别发言。",\n' +
    '  "messages": [\n' +
    '    { "nick": "代理声明书", "text": "先标来源。谁考核、谁改口径，比标题重要。" },\n' +
    '    { "nick": "期限溢价", "text": "@代理声明书 同意。先把实际利率和期限溢价分开。" },\n' +
    '    { "nick": "先分母后分子", "text": "@期限溢价 分母这边：黄金吨数没跟上金额，先问库存能不能撑住叙事。" },\n' +
    '    { "nick": "白石不说谎", "text": "这事最后还是成本。图纸没动、验收动了，报价就是假的。" },\n' +
    '    { "nick": "期限溢价", "text": "| 口径 | 谁说 | 最核心一句 |\\n| --- | --- | --- |\\n| 声明措辞 | 代理声明书 | 改口径比改标题重要 | FOMC |" }\n' +
    "  ]\n" +
    "}";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function topicEl() {
    return $('textarea[data-quno="brief-topic"]');
  }
  function textEl() {
    return $('[data-quno="brief-text"]');
  }
  function copyBtns() {
    return document.querySelectorAll('[data-quno="brief-copy"]');
  }
  function topicValue() {
    var el = topicEl();
    return el ? String(el.value || "").trim() : "";
  }

  function rewritePrompt(raw, topic) {
    var t = String(raw || "");
    var top = (topic || "").trim();
    if (top) {
      t = t.replace(/【主题】\n[^\n]*/, "【主题】\n" + top);
      t = t.replace(/（先写主题）/g, top);
    }
    t = t.replace(
      /你现在要写一场「群哦」微信群讨论，不是一篇作文，不是旁白，不是纯语音。直接输出群聊脚本，不要先解释你要做什么。/,
      "你现在要写一场「群哦」微信群讨论，不是一篇作文，不是旁白，不是视频脚本，不是 3D 短剧。直接输出 JSON，不要先解释你要做什么。"
    );
    t = t.replace(
      /【允许的回答格式】只能用下面这些，不要发明别的体裁。/,
      "【允许的回答格式】只能用下面这些文本体裁，不要发明别的，尤其不要发明视频或引擎。"
    );
    t = t.replace(/^- .*?(3D|引擎现场).*$\n?/gm, "");
    if (/【输出格式】/.test(t)) {
      t = t.replace(/【输出格式】[\s\S]*?(?=\n【硬约束】|$)/, JSON_SPEC + "\n\n");
    }
    if (/【硬约束】/.test(t)) {
      t = t.replace(/【硬约束】[\s\S]*$/, HARD);
    }
    return t;
  }

  function copyTextSync(text) {
    var node = document.createElement("textarea");
    node.value = text;
    node.setAttribute("readonly", "");
    node.style.cssText =
      "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0";
    document.body.appendChild(node);
    node.focus();
    node.select();
    node.setSelectionRange(0, text.length);
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(node);
    return ok;
  }

  function currentPrompt() {
    var pre = textEl();
    var raw = pre ? pre.textContent || "" : "";
    return rewritePrompt(raw, topicValue());
  }

  function markCopied(ok) {
    copyBtns().forEach(function (btn) {
      btn.disabled = false;
      btn.removeAttribute("disabled");
      btn.className = "flex h-11 w-full items-center justify-center gap-2 rounded-md text-[15px] font-medium bg-wx-green text-white";
      btn.style.background = "#07c160";
      btn.style.color = "#fff";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      btn.style.cursor = "pointer";
      var label = ok ? "已复制" : "一键复制提示词";
      // keep icon if present; replace text nodes
      var texts = [];
      btn.childNodes.forEach(function (n) {
        if (n.nodeType === 3) texts.push(n);
      });
      if (texts.length) texts[texts.length - 1].textContent = label;
      else btn.appendChild(document.createTextNode(label));
    });
    var extra = document.getElementById("quno-json-copy");
    if (extra) extra.textContent = ok ? "已复制提示词" : "一键复制提示词";
    var hint = document.getElementById("quno-json-copy-hint");
    if (hint) {
      hint.textContent = ok
        ? "已复制。去外面的 AI 生成 JSON，再粘回下面。"
        : topicValue()
        ? "任务已写入，提示词已跟着改。点复制拿去外面生成。"
        : "写完即可复制。这里不接模型，不是在这里新建群。";
    }
  }

  function doCopy() {
    var typed = topicValue();
    var ta = topicEl();
    if (!typed) {
      if (ta) ta.focus();
      var hint = document.getElementById("quno-json-copy-hint");
      if (hint) hint.textContent = "先在上面写下你要讨论的任务";
      return;
    }
    if (ta) {
      try {
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e) {}
    }
    var text = currentPrompt();
    var ok = copyTextSync(text);
    if (!ok) {
      var pre = textEl();
      if (pre) {
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      markCopied(false);
      var hint = document.getElementById("quno-json-copy-hint");
      if (hint) hint.textContent = "已帮你选中提示词，按 Ctrl+C 或 ⌘C 复制。";
      return;
    }
    markCopied(true);
    setTimeout(function () {
      markCopied(false);
    }, 1800);
  }

  function ungateCopy() {
    copyBtns().forEach(function (btn) {
      btn.disabled = false;
      btn.removeAttribute("disabled");
      btn.style.background = "#07c160";
      btn.style.color = "#fff";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      btn.style.cursor = "pointer";
      if (/先写主题/.test(btn.textContent || "")) {
        btn.childNodes.forEach(function (n) {
          if (n.nodeType === 3 && /先写主题|复制提示词|已复制/.test(n.textContent || "")) {
            n.textContent = "一键复制提示词";
          }
        });
      }
    });
  }

  function patchPreview() {
    var pre = textEl();
    if (!pre) return;
    var next = rewritePrompt(pre.textContent || "", topicValue());
    if (pre.textContent !== next) pre.textContent = next;
  }

  function ensureTopicCopy() {
    var ta = topicEl();
    if (!ta || document.getElementById("quno-json-copy")) return;
    var wrap = document.createElement("div");
    wrap.id = "quno-json-copy-wrap";
    wrap.style.cssText = "margin-top:12px";
    var btn = document.createElement("button");
    btn.id = "quno-json-copy";
    btn.type = "button";
    btn.textContent = "一键复制提示词";
    btn.style.cssText =
      "display:flex;align-items:center;justify-content:center;width:100%;height:48px;border:0;border-radius:8px;background:#07c160;color:#fff;font-size:15px;font-weight:500;cursor:pointer";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      doCopy();
    });
    var hint = document.createElement("p");
    hint.id = "quno-json-copy-hint";
    hint.style.cssText = "margin:8px 0 0;font-size:12px;line-height:1.5;color:#576b95";
    hint.textContent = "写完即可复制。这里不接模型，把提示词拿到外面生成 JSON，再粘回来。";
    wrap.appendChild(btn);
    wrap.appendChild(hint);
    ta.insertAdjacentElement("afterend", wrap);
  }

  function ensurePastePanel() {
    if (document.getElementById("quno-json-paste")) return;
    var pre = textEl();
    if (!pre) return;
    var col = pre.parentElement;
    if (!col) return;
    var card = document.createElement("div");
    card.id = "quno-json-paste";
    card.style.cssText =
      "margin-top:12px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #ececec";
    card.innerHTML =
      '<div style="padding:12px 16px;border-bottom:1px solid #ececec">' +
      '<div style="font-size:14px;font-weight:500">② 外面生成完，粘贴回来</div>' +
      '<div style="font-size:11px;color:#8a8a8a;margin-top:2px">只认 JSON。从 { 到配对的 } 自动截取。不是在上面新建群。</div>' +
      "</div>" +
      '<details style="padding:8px 16px;border-bottom:1px solid #ececec">' +
      '<summary style="cursor:pointer;color:#576b95;font-size:13px">JSON 格式说明</summary>' +
      '<pre style="margin:8px 0 0;padding:10px;background:#ededed;border-radius:8px;font-size:12px;white-space:pre-wrap">' +
      '{\n  "name": "短名",\n  "notice": "一句群规",\n  "messages": [\n    { "nick": "昵称", "text": "内容，可多行" }\n  ]\n}' +
      "</pre></details>" +
      '<textarea id="quno-json-paste-ta" rows="8" placeholder="把外面 AI 生成的 JSON 整段贴这里…&#10;系统会从第一个 { 读到配对的 }" ' +
      'style="display:block;width:100%;min-height:140px;border:0;padding:12px 16px;font-size:13px;line-height:1.6;outline:none;resize:vertical;box-sizing:border-box"></textarea>' +
      '<div id="quno-json-paste-meta" style="display:none;padding:8px 16px;font-size:12px;color:#8a8a8a;border-top:1px solid #ececec"></div>' +
      '<div id="quno-json-paste-err" style="display:none;padding:0 16px 8px;font-size:12px;color:#fa5151"></div>' +
      '<div style="display:flex;gap:8px;padding:12px;border-top:1px solid #ececec">' +
      '<button type="button" id="quno-json-sample" style="flex:1;height:44px;border:0;border-radius:8px;background:#ededed;font-size:15px;cursor:pointer">填入示例</button>' +
      '<button type="button" id="quno-json-import" style="flex:1;height:44px;border:0;border-radius:8px;background:#07c160;color:#fff;font-size:15px;font-weight:500;cursor:pointer">用 JSON 生成群聊</button>' +
      "</div>";
    col.parentElement ? col.parentElement.appendChild(card) : col.appendChild(card);
    var ta = document.getElementById("quno-json-paste-ta");
    var meta = document.getElementById("quno-json-paste-meta");
    var err = document.getElementById("quno-json-paste-err");
    function refreshMeta() {
      var parsed = parseChatScript(ta.value || "");
      if (parsed && parsed.messages.length) {
        meta.style.display = "block";
        meta.textContent =
          (parsed.source === "json" ? "JSON · " : "") +
          "读到 " +
          parsed.messages.length +
          " 条 · " +
          parsed.people.length +
          " 人" +
          (parsed.name ? " · 群名「" + parsed.name + "」" : "");
      } else {
        meta.style.display = "none";
      }
    }
    ta.addEventListener("input", function () {
      err.style.display = "none";
      refreshMeta();
    });
    document.getElementById("quno-json-sample").addEventListener("click", function () {
      ta.value = SAMPLE;
      err.style.display = "none";
      refreshMeta();
    });
    document.getElementById("quno-json-import").addEventListener("click", function () {
      var parsed = parseChatScript(ta.value || "");
      if (!parsed || parsed.messages.length < 2) {
        err.style.display = "block";
        err.textContent = "这里读的是外面 AI 返回的 JSON，不是上面的任务。把生成结果整段贴进来。";
        return;
      }
      importParsed(parsed);
    });
  }

  /* ---------- JSON parser (from { to matching }) ---------- */
  function matchJsonEnd(s, start) {
    var stack = [];
    var inString = false;
    var escape = false;
    for (var i = start; i < s.length; i++) {
      var c = s.charAt(i);
      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }
        if (c === "\\") {
          escape = true;
          continue;
        }
        if (c === '"') inString = false;
        continue;
      }
      if (c === '"') {
        inString = true;
        continue;
      }
      if (c === "{") stack.push("}");
      else if (c === "[") stack.push("]");
      else if (c === "}" || c === "]") {
        if (!stack.length || stack.pop() !== c) return -1;
        if (!stack.length) return i;
      }
    }
    return -1;
  }
  function extractTopLevelJson(raw) {
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var c = raw.charAt(i);
      if (c !== "{" && c !== "[") continue;
      var end = matchJsonEnd(raw, i);
      if (end < 0) continue;
      out.push(raw.slice(i, end + 1));
      i = end;
    }
    return out;
  }
  function repairJson(s) {
    return s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/,\s*([}\]])/g, "$1");
  }
  function pickStr(rec, keys) {
    for (var i = 0; i < keys.length; i++) {
      var v = rec[keys[i]];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  }
  var NAME_KEYS = ["name", "group", "title", "群名", "groupName", "群聊名"];
  var NOTICE_KEYS = ["notice", "announcement", "公告", "groupNotice", "群公告"];
  var MSG_KEYS = ["messages", "msgs", "chat", "script", "消息", "讨论"];
  var NICK_KEYS = ["nick", "speaker", "from", "author", "name", "who", "role", "昵称"];
  var TEXT_KEYS = ["text", "content", "body", "message", "msg", "内容"];

  function normalizeMsg(item) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    var nick = pickStr(item, NICK_KEYS);
    var text = pickStr(item, TEXT_KEYS);
    if (!nick || !text) return null;
    return { nick: nick, text: text };
  }
  function asChat(value) {
    if (Array.isArray(value)) {
      var messages = value.map(normalizeMsg).filter(Boolean);
      if (messages.length >= 1 && messages.length >= value.length * 0.5) {
        return { name: "", notice: "", messages: messages };
      }
      return null;
    }
    if (!value || typeof value !== "object") return null;
    var msgsRaw;
    for (var i = 0; i < MSG_KEYS.length; i++) {
      if (Array.isArray(value[MSG_KEYS[i]])) {
        msgsRaw = value[MSG_KEYS[i]];
        break;
      }
    }
    if (!Array.isArray(msgsRaw)) return null;
    var messages2 = msgsRaw.map(normalizeMsg).filter(Boolean);
    if (!messages2.length) return null;
    return {
      name: pickStr(value, NAME_KEYS),
      notice: pickStr(value, NOTICE_KEYS),
      messages: messages2,
    };
  }
  function findChatInValue(value, depth) {
    if (depth > 5) return null;
    var direct = asChat(value);
    if (direct) return direct;
    var i, hit;
    if (Array.isArray(value)) {
      for (i = 0; i < value.length; i++) {
        hit = findChatInValue(value[i], depth + 1);
        if (hit) return hit;
      }
      return null;
    }
    if (value && typeof value === "object") {
      var keys = Object.keys(value);
      for (i = 0; i < keys.length; i++) {
        hit = findChatInValue(value[keys[i]], depth + 1);
        if (hit) return hit;
      }
    }
    return null;
  }
  function idOf(label) {
    var s = String(label || "").trim().replace(/^@/, "");
    if (NICK[s]) return NICK[s];
    if (NAME[s]) return NAME[s];
    var k;
    for (k in NICK) if (k && (s.indexOf(k) >= 0 || k.indexOf(s) >= 0)) return NICK[k];
    for (k in NAME) if (k && (s.indexOf(k) >= 0 || k.indexOf(s) >= 0)) return NAME[k];
    return null;
  }
  function parseChatScript(raw) {
    var normalized = String(raw || "").replace(/\r\n/g, "\n").replace(/^\uFEFF/, "").trim();
    if (!normalized) return { name: "新群", notice: "", messages: [], people: [], source: "text" };
    var slices = extractTopLevelJson(normalized);
    var best = null;
    for (var i = 0; i < slices.length; i++) {
      var value;
      try {
        value = JSON.parse(repairJson(slices[i]));
      } catch (e) {
        continue;
      }
      var hit = findChatInValue(value, 0);
      if (!hit) continue;
      if (!best || hit.messages.length > best.messages.length) best = hit;
    }
    if (!best) return { name: "新群", notice: "", messages: [], people: [], source: "text" };
    var used = [];
    var seen = {};
    var msgs = best.messages.map(function (m) {
      var id = idOf(m.nick) || "p-1001";
      if (!seen[id]) {
        seen[id] = 1;
        used.push(id);
      }
      return { nick: m.nick, text: m.text, authorId: id };
    });
    return {
      name: (best.name || (msgs[0] ? msgs[0].nick + "他们的群" : "新群")).slice(0, 16),
      notice: best.notice || "从提示词粘贴进来的讨论。",
      messages: msgs,
      people: used,
      source: "json",
    };
  }

  function readLS(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function writeLS(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function findActions() {
    var root = document.getElementById("app") || document.getElementById("main");
    if (!root) return null;
    var key = Object.keys(root).find(function (k) {
      return k.indexOf("__reactFiber") === 0 || k.indexOf("__reactContainer") === 0;
    });
    if (!key) return null;
    var node = root[key];
    if (node && node.stateNode && node.stateNode.current) node = node.stateNode.current;
    var seen = [];
    var stack = [node];
    function mark(n) {
      for (var i = 0; i < seen.length; i++) if (seen[i] === n) return true;
      seen.push(n);
      return false;
    }
    while (stack.length) {
      var n = stack.pop();
      if (!n || mark(n)) continue;
      var h = n.memoizedState;
      var hops = 0;
      while (h && hops++ < 80) {
        var v = h.memoizedState;
        if (v && typeof v === "object") {
          if (typeof v.addGroup === "function" && typeof v.openGroup === "function") return v;
          if (typeof v.getState === "function") {
            try {
              var st = v.getState();
              if (st && typeof st.addGroup === "function") return st;
            } catch (e) {}
          }
        }
        h = h.next;
      }
      if (n.child) stack.push(n.child);
      if (n.sibling) stack.push(n.sibling);
    }
    return null;
  }

  function homeUrl() {
    var u = new URL(location.href);
    if (u.hash && /studio/i.test(u.hash)) u.hash = "#/";
    u.pathname = u.pathname.replace(/\/studio\/?$/, "/");
    return u.toString();
  }

  function persistGroup(parsed) {
    var gid = "g-" + Date.now();
    var memberIds = parsed.people.slice();
    if (memberIds.indexOf("you") < 0) memberIds.push("you");
    var group = {
      id: gid,
      name: parsed.name,
      notice: parsed.notice,
      memberIds: memberIds,
      custom: true,
    };
    var groups = readLS("quno-groups-v1", []);
    if (!Array.isArray(groups)) groups = [];
    groups = groups.filter(function (g) {
      return g && g.id !== gid;
    });
    groups.push(group);
    writeLS("quno-groups-v1", groups);

    var now = Date.now();
    var newDrafts = parsed.messages.map(function (m, i) {
      return {
        id: "draft-" + now + "-" + i,
        groupId: gid,
        authorId: m.authorId,
        createdAt: now + i * 1000,
        type: "text",
        text: m.text,
        draft: true,
      };
    });
    var old = readLS("quno-drafts-v1", []);
    if (!Array.isArray(old)) old = [];
    writeLS("quno-drafts-v1", newDrafts.concat(old).slice(0, 80));
    return group;
  }

  function importParsed(parsed) {
    var group = persistGroup(parsed);
    sessionStorage.setItem("quno-json-open", group.id);
    var actions = findActions();
    if (actions && typeof actions.boot === "function") {
      Promise.resolve(actions.boot())
        .catch(function () {})
        .then(function () {
          if (typeof actions.openGroup === "function") actions.openGroup(group.id);
          if (location.hash && /studio/i.test(location.hash)) location.hash = "#/";
        });
      return;
    }
    var u = homeUrl();
    if (u === location.href) location.reload();
    else location.assign(u);
  }

  function tryOpenPending() {
    var gid = sessionStorage.getItem("quno-json-open");
    if (!gid) return;
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      var a = findActions();
      if (a && typeof a.openGroup === "function") {
        sessionStorage.removeItem("quno-json-open");
        a.openGroup(gid);
        clearInterval(t);
      }
      if (n > 25) clearInterval(t);
    }, 200);
  }

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var btn = t.closest('[data-quno="brief-copy"]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      doCopy();
    },
    true
  );

  function tick() {
    if (!topicEl()) return;
    ensureTopicCopy();
    ensurePastePanel();
    ungateCopy();
    patchPreview();
  }

  var mo = new MutationObserver(function () {
    tick();
  });
  function boot() {
    tick();
    tryOpenPending();
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    setInterval(tick, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
