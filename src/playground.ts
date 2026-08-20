import { IMAGE_ASPECT_RATIOS } from "./image.ts";

const AUTH_STORAGE_KEY = "agy-mcp-auth-token";
const TOOL_STORAGE_KEY = "agy-landing-playground-tool";

export const PLAYGROUND_CSS = `
  .pg-picks {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .pg-pick {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pg-pick:hover {
    color: #fff;
    border-color: var(--border-highlight);
  }
  .pg-pick.active {
    color: #fff;
    background: rgba(99, 102, 241, 0.18);
    border-color: rgba(99, 102, 241, 0.45);
  }
  .pg-layout {
    display: grid;
    grid-template-columns: minmax(280px, 0.95fr) minmax(320px, 1.15fr);
    gap: 20px;
    align-items: start;
  }
  .pg-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pg-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pg-field label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .pg-field .req-mark {
    color: #f87171;
    margin-left: 4px;
  }
  .pg-field input[type="text"],
  .pg-field input[type="password"],
  .pg-field select,
  .pg-form textarea {
    width: 100%;
    background: var(--code-bg);
    color: var(--text-main);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: var(--font-mono);
    font-size: 13px;
    outline: none;
    margin: 0;
    min-height: 0;
  }
  .pg-form textarea {
    min-height: 96px;
    resize: vertical;
  }
  .pg-field input:focus,
  .pg-field select:focus,
  .pg-form textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
  }
  .pg-help {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.45;
  }
  .pg-drop {
    border: 1px dashed var(--border-highlight);
    border-radius: 10px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.02);
    text-align: center;
    color: var(--text-muted);
    font-size: 12.5px;
    cursor: pointer;
  }
  .pg-drop:hover, .pg-drop.drag {
    border-color: #818cf8;
    background: rgba(99, 102, 241, 0.08);
    color: #fff;
  }
  .pg-files {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pg-file {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
  }
  .pg-file img {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 6px;
    background: #000;
  }
  .pg-file .name {
    flex: 1;
    font-family: var(--font-mono);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pg-file button {
    background: transparent;
    border: 0;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 12px;
  }
  .pg-file button:hover { color: #f87171; }
  .pg-run-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .pg-result {
    background: var(--code-bg);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .pg-result-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 12px;
    color: var(--text-dim);
    font-family: var(--font-mono);
  }
  .pg-result-body {
    padding: 16px;
    flex: 1;
  }
  .pg-empty {
    color: var(--text-dim);
    font-size: 13.5px;
    line-height: 1.6;
    padding: 28px 8px;
  }
  .pg-text {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    color: #e2e8f0;
  }
  .pg-images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 14px;
  }
  .pg-images a, .pg-images img {
    display: block;
  }
  .pg-images img {
    width: 100%;
    border-radius: 10px;
    border: 1px solid var(--border-subtle);
    background: #000;
  }
  .pg-raw {
    margin-top: 14px;
  }
  .pg-raw summary {
    cursor: pointer;
    color: var(--text-dim);
    font-size: 12px;
  }
  .pg-raw pre {
    margin-top: 8px;
    max-height: 280px;
    overflow: auto;
    font-size: 11.5px;
    padding: 12px;
  }
  .pg-history {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }
  .pg-hist {
    font-size: 11px;
    font-family: var(--font-mono);
    padding: 3px 8px;
    border-radius: 9999px;
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.03);
  }
  .pg-hist.ok { color: #34d399; border-color: var(--success-border); }
  .pg-hist.bad { color: #f87171; border-color: var(--danger-border); }
  @media (max-width: 820px) {
    .pg-layout { grid-template-columns: 1fr; }
  }
`;

export function playgroundHtml(authRequired: boolean): string {
  const ratios = IMAGE_ASPECT_RATIOS.map(
    (r) => `<option value="${r}"${r === "1:1" ? " selected" : ""}>${r}</option>`,
  ).join("");
  const authField = authRequired
    ? `<div class="pg-field">
        <label for="pg-auth">MCP_AUTH_TOKEN <span class="req-mark">Bearer 保护已开</span></label>
        <input id="pg-auth" type="password" autocomplete="off" placeholder="部署时设的 MCP_AUTH_TOKEN">
        <p class="pg-help">只存在这个浏览器，用来调 /mcp，不会发给 Google。</p>
      </div>`
    : "";

  return `<section class="section-card">
    <div class="card-header">
      <h2>
        <span class="section-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </span>
        工具测试
      </h2>
      <span class="hint-text">走和 Agent 一样的 <code>POST /mcp</code>，方便本地或部署后试一次</span>
    </div>
    <div class="pg-picks" id="pg-picks">
      <button type="button" class="pg-pick active" data-tool="search_web">search_web</button>
      <button type="button" class="pg-pick" data-tool="generate_image">generate_image</button>
    </div>
    <div class="pg-layout">
      <form id="pg-form" class="pg-form" autocomplete="off">
        ${authField}
        <div id="pg-fields-search_web">
          <div class="pg-field">
            <label for="pg-query">query <span class="req-mark">必填</span></label>
            <textarea id="pg-query" rows="4" placeholder="例如：2026 年 Cloudflare Workers 免费套餐限制"></textarea>
          </div>
        </div>
        <div id="pg-fields-generate_image" hidden>
          <div class="pg-field">
            <label for="pg-prompt">prompt <span class="req-mark">必填</span></label>
            <textarea id="pg-prompt" rows="4" placeholder="要画什么，或怎么改参考图"></textarea>
          </div>
          <div class="pg-field">
            <label for="pg-image-name">image_name</label>
            <input id="pg-image-name" type="text" placeholder="cute_pig_eating">
          </div>
          <div class="pg-field">
            <label for="pg-aspect">aspect_ratio</label>
            <select id="pg-aspect">${ratios}</select>
          </div>
          <div class="pg-field">
            <label for="pg-image-urls">image_urls</label>
            <textarea id="pg-image-urls" rows="3" placeholder="每行一个 http(s) 链接，可填之前的 /files/... 地址"></textarea>
          </div>
          <div class="pg-field">
            <label>images（本地参考图）</label>
            <div class="pg-drop" id="pg-drop">点这里或拖入图片，最多 3 张（含 URL）</div>
            <input id="pg-files" type="file" accept="image/*" multiple hidden>
            <div class="pg-files" id="pg-file-list"></div>
            <p class="pg-help">浏览器读成 base64 再放进 images[]。服务端读不到你的磁盘。</p>
          </div>
        </div>
        <div class="pg-run-row">
          <button type="submit" class="btn" id="pg-run">运行</button>
          <span class="hint-text" id="pg-run-hint"></span>
        </div>
      </form>
      <div>
        <div class="pg-result" id="pg-result">
          <div class="pg-result-head">
            <span>结果</span>
            <span id="pg-result-meta">尚未调用</span>
          </div>
          <div class="pg-result-body" id="pg-result-body">
            <div class="pg-empty">选好工具、填参数，点运行。会带上这个浏览器 localStorage 里的 Google session。</div>
          </div>
        </div>
        <div class="pg-history" id="pg-history"></div>
      </div>
    </div>
  </section>`;
}

export function playgroundClientJs(): string {
  return `
  var AUTH_KEY = ${JSON.stringify(AUTH_STORAGE_KEY)};
  var PG_TOOL_KEY = ${JSON.stringify(TOOL_STORAGE_KEY)};
  var pgTool = "search_web";
  var pgFiles = [];
  var pgAbort = null;
  var pgHistory = [];
  var pgTimer = null;

  try {
    var savedPg = localStorage.getItem(PG_TOOL_KEY);
    if (savedPg === "search_web" || savedPg === "generate_image") pgTool = savedPg;
  } catch (e) {}

  if (auth) {
    try {
      var savedAuth = localStorage.getItem(AUTH_KEY) || "";
      var authInput = document.getElementById("pg-auth");
      if (authInput && savedAuth) authInput.value = savedAuth;
    } catch (e) {}
  }

  function setPgTool(name) {
    pgTool = name === "generate_image" ? "generate_image" : "search_web";
    try { localStorage.setItem(PG_TOOL_KEY, pgTool); } catch (e) {}
    document.querySelectorAll(".pg-pick").forEach(function (b) {
      if (b.getAttribute("data-tool") === pgTool) b.classList.add("active");
      else b.classList.remove("active");
    });
    var searchFields = document.getElementById("pg-fields-search_web");
    var imageFields = document.getElementById("pg-fields-generate_image");
    if (searchFields) searchFields.hidden = pgTool !== "search_web";
    if (imageFields) imageFields.hidden = pgTool !== "generate_image";
  }
  setPgTool(pgTool);

  document.querySelectorAll(".pg-pick").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setPgTool(btn.getAttribute("data-tool") || "search_web");
    });
  });
  document.querySelectorAll("[data-pg-tool]").forEach(function (el) {
    el.addEventListener("click", function () {
      setPgTool(el.getAttribute("data-pg-tool") || "search_web");
    });
  });

  var drop = document.getElementById("pg-drop");
  var fileInput = document.getElementById("pg-files");
  if (drop && fileInput) {
    drop.addEventListener("click", function () { fileInput.click(); });
    drop.addEventListener("dragover", function (e) {
      e.preventDefault();
      drop.classList.add("drag");
    });
    drop.addEventListener("dragleave", function () { drop.classList.remove("drag"); });
    drop.addEventListener("drop", function (e) {
      e.preventDefault();
      drop.classList.remove("drag");
      addPgFiles(e.dataTransfer && e.dataTransfer.files);
    });
    fileInput.addEventListener("change", function () {
      addPgFiles(fileInput.files);
      fileInput.value = "";
    });
  }

  function addPgFiles(list) {
    if (!list || !list.length) return;
    var i;
    for (i = 0; i < list.length; i++) addPgFile(list[i]);
  }
  function addPgFile(file) {
    if (!file || !file.type || file.type.indexOf("image/") !== 0) return;
    if (pgFiles.length >= 3) {
      setPgHint("参考图最多 3 张（含 URL）");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var url = String(reader.result || "");
      var m = url.match(/^data:([^;]+);base64,(.*)$/);
      if (!m) return;
      pgFiles.push({ mimeType: m[1], data: m[2], name: file.name, preview: url });
      renderPgFiles();
    };
    reader.readAsDataURL(file);
  }
  function renderPgFiles() {
    var list = document.getElementById("pg-file-list");
    if (!list) return;
    if (!pgFiles.length) {
      list.innerHTML = "";
      return;
    }
    list.innerHTML = pgFiles.map(function (f, i) {
      return '<div class="pg-file"><img alt="" src="' + f.preview + '"><span class="name">' +
        escapeHtmlJs(f.name) + "</span><button type=\\"button\\" data-rm=\\"" + i + "\\">移除</button></div>";
    }).join("");
    list.querySelectorAll("[data-rm]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        pgFiles.splice(Number(btn.getAttribute("data-rm") || "0"), 1);
        renderPgFiles();
      });
    });
  }

  function setPgHint(text) {
    var el = document.getElementById("pg-run-hint");
    if (el) el.textContent = text || "";
  }

  var pgForm = document.getElementById("pg-form");
  if (pgForm) {
    pgForm.addEventListener("submit", function (e) {
      e.preventDefault();
      runPlayground();
    });
  }

  function collectArgs() {
    if (pgTool === "search_web") {
      var q = (document.getElementById("pg-query") || {}).value || "";
      q = String(q).trim();
      if (!q) throw new Error("query 不能为空");
      return { query: q };
    }
    var prompt = String((document.getElementById("pg-prompt") || {}).value || "").trim();
    if (!prompt) throw new Error("prompt 不能为空");
    var args = { prompt: prompt };
    var name = String((document.getElementById("pg-image-name") || {}).value || "").trim();
    if (name) args.image_name = name;
    var ratio = String((document.getElementById("pg-aspect") || {}).value || "1:1");
    if (ratio) args.aspect_ratio = ratio;
    var urlsRaw = String((document.getElementById("pg-image-urls") || {}).value || "");
    var urls = urlsRaw.split(/\\n/).map(function (u) { return u.trim(); }).filter(Boolean);
    if (urls.length) args.image_urls = urls;
    if (pgFiles.length) {
      args.images = pgFiles.map(function (f) {
        return { mimeType: f.mimeType, data: f.data };
      });
    }
    if ((urls.length + pgFiles.length) > 3) throw new Error("image_urls 和 images 合计最多 3 张");
    return args;
  }

  function mcpHeaders() {
    var headers = { "Content-Type": "application/json", Accept: "application/json" };
    if (currentRefreshToken) headers["X-Agy-Refresh-Token"] = currentRefreshToken;
    if (auth) {
      var token = String((document.getElementById("pg-auth") || {}).value || "").trim();
      if (token) {
        headers.Authorization = "Bearer " + token;
        try { localStorage.setItem(AUTH_KEY, token); } catch (e) {}
      }
    }
    return headers;
  }

  function runPlayground() {
    var args;
    try {
      args = collectArgs();
    } catch (err) {
      setPgHint(err && err.message ? err.message : String(err));
      return;
    }
    if (pgAbort) pgAbort.abort();
    pgAbort = new AbortController();
    var t0 = Date.now();
    var runBtn = document.getElementById("pg-run");
    var meta = document.getElementById("pg-result-meta");
    var body = document.getElementById("pg-result-body");
    if (runBtn) runBtn.disabled = true;
    setPgHint("调用中…");
    if (meta) meta.textContent = "调用中";
    if (body) body.innerHTML = '<div class="pg-empty">正在 POST /mcp … 生图可能要十几秒。</div>';
    if (pgTimer) clearInterval(pgTimer);
    pgTimer = setInterval(function () {
      setPgHint("调用中… " + ((Date.now() - t0) / 1000).toFixed(1) + "s");
    }, 200);

    var payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: pgTool, arguments: args }
    };

    fetch("/mcp", {
      method: "POST",
      headers: mcpHeaders(),
      body: JSON.stringify(payload),
      signal: pgAbort.signal
    }).then(function (r) {
      return r.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (e) { json = null; }
        return { okHttp: r.ok, status: r.status, text: text, json: json };
      });
    }).then(function (res) {
      finishPg(t0, payload, res, args);
    }).catch(function (err) {
      if (err && err.name === "AbortError") return;
      finishPg(t0, payload, { okHttp: false, status: 0, text: String(err && err.message || err), json: null }, args);
    });
  }

  function finishPg(t0, payload, res, args) {
    if (pgTimer) { clearInterval(pgTimer); pgTimer = null; }
    var ms = Date.now() - t0;
    var runBtn = document.getElementById("pg-run");
    if (runBtn) runBtn.disabled = false;
    var rpc = res.json;
    var isError = false;
    var errMsg = "";
    if (!res.okHttp) {
      isError = true;
      errMsg = (rpc && (rpc.error && rpc.error.message || rpc.error)) || res.text || ("HTTP " + res.status);
    } else if (rpc && rpc.error) {
      isError = true;
      errMsg = rpc.error.message || JSON.stringify(rpc.error);
    } else if (rpc && rpc.result && rpc.result.isError) {
      isError = true;
      errMsg = (rpc.result.content && rpc.result.content[0] && rpc.result.content[0].text) || "tool error";
    }
    setPgHint(isError ? "失败 " + fmtMsJs(ms) : "完成 " + fmtMsJs(ms));
    var meta = document.getElementById("pg-result-meta");
    if (meta) meta.innerHTML = '<span class="status-tag ' + (isError ? "bad" : "ok") + '">' +
      (isError ? "ERR" : "OK") + "</span> " + fmtMsJs(ms);
    var body = document.getElementById("pg-result-body");
    if (body) body.innerHTML = renderPgResult(rpc, res.text, isError, errMsg);
    var label = pgTool === "search_web" ? (args.query || "") : (args.prompt || "");
    pgHistory.unshift({ tool: pgTool, label: label, ok: !isError, ms: ms });
    if (pgHistory.length > 8) pgHistory.length = 8;
    renderPgHistory();
  }

  function renderPgResult(rpc, rawText, isError, errMsg) {
    var html = "";
    if (isError) {
      html += '<div class="status-pill bad" style="margin-bottom:12px;">' + escapeHtmlJs(String(errMsg || "失败")) + "</div>";
    }
    var content = rpc && rpc.result && Array.isArray(rpc.result.content) ? rpc.result.content : [];
    var texts = [];
    var images = [];
    content.forEach(function (c) {
      if (!c) return;
      if (c.type === "text" && c.text) texts.push(c.text);
      if (c.type === "image" && c.data) {
        images.push({ mimeType: c.mimeType || "image/jpeg", data: c.data });
      }
    });
    if (texts.length) {
      html += '<div class="pg-text">' + escapeHtmlJs(texts.join("\\n\\n")) + "</div>";
    } else if (!isError) {
      html += '<div class="pg-empty">没有返回文本。</div>';
    }
    if (images.length) {
      html += '<div class="pg-images">' + images.map(function (img, i) {
        var src = "data:" + img.mimeType + ";base64," + img.data;
        return '<a href="' + src + '" target="_blank" rel="noopener"><img alt="result ' + (i + 1) + '" src="' + src + '"></a>';
      }).join("") + "</div>";
    }
    var pretty = rpc ? JSON.stringify(truncatePgJson(rpc), null, 2) : rawText;
    html += '<details class="pg-raw"><summary>原始 JSON-RPC</summary><pre>' + escapeHtmlJs(pretty || "") + "</pre></details>";
    return html;
  }

  function truncatePgJson(value) {
    if (Array.isArray(value)) return value.map(truncatePgJson);
    if (value && typeof value === "object") {
      var out = {};
      Object.keys(value).forEach(function (k) {
        if (k === "data" && typeof value[k] === "string" && value[k].length > 120) {
          out[k] = value[k].slice(0, 80) + "…(" + value[k].length + " chars)";
        } else {
          out[k] = truncatePgJson(value[k]);
        }
      });
      return out;
    }
    return value;
  }

  function renderPgHistory() {
    var el = document.getElementById("pg-history");
    if (!el) return;
    el.innerHTML = pgHistory.map(function (h) {
      var q = h.label.length > 28 ? h.label.slice(0, 28) + "…" : h.label;
      return '<span class="pg-hist ' + (h.ok ? "ok" : "bad") + '">' +
        escapeHtmlJs(h.tool) + " · " + escapeHtmlJs(q) + " · " + fmtMsJs(h.ms) + "</span>";
    }).join("");
  }
`;
}
