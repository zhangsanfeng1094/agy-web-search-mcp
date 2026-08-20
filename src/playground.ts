import { IMAGE_ASPECT_RATIOS } from "./image.ts";

const AUTH_STORAGE_KEY = "agy-mcp-auth-token";
const SEARCH_HISTORY_KEY = "agy-history-search";
const IMAGE_HISTORY_KEY = "agy-history-image";

export const PLAYGROUND_CSS = `
  /* Playground Container */
  .pg-view-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .subpage-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 4px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .subpage-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 550;
    padding: 6px 12px;
    color: var(--text-muted);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
  }

  .btn-back:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-highlight);
    text-decoration: none;
    transform: translateX(-2px);
  }

  .breadcrumb-trail {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .breadcrumb-item {
    color: #818cf8;
    text-decoration: none;
    font-weight: 550;
    cursor: pointer;
  }

  .breadcrumb-item:hover {
    text-decoration: underline;
  }

  .breadcrumb-sep {
    color: var(--text-dim);
    font-size: 11px;
  }

  .breadcrumb-current {
    color: var(--text-main);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .breadcrumb-current code {
    background: rgba(99, 102, 241, 0.15);
    color: #a5b4fc;
    padding: 1px 6px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 12px;
  }

  /* Status Items */
  .pg-status-items {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* Two Column Layout */
  .pg-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(380px, 1.25fr);
    gap: 20px;
    align-items: start;
  }

  /* Form Card */
  .pg-card {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid var(--border-subtle);
    border-radius: 14px;
    backdrop-filter: blur(12px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .pg-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid var(--border-subtle);
  }
  .pg-card-head-title {
    font-size: 13px;
    font-weight: 650;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pg-card-body {
    padding: 18px;
  }

  /* Form Elements */
  .pg-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pg-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pg-field-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pg-field label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pg-tag-req {
    font-size: 10.5px;
    color: #f43f5e;
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
    padding: 1px 5px;
    border-radius: 4px;
  }
  .pg-tag-opt {
    font-size: 10.5px;
    color: var(--text-dim);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    padding: 1px 5px;
    border-radius: 4px;
  }

  .pg-field input,
  .pg-field select,
  .pg-form textarea {
    width: 100%;
    background: var(--code-bg);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    font-size: 13px;
    border-radius: 8px;
    padding: 9px 12px;
    outline: none;
    transition: all 0.15s;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .pg-form textarea {
    font-family: var(--font-sans);
    min-height: 90px;
    resize: vertical;
    line-height: 1.5;
  }
  .pg-field input:focus,
  .pg-field select:focus,
  .pg-form textarea:focus {
    border-color: #6366f1;
    background: rgba(11, 15, 25, 0.95);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .pg-field input::placeholder,
  .pg-form textarea::placeholder {
    color: #475569;
    font-size: 12.5px;
  }
  .pg-help {
    font-size: 11.5px;
    color: var(--text-dim);
    line-height: 1.4;
  }

  /* Preset Chips */
  .pg-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .pg-preset-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11.5px;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .pg-preset-btn:hover {
    color: #fff;
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.35);
  }

  /* Aspect Ratio Visual Pills */
  .pg-ratio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
    margin-top: 4px;
  }
  .pg-ratio-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    border-radius: 8px;
    padding: 6px 4px;
    font-size: 11.5px;
    font-family: var(--font-mono);
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .pg-ratio-btn:hover {
    color: #fff;
    border-color: var(--border-highlight);
  }
  .pg-ratio-btn.active {
    background: rgba(99, 102, 241, 0.18);
    border-color: rgba(99, 102, 241, 0.5);
    color: #fff;
    font-weight: 600;
  }
  .pg-ratio-btn .ratio-sub {
    font-size: 9.5px;
    color: var(--text-dim);
  }
  .pg-ratio-btn.active .ratio-sub {
    color: #a5b4fc;
  }

  /* Reference Images Section */
  .pg-ref-card {
    background: rgba(11, 15, 25, 0.5);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pg-drop {
    border: 1.5px dashed var(--border-highlight);
    border-radius: 10px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.02);
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .pg-drop:hover, .pg-drop.drag {
    border-color: #818cf8;
    background: rgba(99, 102, 241, 0.08);
    color: #fff;
  }
  .pg-drop-icon {
    width: 28px;
    height: 28px;
    color: #818cf8;
  }
  .pg-files-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pg-file {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .pg-file .thumb {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    object-fit: cover;
  }
  .pg-file .name {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 11.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-main);
  }
  .pg-file button {
    background: transparent;
    border: 0;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 11.5px;
    padding: 4px 6px;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .pg-file button:hover {
    color: #f87171;
    background: rgba(244, 63, 94, 0.1);
  }

  /* Form Action Row */
  .pg-run-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 4px;
    border-top: 1px solid var(--border-subtle);
    flex-wrap: wrap;
  }
  .pg-run-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .btn-shortcut {
    font-size: 10.5px;
    opacity: 0.7;
    margin-left: 4px;
    font-family: var(--font-mono);
    padding: 1px 4px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.2);
  }

  /* Result Console */
  .pg-console {
    background: var(--code-bg);
    border: 1px solid var(--border-subtle);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    min-height: 480px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  }
  .pg-console-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(15, 23, 42, 0.85);
    border-bottom: 1px solid var(--border-subtle);
    gap: 10px;
    flex-wrap: wrap;
  }
  .pg-console-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }
  .pg-console-title {
    font-weight: 650;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pg-view-modes {
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 2px;
    gap: 2px;
  }
  .pg-view-btn {
    background: transparent;
    border: 0;
    color: var(--text-muted);
    font-size: 11.5px;
    font-weight: 550;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pg-view-btn:hover {
    color: #fff;
  }
  .pg-view-btn.active {
    background: rgba(99, 102, 241, 0.2);
    color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .pg-console-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pg-tool-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-size: 11.5px;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s;
  }
  .pg-tool-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: var(--border-highlight);
  }

  /* Console Body */
  .pg-console-body {
    padding: 18px;
    flex: 1;
    overflow-y: auto;
    max-height: 650px;
    display: flex;
    flex-direction: column;
  }
  .pg-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
    margin: auto 0;
    color: var(--text-dim);
    gap: 12px;
  }
  .pg-empty-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
  }
  .pg-empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .pg-empty-desc {
    font-size: 12px;
    max-width: 280px;
    line-height: 1.5;
  }

  /* Loading State */
  .pg-loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    margin: auto 0;
    gap: 14px;
  }
  .pg-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(99, 102, 241, 0.15);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: pgSpin 0.8s linear infinite;
  }
  @keyframes pgSpin {
    to { transform: rotate(360deg); }
  }
  .pg-loading-timer {
    font-family: var(--font-mono);
    font-size: 13px;
    color: #818cf8;
    background: rgba(99, 102, 241, 0.1);
    padding: 2px 8px;
    border-radius: 6px;
  }

  /* Markdown & Output Styles */
  .md-content {
    font-size: 13.5px;
    line-height: 1.7;
    color: #e2e8f0;
  }
  .md-content p {
    margin-bottom: 12px;
  }
  .md-content p:last-child {
    margin-bottom: 0;
  }
  .md-content h1, .md-content h2, .md-content h3, .md-content h4 {
    color: #fff;
    font-weight: 650;
    margin: 16px 0 8px;
  }
  .md-content h1 { font-size: 18px; }
  .md-content h2 { font-size: 16px; }
  .md-content h3 { font-size: 14.5px; }
  .md-content ul, .md-content ol {
    margin: 8px 0 14px 20px;
  }
  .md-content li {
    margin-bottom: 4px;
  }
  .md-inline-code {
    background: rgba(255, 255, 255, 0.08);
    color: #a5b4fc;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.9em;
  }
  .md-link {
    color: #38bdf8;
    text-decoration: underline;
    text-underline-offset: 2px;
    word-break: break-all;
  }
  .md-link:hover {
    color: #7dd3fc;
  }
  .md-link .ext-icon {
    font-size: 10px;
    margin-left: 2px;
  }
  .md-quote {
    border-left: 3px solid #6366f1;
    padding: 6px 12px;
    margin: 10px 0;
    background: rgba(99, 102, 241, 0.06);
    color: #cbd5e1;
    border-radius: 0 6px 6px 0;
  }
  .md-code-card {
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 0;
    background: #060911;
  }
  .md-code-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle);
    font-size: 11.5px;
    color: var(--text-dim);
  }
  .btn-copy-code {
    background: transparent;
    border: 0;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .btn-copy-code:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  .md-code-body {
    padding: 12px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 12px;
    color: #f1f5f9;
  }

  /* Generated Image Grid & Preview Card */
  .pg-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 14px;
  }
  .pg-img-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s, border-color 0.2s;
  }
  .pg-img-card:hover {
    transform: translateY(-2px);
    border-color: var(--border-highlight);
  }
  .pg-img-preview {
    position: relative;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    overflow: hidden;
  }
  .pg-img-preview img {
    max-width: 100%;
    max-height: 480px;
    object-fit: contain;
    display: block;
  }
  .pg-img-meta {
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid var(--border-subtle);
  }
  .pg-img-badge {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  .pg-img-actions {
    display: flex;
    gap: 6px;
  }
  .pg-img-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    font-size: 11.5px;
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s;
  }
  .pg-img-btn:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    color: #fff;
    text-decoration: none;
  }

  /* Raw JSON output */
  .pg-json-view {
    background: #060911;
    border-radius: 8px;
    padding: 14px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.5;
    color: #94a3b8;
  }
  .json-key { color: #38bdf8; }
  .json-string { color: #34d399; }
  .json-number { color: #f59e0b; }
  .json-boolean { color: #a78bfa; }
  .json-null { color: #f43f5e; }

  /* History Card */
  .pg-history-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pg-history-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .pg-history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pg-hist-item {
    font-size: 11.5px;
    font-family: var(--font-mono);
    padding: 5px 10px;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.03);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;
  }
  .pg-hist-item:hover {
    color: #fff;
    border-color: var(--border-highlight);
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-1px);
  }
  .pg-hist-item.ok {
    border-color: rgba(16, 185, 129, 0.25);
  }
  .pg-hist-item.bad {
    border-color: rgba(244, 63, 94, 0.25);
  }
  .pg-hist-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .pg-hist-dot.ok { background: #34d399; box-shadow: 0 0 6px rgba(52, 211, 153, 0.6); }
  .pg-hist-dot.bad { background: #f87171; box-shadow: 0 0 6px rgba(248, 113, 113, 0.6); }

  @media (max-width: 960px) {
    .pg-layout { grid-template-columns: 1fr; }
    .pg-console { min-height: 400px; }
  }
`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function searchPlaygroundHtml(authRequired: boolean): string {
  const authField = authRequired
    ? `<div class="pg-field">
        <div class="pg-field-head">
          <label for="pg-search-auth">MCP_AUTH_TOKEN <span class="pg-tag-req">Bearer 保护</span></label>
          <span class="pg-help">仅存本地浏览器</span>
        </div>
        <input id="pg-search-auth" class="pg-auth-input" type="password" autocomplete="off" placeholder="输入部署时设定的 MCP_AUTH_TOKEN">
        <p class="pg-help">用于 /mcp 请求鉴权，不会上报至第三方。</p>
      </div>`
    : "";

  return `<div class="pg-view-wrapper" id="pg-search-root">
    <!-- Subpage Navigation Header -->
    <div class="subpage-header">
      <div class="subpage-header-left">
        <a class="btn ghost btn-back" href="#tools" title="返回工具列表">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          返回工具列表
        </a>
        <div class="breadcrumb-trail">
          <a class="breadcrumb-item" href="#tools">工具列表</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">网页搜索 (<code>search_web</code>)</span>
        </div>
      </div>
      <div class="pg-status-items">
        <span class="status-pill ok pg-session-pill"><span class="pulse-dot"></span>Google Session</span>
        <span class="endpoint-pill"><span class="method">POST</span> /mcp</span>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="pg-layout">
      <!-- Left Panel: Request Parameters -->
      <div class="pg-card">
        <div class="pg-card-head">
          <span class="pg-card-head-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            搜索参数配置 (search_web)
          </span>
          <button type="button" class="pg-tool-btn" id="pg-search-reset" title="清空输入内容">清空重置</button>
        </div>
        <div class="pg-card-body">
          <form id="pg-search-form" class="pg-form" autocomplete="off">
            ${authField}

            <div class="pg-field">
              <div class="pg-field-head">
                <label for="pg-search-query">搜索查询词 (query) <span class="pg-tag-req">必填</span></label>
                <span class="pg-help" id="pg-search-query-count"></span>
              </div>
              <textarea id="pg-search-query" rows="4" placeholder="输入搜索关键词或问题，例如：2026 年 Cloudflare Workers 免费套餐限制与配额"></textarea>
              <div class="pg-presets">
                <span style="font-size: 11px; color: var(--text-dim); align-self: center; margin-right: 2px;">推荐示例:</span>
                <button type="button" class="pg-preset-btn" data-fill-search-query="2026 年 Cloudflare Workers 免费套餐限制与配额">⚡ Cloudflare 配额</button>
                <button type="button" class="pg-preset-btn" data-fill-search-query="Bun v1.3 新特性与性能对比解析">🚀 Bun 运行时新特性</button>
                <button type="button" class="pg-preset-btn" data-fill-search-query="DeepSeek V3 架构解析与技术报告核心亮点">🧠 DeepSeek V3 架构</button>
              </div>
            </div>

            <div class="pg-run-row">
              <div class="pg-run-left">
                <button type="submit" class="btn" id="pg-search-run" style="padding: 8px 18px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  运行搜索
                  <span class="btn-shortcut">Ctrl+Enter</span>
                </button>
                <button type="button" class="btn ghost" id="pg-search-abort" style="display: none; color: #f87171; border-color: rgba(244, 63, 94, 0.3);">
                  取消请求
                </button>
              </div>
              <span class="hint-text" id="pg-search-hint" style="font-size: 12px;">就绪</span>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Panel: Result Console -->
      <div class="pg-console" id="pg-search-console">
        <div class="pg-console-head">
          <div class="pg-console-left">
            <span class="pg-console-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              搜索结果响应
            </span>
            <span id="pg-search-meta" style="color: var(--text-dim); font-size: 11.5px; font-family: var(--font-mono);">尚未调用</span>
          </div>
          <div class="pg-console-actions">
            <div class="pg-view-modes" id="pg-search-view-modes" style="display: none;">
              <button type="button" class="pg-view-btn active" data-search-mode="rendered">Markdown 渲染</button>
              <button type="button" class="pg-view-btn" data-search-mode="raw">原始 JSON</button>
            </div>
            <button type="button" class="pg-tool-btn" id="pg-search-copy-btn" style="display: none;" title="复制搜索结果">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              复制
            </button>
            <button type="button" class="pg-tool-btn" id="pg-search-clear-btn" title="清空控制台">清空</button>
          </div>
        </div>

        <div class="pg-console-body" id="pg-search-body">
          <div class="pg-empty-state">
            <div class="pg-empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div class="pg-empty-title">等待发起搜索</div>
            <div class="pg-empty-desc">
              在左侧输入搜索关键词，点击「运行搜索」或按 <kbd style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">Ctrl + Enter</kbd> 即可实时检索。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Search History -->
    <div class="pg-history-card">
      <div class="pg-history-head">
        <span style="display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          近期搜索记录 (点击可回填参数与结果)
        </span>
        <button type="button" class="pg-tool-btn" id="pg-search-clear-history" style="display: none;">清空记录</button>
      </div>
      <div class="pg-history-list" id="pg-search-history">
        <span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无搜索调试记录</span>
      </div>
    </div>
  </div>`;
}

export function imagePlaygroundHtml(authRequired: boolean): string {
  const ratios = IMAGE_ASPECT_RATIOS.map(
    (r) => `<option value="${r}"${r === "1:1" ? " selected" : ""}>${r}</option>`,
  ).join("");

  const authField = authRequired
    ? `<div class="pg-field">
        <div class="pg-field-head">
          <label for="pg-image-auth">MCP_AUTH_TOKEN <span class="pg-tag-req">Bearer 保护</span></label>
          <span class="pg-help">仅存本地浏览器</span>
        </div>
        <input id="pg-image-auth" class="pg-auth-input" type="password" autocomplete="off" placeholder="输入部署时设定的 MCP_AUTH_TOKEN">
        <p class="pg-help">用于 /mcp 请求鉴权，不会上报至第三方。</p>
      </div>`
    : "";

  return `<div class="pg-view-wrapper" id="pg-image-root">
    <!-- Subpage Navigation Header -->
    <div class="subpage-header">
      <div class="subpage-header-left">
        <a class="btn ghost btn-back" href="#tools" title="返回工具列表">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          返回工具列表
        </a>
        <div class="breadcrumb-trail">
          <a class="breadcrumb-item" href="#tools">工具列表</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">生成图片 (<code>generate_image</code>)</span>
        </div>
      </div>
      <div class="pg-status-items">
        <span class="status-pill ok pg-session-pill"><span class="pulse-dot"></span>Google Session</span>
        <span class="endpoint-pill"><span class="method">POST</span> /mcp</span>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="pg-layout">
      <!-- Left Panel: Request Parameters -->
      <div class="pg-card">
        <div class="pg-card-head">
          <span class="pg-card-head-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            生图参数配置 (generate_image)
          </span>
          <button type="button" class="pg-tool-btn" id="pg-image-reset" title="清空输入内容">清空重置</button>
        </div>
        <div class="pg-card-body">
          <form id="pg-image-form" class="pg-form" autocomplete="off">
            ${authField}

            <div class="pg-field">
              <div class="pg-field-head">
                <label for="pg-image-prompt">画面描述提示词 (prompt) <span class="pg-tag-req">必填</span></label>
              </div>
              <textarea id="pg-image-prompt" rows="3" placeholder="描述要生成的画面内容、艺术风格、光影色彩细节，或说明如何基于参考图修改"></textarea>
              <div class="pg-presets">
                <span style="font-size: 11px; color: var(--text-dim); align-self: center; margin-right: 2px;">预设灵感:</span>
                <button type="button" class="pg-preset-btn" data-fill-image-prompt="赛博朋克风格未来城市夜景，雨夜霓虹灯反光，电影级光影，8K 超清壁纸">🌆 赛博朋克城市</button>
                <button type="button" class="pg-preset-btn" data-fill-image-prompt="可爱水彩风小猫咪戴着魔法巫师帽，身边漂浮着发光的魔法书，柔和治愈配色">🐱 魔法小猫</button>
                <button type="button" class="pg-preset-btn" data-fill-image-prompt="极简扁平风格太空探索插画，宇航员遥望绚丽星系，科技未来感渐变色">🚀 极简深空</button>
              </div>
            </div>

            <div class="pg-field">
              <div class="pg-field-head">
                <label for="pg-image-aspect">画幅比例 (aspect_ratio) <span class="pg-tag-opt">可选</span></label>
              </div>
              <div class="pg-ratio-grid">
                <button type="button" class="pg-ratio-btn active" data-ratio="1:1">1:1<span class="ratio-sub">正方头像</span></button>
                <button type="button" class="pg-ratio-btn" data-ratio="16:9">16:9<span class="ratio-sub">宽屏壁纸</span></button>
                <button type="button" class="pg-ratio-btn" data-ratio="9:16">9:16<span class="ratio-sub">手机竖屏</span></button>
                <button type="button" class="pg-ratio-btn" data-ratio="4:3">4:3<span class="ratio-sub">经典画幅</span></button>
                <button type="button" class="pg-ratio-btn" data-ratio="3:4">3:4<span class="ratio-sub">人像海报</span></button>
                <button type="button" class="pg-ratio-btn" data-ratio="21:9">21:9<span class="ratio-sub">电影宽幅</span></button>
              </div>
              <select id="pg-image-aspect" style="display: none;">${ratios}</select>
            </div>

            <div class="pg-field">
              <div class="pg-field-head">
                <label for="pg-image-name">保存文件名标识 (image_name) <span class="pg-tag-opt">可选</span></label>
              </div>
              <input id="pg-image-name" type="text" placeholder="例如: login_hero_mockup（小写+下划线）">
              <p class="pg-help">用于返回标识与文件名命名，留空则自动生成随机短名。</p>
            </div>

            <!-- Reference Images -->
            <div class="pg-field">
              <div class="pg-field-head">
                <label>参考图垫图 (images / image_urls) <span class="pg-tag-opt">可选 · 最多 3 张</span></label>
              </div>
              <div class="pg-ref-card">
                <div class="pg-drop" id="pg-image-drop">
                  <svg class="pg-drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <div>
                    <span style="font-weight: 600; color: #fff;">点击或拖拽上传本地参考图</span>
                    <span class="hint-text" style="display: block; font-size: 11px;">支持 JPG/PNG/WebP，自动转为 Base64</span>
                  </div>
                </div>
                <input id="pg-image-files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple style="display:none;">
                <div class="pg-files-list" id="pg-image-file-list"></div>

                <div style="border-top: 1px dashed var(--border-subtle); padding-top: 8px; margin-top: 4px;">
                  <label for="pg-image-urls" style="font-size: 11.5px; color: var(--text-dim); display: block; margin-bottom: 4px;">或输入远程图片 HTTP(S) URL（每行一条）：</label>
                  <textarea id="pg-image-urls" rows="2" style="min-height: 50px;" placeholder="https://example.com/ref.png"></textarea>
                </div>
              </div>
            </div>

            <div class="pg-run-row">
              <div class="pg-run-left">
                <button type="submit" class="btn" id="pg-image-run" style="padding: 8px 18px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  生成图片
                  <span class="btn-shortcut">Ctrl+Enter</span>
                </button>
                <button type="button" class="btn ghost" id="pg-image-abort" style="display: none; color: #f87171; border-color: rgba(244, 63, 94, 0.3);">
                  取消请求
                </button>
              </div>
              <span class="hint-text" id="pg-image-hint" style="font-size: 12px;">就绪</span>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Panel: Result Console -->
      <div class="pg-console" id="pg-image-console">
        <div class="pg-console-head">
          <div class="pg-console-left">
            <span class="pg-console-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              生图结果预览
            </span>
            <span id="pg-image-meta" style="color: var(--text-dim); font-size: 11.5px; font-family: var(--font-mono);">尚未生成</span>
          </div>
          <div class="pg-console-actions">
            <div class="pg-view-modes" id="pg-image-view-modes" style="display: none;">
              <button type="button" class="pg-view-btn active" data-image-mode="rendered">效果预览</button>
              <button type="button" class="pg-view-btn" data-image-mode="raw">原始 JSON</button>
            </div>
            <button type="button" class="pg-tool-btn" id="pg-image-copy-btn" style="display: none;" title="复制文本输出">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              复制
            </button>
            <button type="button" class="pg-tool-btn" id="pg-image-clear-btn" title="清空控制台">清空</button>
          </div>
        </div>

        <div class="pg-console-body" id="pg-image-body">
          <div class="pg-empty-state">
            <div class="pg-empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div class="pg-empty-title">等待发起生图</div>
            <div class="pg-empty-desc">
              在左侧输入画面描述，选择画幅比例后点击「生成图片」或按 <kbd style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">Ctrl + Enter</kbd> 即可生成。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Image History -->
    <div class="pg-history-card">
      <div class="pg-history-head">
        <span style="display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          近期生图记录 (点击可回填参数与图片)
        </span>
        <button type="button" class="pg-tool-btn" id="pg-image-clear-history" style="display: none;">清空记录</button>
      </div>
      <div class="pg-history-list" id="pg-image-history">
        <span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无生图调试记录</span>
      </div>
    </div>
  </div>`;
}

// Backward compatibility wrapper
export function playgroundHtml(authRequired: boolean): string {
  return `<div id="view-playground">
    <div id="pg-legacy-search" style="margin-bottom: 24px;">
      ${searchPlaygroundHtml(authRequired)}
    </div>
    <div id="pg-legacy-image">
      ${imagePlaygroundHtml(authRequired)}
    </div>
  </div>`;
}

export function playgroundClientJs(): string {
  return `
  var AUTH_KEY = ${JSON.stringify(AUTH_STORAGE_KEY)};
  var SEARCH_HIST_KEY = ${JSON.stringify(SEARCH_HISTORY_KEY)};
  var IMAGE_HIST_KEY = ${JSON.stringify(IMAGE_HISTORY_KEY)};

  var searchAbort = null;
  var imageAbort = null;
  var searchTimer = null;
  var imageTimer = null;

  var searchLastResult = null;
  var imageLastResult = null;
  var searchViewMode = "rendered";
  var imageViewMode = "rendered";

  var imageFiles = [];
  var searchHistory = [];
  var imageHistory = [];

  // Load auth token into both forms
  if (auth) {
    try {
      var savedAuth = localStorage.getItem(AUTH_KEY) || "";
      document.querySelectorAll(".pg-auth-input").forEach(function (input) {
        if (savedAuth) input.value = savedAuth;
        input.addEventListener("input", function () {
          var val = input.value.trim();
          document.querySelectorAll(".pg-auth-input").forEach(function (other) {
            if (other !== input) other.value = val;
          });
          try {
            if (val) localStorage.setItem(AUTH_KEY, val);
            else localStorage.removeItem(AUTH_KEY);
          } catch (e) {}
        });
      });
    } catch (e) {}
  }

  // Update session pill in playground headers
  function updateSessionPills() {
    document.querySelectorAll(".pg-session-pill").forEach(function (pill) {
      if (currentRefreshToken) {
        pill.className = "status-pill ok pg-session-pill";
        pill.innerHTML = '<span class="pulse-dot"></span>Google Session 有效';
      } else {
        pill.className = "status-pill warn pg-session-pill";
        pill.innerHTML = '<span class="pulse-dot"></span>无 Google Session';
      }
    });
  }
  updateSessionPills();

  function mcpHeadersForTool() {
    var h = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    if (auth) {
      var authInput = document.querySelector(".pg-auth-input");
      var token = (authInput && authInput.value.trim()) || "";
      if (!token) {
        try { token = localStorage.getItem(AUTH_KEY) || ""; } catch (e) {}
      }
      if (token) h["Authorization"] = "Bearer " + token;
    }
    if (currentRefreshToken) {
      h["X-Agy-Refresh-Token"] = currentRefreshToken;
    }
    return h;
  }

  /* =========================================================================
     SEARCH_WEB CONTROLLER
     ========================================================================= */
  var searchQueryInput = document.getElementById("pg-search-query");
  var searchQueryCount = document.getElementById("pg-search-query-count");
  function updateSearchCharCount() {
    if (searchQueryInput && searchQueryCount) {
      searchQueryCount.textContent = searchQueryInput.value ? (searchQueryInput.value.length + " 字") : "";
    }
  }
  if (searchQueryInput) {
    searchQueryInput.addEventListener("input", updateSearchCharCount);
  }

  // Preset fillers for search
  document.querySelectorAll("[data-fill-search-query]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.getAttribute("data-fill-search-query") || "";
      if (searchQueryInput) {
        searchQueryInput.value = q;
        searchQueryInput.focus();
        updateSearchCharCount();
      }
    });
  });

  // Search reset button
  var searchResetBtn = document.getElementById("pg-search-reset");
  if (searchResetBtn) {
    searchResetBtn.addEventListener("click", function () {
      if (searchQueryInput) {
        searchQueryInput.value = "";
        updateSearchCharCount();
      }
      setSearchHint("搜索表单已重置");
    });
  }

  // Search view mode toggle
  document.querySelectorAll("[data-search-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      searchViewMode = btn.getAttribute("data-search-mode") || "rendered";
      document.querySelectorAll("[data-search-mode]").forEach(function (b) {
        if (b === btn) b.classList.add("active");
        else b.classList.remove("active");
      });
      if (searchLastResult) {
        var body = document.getElementById("pg-search-body");
        if (body) body.innerHTML = renderSearchBody(searchLastResult);
      }
    });
  });

  // Search clear console button
  var searchClearBtn = document.getElementById("pg-search-clear-btn");
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", function () {
      searchLastResult = null;
      var body = document.getElementById("pg-search-body");
      var meta = document.getElementById("pg-search-meta");
      var copyBtn = document.getElementById("pg-search-copy-btn");
      var modes = document.getElementById("pg-search-view-modes");
      if (meta) meta.textContent = "尚未调用";
      if (modes) modes.style.display = "none";
      if (copyBtn) copyBtn.style.display = "none";
      if (body) {
        body.innerHTML = '<div class="pg-empty-state">' +
          '<div class="pg-empty-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>' +
          '<div class="pg-empty-title">结果已清空</div>' +
          '<div class="pg-empty-desc">在左侧输入搜索关键词并点击「运行搜索」即可重新发起检索。</div>' +
        '</div>';
      }
    });
  }

  // Search copy result button
  var searchCopyBtn = document.getElementById("pg-search-copy-btn");
  if (searchCopyBtn) {
    searchCopyBtn.addEventListener("click", function () {
      if (!searchLastResult) return;
      var textToCopy = (searchViewMode === "raw" || !searchLastResult.formattedText)
        ? (searchLastResult.rawJson || searchLastResult.rawText || "")
        : searchLastResult.formattedText;
      copyText(textToCopy).then(function (ok) {
        var orig = searchCopyBtn.innerHTML;
        searchCopyBtn.innerHTML = '<span>' + (ok ? "已复制 ✓" : "复制失败") + '</span>';
        setTimeout(function () { searchCopyBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  // Search abort button
  var searchAbortBtn = document.getElementById("pg-search-abort");
  if (searchAbortBtn) {
    searchAbortBtn.addEventListener("click", function () {
      if (searchAbort) {
        searchAbort.abort();
        searchAbort = null;
        if (searchTimer) { clearInterval(searchTimer); searchTimer = null; }
        var runBtn = document.getElementById("pg-search-run");
        if (runBtn) runBtn.disabled = false;
        searchAbortBtn.style.display = "none";
        setSearchHint("搜索请求已手动取消");
        var meta = document.getElementById("pg-search-meta");
        if (meta) meta.innerHTML = '<span class="status-tag bad">ABORTED</span>';
        var body = document.getElementById("pg-search-body");
        if (body) body.innerHTML = '<div class="status-pill bad" style="margin-bottom:12px;">用户已手动取消搜索请求</div>';
      }
    });
  }

  function setSearchHint(msg) {
    var h = document.getElementById("pg-search-hint");
    if (h) h.textContent = msg;
  }

  // Search form submit
  var searchForm = document.getElementById("pg-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch();
    });
  }

  function runSearch() {
    var query = (searchQueryInput && searchQueryInput.value.trim()) || "";
    if (!query) {
      setSearchHint("请输入搜索查询词");
      if (searchQueryInput) searchQueryInput.focus();
      return;
    }

    if (searchAbort) searchAbort.abort();
    searchAbort = new AbortController();
    var t0 = Date.now();

    var runBtn = document.getElementById("pg-search-run");
    var abortBtn = document.getElementById("pg-search-abort");
    var meta = document.getElementById("pg-search-meta");
    var body = document.getElementById("pg-search-body");
    var copyBtn = document.getElementById("pg-search-copy-btn");
    var viewModes = document.getElementById("pg-search-view-modes");

    if (runBtn) runBtn.disabled = true;
    if (abortBtn) abortBtn.style.display = "inline-flex";
    if (copyBtn) copyBtn.style.display = "none";
    if (viewModes) viewModes.style.display = "none";

    setSearchHint("正在调用 POST /mcp (search_web)…");
    if (meta) meta.innerHTML = '<span class="status-tag ok" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: rgba(99, 102, 241, 0.4);">RUNNING</span>';

    if (body) {
      body.innerHTML = '<div class="pg-loading-state">' +
        '<div class="pg-spinner"></div>' +
        '<div style="font-weight: 600; color: #fff;">正在执行 Google 联网检索…</div>' +
        '<div class="pg-loading-timer" id="pg-search-live-timer">0.0s</div>' +
        '<div class="hint-text" style="font-size: 12px;">方法: tools/call · 工具: search_web</div>' +
      '</div>';
    }

    if (searchTimer) clearInterval(searchTimer);
    searchTimer = setInterval(function () {
      var elapsed = ((Date.now() - t0) / 1000).toFixed(1) + "s";
      setSearchHint("搜索中… " + elapsed);
      var timerEl = document.getElementById("pg-search-live-timer");
      if (timerEl) timerEl.textContent = elapsed;
    }, 100);

    var args = { query: query };
    var payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: "search_web", arguments: args }
    };

    fetch("/mcp", {
      method: "POST",
      headers: mcpHeadersForTool(),
      body: JSON.stringify(payload),
      signal: searchAbort.signal
    }).then(function (r) {
      return r.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (e) { json = null; }
        return { okHttp: r.ok, status: r.status, text: text, json: json };
      });
    }).then(function (res) {
      finishSearch(t0, payload, res, args);
    }).catch(function (err) {
      if (err && err.name === "AbortError") return;
      finishSearch(t0, payload, { okHttp: false, status: 0, text: String(err && err.message || err), json: null }, args);
    });
  }

  function finishSearch(t0, payload, res, args) {
    if (searchTimer) { clearInterval(searchTimer); searchTimer = null; }
    var ms = Date.now() - t0;
    var runBtn = document.getElementById("pg-search-run");
    var abortBtn = document.getElementById("pg-search-abort");
    var copyBtn = document.getElementById("pg-search-copy-btn");
    var viewModes = document.getElementById("pg-search-view-modes");

    if (runBtn) runBtn.disabled = false;
    if (abortBtn) abortBtn.style.display = "none";
    if (copyBtn) copyBtn.style.display = "inline-flex";
    if (viewModes) viewModes.style.display = "flex";

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

    setSearchHint(isError ? "搜索失败 · 耗时 " + fmtMsJs(ms) : "搜索成功 · 耗时 " + fmtMsJs(ms));
    var meta = document.getElementById("pg-search-meta");
    if (meta) {
      meta.innerHTML = '<span class="status-tag ' + (isError ? "bad" : "ok") + '">' +
        (isError ? "ERR" : "200 OK") + '</span> <span class="mono" style="margin-left: 4px;">⚡ ' + fmtMsJs(ms) + '</span>';
    }

    var prettyJson = rpc ? JSON.stringify(rpc, null, 2) : res.text;
    var content = rpc && rpc.result && Array.isArray(rpc.result.content) ? rpc.result.content : [];
    var texts = [];
    content.forEach(function (c) {
      if (c && c.type === "text" && c.text) texts.push(c.text);
    });

    searchLastResult = {
      rpc: rpc,
      rawText: res.text,
      rawJson: prettyJson,
      isError: isError,
      errMsg: errMsg,
      texts: texts,
      formattedText: texts.join("\\n\\n")
    };

    var body = document.getElementById("pg-search-body");
    if (body) body.innerHTML = renderSearchBody(searchLastResult);
    bindCodeCopyButtons();

    searchHistory.unshift({
      tool: "search_web",
      label: args.query || "",
      args: args,
      result: searchLastResult,
      ok: !isError,
      ms: ms,
      time: Date.now()
    });
    if (searchHistory.length > 8) searchHistory.length = 8;
    renderSearchHistory();
  }

  function renderSearchBody(res) {
    if (searchViewMode === "raw") {
      var highlighted = syntaxHighlightJson(res.rawJson || res.rawText || "");
      return '<div class="pg-json-view"><pre><code>' + highlighted + '</code></pre></div>';
    }
    var html = "";
    if (res.isError) {
      html += '<div class="status-pill bad" style="margin-bottom:14px; width: 100%; border-radius: 8px; padding: 10px 14px; font-size: 13px;">' +
        '<span style="font-weight: 700; margin-right: 6px;">❌ 检索出错:</span> ' + escapeHtmlJs(String(res.errMsg || "未知错误")) +
      '</div>';
    }
    if (res.texts && res.texts.length) {
      html += renderMarkdown(res.texts.join("\\n\\n"));
    } else if (!res.isError) {
      html += '<div class="hint-text" style="padding: 20px 0; text-align: center;">搜索完成，未返回文本结果。</div>';
    }
    return html;
  }

  function renderSearchHistory() {
    var el = document.getElementById("pg-search-history");
    var clearBtn = document.getElementById("pg-search-clear-history");
    if (!el) return;
    if (clearBtn) clearBtn.style.display = searchHistory.length ? "inline-flex" : "none";
    if (!searchHistory.length) {
      el.innerHTML = '<span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无搜索调试记录</span>';
      return;
    }
    el.innerHTML = searchHistory.map(function (h, idx) {
      var q = h.label.length > 30 ? h.label.slice(0, 30) + "…" : h.label;
      var statusClass = h.ok ? "ok" : "bad";
      return '<div class="pg-hist-item ' + statusClass + '" data-search-hist-idx="' + idx + '" title="点击回填此记录">' +
        '<span class="pg-hist-dot ' + statusClass + '"></span>' +
        '<span>' + escapeHtmlJs(q || "—") + '</span>' +
        '<span style="color: var(--text-dim); font-size: 10.5px;">' + fmtMsJs(h.ms) + '</span>' +
      '</div>';
    }).join("");

    el.querySelectorAll("[data-search-hist-idx]").forEach(function (item) {
      item.addEventListener("click", function () {
        var idx = Number(item.getAttribute("data-search-hist-idx") || "0");
        var h = searchHistory[idx];
        if (!h) return;
        if (searchQueryInput && h.args) {
          searchQueryInput.value = h.args.query || "";
          updateSearchCharCount();
        }
        if (h.result) {
          searchLastResult = h.result;
          var body = document.getElementById("pg-search-body");
          var meta = document.getElementById("pg-search-meta");
          var copyBtn = document.getElementById("pg-search-copy-btn");
          var viewModes = document.getElementById("pg-search-view-modes");
          if (copyBtn) copyBtn.style.display = "inline-flex";
          if (viewModes) viewModes.style.display = "flex";
          if (meta) {
            meta.innerHTML = '<span class="status-tag ' + (h.ok ? "ok" : "bad") + '">' +
              (h.ok ? "200 OK" : "ERR") + '</span> <span class="mono" style="margin-left: 4px;">⚡ ' + fmtMsJs(h.ms) + '</span>';
          }
          if (body) body.innerHTML = renderSearchBody(h.result);
          bindCodeCopyButtons();
        }
        setSearchHint("已回填历史搜索");
      });
    });
  }

  var searchClearHistBtn = document.getElementById("pg-search-clear-history");
  if (searchClearHistBtn) {
    searchClearHistBtn.addEventListener("click", function () {
      searchHistory = [];
      renderSearchHistory();
    });
  }


  /* =========================================================================
     GENERATE_IMAGE CONTROLLER
     ========================================================================= */
  var imagePromptInput = document.getElementById("pg-image-prompt");
  var imageNameInput = document.getElementById("pg-image-name");
  var imageUrlsInput = document.getElementById("pg-image-urls");
  var imageAspectSelect = document.getElementById("pg-image-aspect");
  var imageDrop = document.getElementById("pg-image-drop");
  var imageFileInput = document.getElementById("pg-image-files");

  // Preset prompt fillers
  document.querySelectorAll("[data-fill-image-prompt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = btn.getAttribute("data-fill-image-prompt") || "";
      if (imagePromptInput) {
        imagePromptInput.value = p;
        imagePromptInput.focus();
      }
    });
  });

  // Aspect ratio pill selector
  var ratioButtons = document.querySelectorAll(".pg-ratio-btn");
  ratioButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = btn.getAttribute("data-ratio") || "1:1";
      if (imageAspectSelect) imageAspectSelect.value = r;
      ratioButtons.forEach(function (b) {
        if (b.getAttribute("data-ratio") === r) b.classList.add("active");
        else b.classList.remove("active");
      });
    });
  });
  if (imageAspectSelect) {
    imageAspectSelect.addEventListener("change", function () {
      var r = imageAspectSelect.value;
      ratioButtons.forEach(function (b) {
        if (b.getAttribute("data-ratio") === r) b.classList.add("active");
        else b.classList.remove("active");
      });
    });
  }

  // File upload management for images
  function addImageFiles(fileList) {
    if (!fileList || !fileList.length) return;
    for (var i = 0; i < fileList.length; i++) {
      if (imageFiles.length >= 3) {
        setImageHint("参考图最多添加 3 张");
        break;
      }
      (function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var res = e.target.result;
          var comma = res.indexOf(",");
          var base64 = comma >= 0 ? res.slice(comma + 1) : res;
          imageFiles.push({
            name: file.name,
            mimeType: file.type || "image/jpeg",
            data: base64,
            dataUrl: res
          });
          renderImageFileList();
        };
        reader.readAsDataURL(file);
      })(fileList[i]);
    }
  }

  function renderImageFileList() {
    var list = document.getElementById("pg-image-file-list");
    if (!list) return;
    list.innerHTML = imageFiles.map(function (f, idx) {
      return '<div class="pg-file">' +
        '<img class="thumb" src="' + f.dataUrl + '" alt="preview">' +
        '<span class="name">' + escapeHtmlJs(f.name) + '</span>' +
        '<button type="button" data-del-img-idx="' + idx + '" title="删除此参考图">✕</button>' +
      '</div>';
    }).join("");

    list.querySelectorAll("[data-del-img-idx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.getAttribute("data-del-img-idx") || "0");
        imageFiles.splice(idx, 1);
        renderImageFileList();
      });
    });
  }

  if (imageDrop && imageFileInput) {
    imageDrop.addEventListener("click", function () { imageFileInput.click(); });
    imageDrop.addEventListener("dragover", function (e) {
      e.preventDefault();
      imageDrop.classList.add("drag");
    });
    imageDrop.addEventListener("dragleave", function () { imageDrop.classList.remove("drag"); });
    imageDrop.addEventListener("drop", function (e) {
      e.preventDefault();
      imageDrop.classList.remove("drag");
      addImageFiles(e.dataTransfer && e.dataTransfer.files);
    });
    imageFileInput.addEventListener("change", function () {
      addImageFiles(imageFileInput.files);
      imageFileInput.value = "";
    });
  }

  // Image reset button
  var imageResetBtn = document.getElementById("pg-image-reset");
  if (imageResetBtn) {
    imageResetBtn.addEventListener("click", function () {
      if (imagePromptInput) imagePromptInput.value = "";
      if (imageNameInput) imageNameInput.value = "";
      if (imageUrlsInput) imageUrlsInput.value = "";
      imageFiles = [];
      renderImageFileList();
      setImageHint("生图表单已重置");
    });
  }

  // Image view mode toggle
  document.querySelectorAll("[data-image-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      imageViewMode = btn.getAttribute("data-image-mode") || "rendered";
      document.querySelectorAll("[data-image-mode]").forEach(function (b) {
        if (b === btn) b.classList.add("active");
        else b.classList.remove("active");
      });
      if (imageLastResult) {
        var body = document.getElementById("pg-image-body");
        if (body) body.innerHTML = renderImageBody(imageLastResult);
      }
    });
  });

  // Image clear console button
  var imageClearBtn = document.getElementById("pg-image-clear-btn");
  if (imageClearBtn) {
    imageClearBtn.addEventListener("click", function () {
      imageLastResult = null;
      var body = document.getElementById("pg-image-body");
      var meta = document.getElementById("pg-image-meta");
      var copyBtn = document.getElementById("pg-image-copy-btn");
      var modes = document.getElementById("pg-image-view-modes");
      if (meta) meta.textContent = "尚未生成";
      if (modes) modes.style.display = "none";
      if (copyBtn) copyBtn.style.display = "none";
      if (body) {
        body.innerHTML = '<div class="pg-empty-state">' +
          '<div class="pg-empty-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>' +
          '<div class="pg-empty-title">结果已清空</div>' +
          '<div class="pg-empty-desc">在左侧输入画面描述并点击「生成图片」即可发起生成。</div>' +
        '</div>';
      }
    });
  }

  // Image copy result button
  var imageCopyBtn = document.getElementById("pg-image-copy-btn");
  if (imageCopyBtn) {
    imageCopyBtn.addEventListener("click", function () {
      if (!imageLastResult) return;
      var textToCopy = (imageViewMode === "raw" || !imageLastResult.formattedText)
        ? (imageLastResult.rawJson || imageLastResult.rawText || "")
        : imageLastResult.formattedText;
      copyText(textToCopy).then(function (ok) {
        var orig = imageCopyBtn.innerHTML;
        imageCopyBtn.innerHTML = '<span>' + (ok ? "已复制 ✓" : "复制失败") + '</span>';
        setTimeout(function () { imageCopyBtn.innerHTML = orig; }, 2000);
      });
    });
  }

  // Image abort button
  var imageAbortBtn = document.getElementById("pg-image-abort");
  if (imageAbortBtn) {
    imageAbortBtn.addEventListener("click", function () {
      if (imageAbort) {
        imageAbort.abort();
        imageAbort = null;
        if (imageTimer) { clearInterval(imageTimer); imageTimer = null; }
        var runBtn = document.getElementById("pg-image-run");
        if (runBtn) runBtn.disabled = false;
        imageAbortBtn.style.display = "none";
        setImageHint("生图请求已手动取消");
        var meta = document.getElementById("pg-image-meta");
        if (meta) meta.innerHTML = '<span class="status-tag bad">ABORTED</span>';
        var body = document.getElementById("pg-image-body");
        if (body) body.innerHTML = '<div class="status-pill bad" style="margin-bottom:12px;">用户已手动取消生图请求</div>';
      }
    });
  }

  function setImageHint(msg) {
    var h = document.getElementById("pg-image-hint");
    if (h) h.textContent = msg;
  }

  // Image form submit
  var imageForm = document.getElementById("pg-image-form");
  if (imageForm) {
    imageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      runImage();
    });
  }

  function runImage() {
    var prompt = (imagePromptInput && imagePromptInput.value.trim()) || "";
    if (!prompt) {
      setImageHint("请输入画面描述提示词 (prompt)");
      if (imagePromptInput) imagePromptInput.focus();
      return;
    }

    var args = { prompt: prompt };
    var nameVal = imageNameInput ? imageNameInput.value.trim() : "";
    if (nameVal) args.image_name = nameVal;

    var ratioVal = imageAspectSelect ? imageAspectSelect.value : "1:1";
    if (ratioVal) args.aspect_ratio = ratioVal;

    var urlLines = imageUrlsInput ? imageUrlsInput.value.split("\\n").map(function (s) { return s.trim(); }).filter(Boolean) : [];
    if (urlLines.length) args.image_urls = urlLines;

    if (imageFiles.length) {
      args.images = imageFiles.map(function (f) {
        return { data: f.data, mimeType: f.mimeType };
      });
    }

    if (imageAbort) imageAbort.abort();
    imageAbort = new AbortController();
    var t0 = Date.now();

    var runBtn = document.getElementById("pg-image-run");
    var abortBtn = document.getElementById("pg-image-abort");
    var meta = document.getElementById("pg-image-meta");
    var body = document.getElementById("pg-image-body");
    var copyBtn = document.getElementById("pg-image-copy-btn");
    var viewModes = document.getElementById("pg-image-view-modes");

    if (runBtn) runBtn.disabled = true;
    if (abortBtn) abortBtn.style.display = "inline-flex";
    if (copyBtn) copyBtn.style.display = "none";
    if (viewModes) viewModes.style.display = "none";

    setImageHint("正在调用 POST /mcp (generate_image)…");
    if (meta) meta.innerHTML = '<span class="status-tag ok" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: rgba(99, 102, 241, 0.4);">RUNNING</span>';

    if (body) {
      body.innerHTML = '<div class="pg-loading-state">' +
        '<div class="pg-spinner"></div>' +
        '<div style="font-weight: 600; color: #fff;">正在执行 Imagen 3 生图（通常需 5-15 秒）…</div>' +
        '<div class="pg-loading-timer" id="pg-image-live-timer">0.0s</div>' +
        '<div class="hint-text" style="font-size: 12px;">方法: tools/call · 工具: generate_image · 比例: ' + escapeHtmlJs(ratioVal) + '</div>' +
      '</div>';
    }

    if (imageTimer) clearInterval(imageTimer);
    imageTimer = setInterval(function () {
      var elapsed = ((Date.now() - t0) / 1000).toFixed(1) + "s";
      setImageHint("生图中… " + elapsed);
      var timerEl = document.getElementById("pg-image-live-timer");
      if (timerEl) timerEl.textContent = elapsed;
    }, 100);

    var payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: "generate_image", arguments: args }
    };

    fetch("/mcp", {
      method: "POST",
      headers: mcpHeadersForTool(),
      body: JSON.stringify(payload),
      signal: imageAbort.signal
    }).then(function (r) {
      return r.text().then(function (text) {
        var json = null;
        try { json = JSON.parse(text); } catch (e) { json = null; }
        return { okHttp: r.ok, status: r.status, text: text, json: json };
      });
    }).then(function (res) {
      finishImage(t0, payload, res, args);
    }).catch(function (err) {
      if (err && err.name === "AbortError") return;
      finishImage(t0, payload, { okHttp: false, status: 0, text: String(err && err.message || err), json: null }, args);
    });
  }

  function finishImage(t0, payload, res, args) {
    if (imageTimer) { clearInterval(imageTimer); imageTimer = null; }
    var ms = Date.now() - t0;
    var runBtn = document.getElementById("pg-image-run");
    var abortBtn = document.getElementById("pg-image-abort");
    var copyBtn = document.getElementById("pg-image-copy-btn");
    var viewModes = document.getElementById("pg-image-view-modes");

    if (runBtn) runBtn.disabled = false;
    if (abortBtn) abortBtn.style.display = "none";
    if (copyBtn) copyBtn.style.display = "inline-flex";
    if (viewModes) viewModes.style.display = "flex";

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

    setImageHint(isError ? "生图失败 · 耗时 " + fmtMsJs(ms) : "生图成功 · 耗时 " + fmtMsJs(ms));
    var meta = document.getElementById("pg-image-meta");
    if (meta) {
      meta.innerHTML = '<span class="status-tag ' + (isError ? "bad" : "ok") + '">' +
        (isError ? "ERR" : "200 OK") + '</span> <span class="mono" style="margin-left: 4px;">⚡ ' + fmtMsJs(ms) + '</span>';
    }

    var prettyJson = rpc ? JSON.stringify(truncatePgJson(rpc), null, 2) : res.text;
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

    imageLastResult = {
      rpc: rpc,
      rawText: res.text,
      rawJson: prettyJson,
      isError: isError,
      errMsg: errMsg,
      texts: texts,
      images: images,
      formattedText: texts.join("\\n\\n")
    };

    var body = document.getElementById("pg-image-body");
    if (body) body.innerHTML = renderImageBody(imageLastResult);
    bindCodeCopyButtons();

    imageHistory.unshift({
      tool: "generate_image",
      label: args.prompt || "",
      args: args,
      result: imageLastResult,
      ok: !isError,
      ms: ms,
      time: Date.now()
    });
    if (imageHistory.length > 8) imageHistory.length = 8;
    renderImageHistory();
  }

  function renderImageBody(res) {
    if (imageViewMode === "raw") {
      var highlighted = syntaxHighlightJson(res.rawJson || res.rawText || "");
      return '<div class="pg-json-view"><pre><code>' + highlighted + '</code></pre></div>';
    }
    var html = "";
    if (res.isError) {
      html += '<div class="status-pill bad" style="margin-bottom:14px; width: 100%; border-radius: 8px; padding: 10px 14px; font-size: 13px;">' +
        '<span style="font-weight: 700; margin-right: 6px;">❌ 生图出错:</span> ' + escapeHtmlJs(String(res.errMsg || "未知错误")) +
      '</div>';
    }
    if (res.images && res.images.length) {
      html += '<div class="pg-images-grid">' + res.images.map(function (img, i) {
        var src = "data:" + img.mimeType + ";base64," + img.data;
        var ext = img.mimeType === "image/png" ? "png" : "jpg";
        var downloadName = "image_" + (i + 1) + "." + ext;
        return '<div class="pg-img-card">' +
          '<div class="pg-img-preview">' +
            '<a href="' + src + '" target="_blank" rel="noopener" title="点击查看大图">' +
              '<img alt="生成结果 ' + (i + 1) + '" src="' + src + '">' +
            '</a>' +
          '</div>' +
          '<div class="pg-img-meta">' +
            '<span class="pg-img-badge">图 #' + (i + 1) + ' · ' + img.mimeType + '</span>' +
            '<div class="pg-img-actions">' +
              '<a href="' + src + '" download="' + downloadName + '" class="pg-img-btn" title="保存到本地">下载</a>' +
              '<a href="' + src + '" target="_blank" rel="noopener" class="pg-img-btn" title="新标签打开">新窗口</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join("") + '</div>';
    }
    if (res.texts && res.texts.length) {
      html += '<div style="margin-top: 14px;">' + renderMarkdown(res.texts.join("\\n\\n")) + '</div>';
    } else if (!res.isError && (!res.images || !res.images.length)) {
      html += '<div class="hint-text" style="padding: 20px 0; text-align: center;">没有返回图片或文本内容。</div>';
    }
    return html;
  }

  function renderImageHistory() {
    var el = document.getElementById("pg-image-history");
    var clearBtn = document.getElementById("pg-image-clear-history");
    if (!el) return;
    if (clearBtn) clearBtn.style.display = imageHistory.length ? "inline-flex" : "none";
    if (!imageHistory.length) {
      el.innerHTML = '<span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无生图调试记录</span>';
      return;
    }
    el.innerHTML = imageHistory.map(function (h, idx) {
      var q = h.label.length > 30 ? h.label.slice(0, 30) + "…" : h.label;
      var statusClass = h.ok ? "ok" : "bad";
      return '<div class="pg-hist-item ' + statusClass + '" data-image-hist-idx="' + idx + '" title="点击回填此记录">' +
        '<span class="pg-hist-dot ' + statusClass + '"></span>' +
        '<span>' + escapeHtmlJs(q || "—") + '</span>' +
        '<span style="color: var(--text-dim); font-size: 10.5px;">' + fmtMsJs(h.ms) + '</span>' +
      '</div>';
    }).join("");

    el.querySelectorAll("[data-image-hist-idx]").forEach(function (item) {
      item.addEventListener("click", function () {
        var idx = Number(item.getAttribute("data-image-hist-idx") || "0");
        var h = imageHistory[idx];
        if (!h) return;
        if (h.args) {
          if (imagePromptInput) imagePromptInput.value = h.args.prompt || "";
          if (imageNameInput) imageNameInput.value = h.args.image_name || "";
          if (imageAspectSelect && h.args.aspect_ratio) {
            imageAspectSelect.value = h.args.aspect_ratio;
            ratioButtons.forEach(function (b) {
              if (b.getAttribute("data-ratio") === h.args.aspect_ratio) b.classList.add("active");
              else b.classList.remove("active");
            });
          }
        }
        if (h.result) {
          imageLastResult = h.result;
          var body = document.getElementById("pg-image-body");
          var meta = document.getElementById("pg-image-meta");
          var copyBtn = document.getElementById("pg-image-copy-btn");
          var viewModes = document.getElementById("pg-image-view-modes");
          if (copyBtn) copyBtn.style.display = "inline-flex";
          if (viewModes) viewModes.style.display = "flex";
          if (meta) {
            meta.innerHTML = '<span class="status-tag ' + (h.ok ? "ok" : "bad") + '">' +
              (h.ok ? "200 OK" : "ERR") + '</span> <span class="mono" style="margin-left: 4px;">⚡ ' + fmtMsJs(h.ms) + '</span>';
          }
          if (body) body.innerHTML = renderImageBody(h.result);
          bindCodeCopyButtons();
        }
        setImageHint("已回填历史生图记录");
      });
    });
  }

  var imageClearHistBtn = document.getElementById("pg-image-clear-history");
  if (imageClearHistBtn) {
    imageClearHistBtn.addEventListener("click", function () {
      imageHistory = [];
      renderImageHistory();
    });
  }


  /* =========================================================================
     GLOBAL SHORTCUTS & HELPERS
     ========================================================================= */
  // Ctrl+Enter or Cmd+Enter to run in active view
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      var searchView = document.getElementById("tools-subview-search_web");
      var imageView = document.getElementById("tools-subview-generate_image");
      if (searchView && searchView.classList.contains("active")) {
        e.preventDefault();
        runSearch();
      } else if (imageView && imageView.classList.contains("active")) {
        e.preventDefault();
        runImage();
      }
    }
  });

  function bindCodeCopyButtons() {
    document.querySelectorAll(".btn-copy-code").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-code") || "";
        copyText(code).then(function (ok) {
          var orig = btn.textContent;
          btn.textContent = ok ? "已复制 ✓" : "失败";
          setTimeout(function () { btn.textContent = orig; }, 2000);
        });
      });
    });
  }

  function syntaxHighlightJson(jsonStr) {
    var escaped = escapeHtmlJs(jsonStr);
    var reg = new RegExp('("(\\\\u[a-zA-Z0-9]{4}|\\\\[^u]|[^\\\\\\\\"])*"(\\\\s*:)?|\\\\b(true|false|null)\\\\b|-?\\\\d+(?:\\\\.\\\\d*)?(?:[eE][+\\\\-]?\\\\d+)?)', 'g');
    return escaped.replace(reg, function (match) {
      var cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  function renderMarkdown(md) {
    if (!md) return "";
    var codeBlocks = [];
    var lines = md.split("\\n");
    var outLines = [];
    var inCode = false;
    var codeLang = "";
    var codeLines = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.indexOf("\`\`\`") === 0) {
        if (!inCode) {
          inCode = true;
          codeLang = line.slice(3).trim() || "code";
          codeLines = [];
        } else {
          inCode = false;
          var placeholder = "___CODE_BLOCK_" + codeBlocks.length + "___";
          codeBlocks.push({ lang: codeLang, code: codeLines.join("\\n") });
          outLines.push(placeholder);
        }
        continue;
      }
      if (inCode) {
        codeLines.push(line);
      } else {
        outLines.push(line);
      }
    }
    if (inCode) {
      var ph = "___CODE_BLOCK_" + codeBlocks.length + "___";
      codeBlocks.push({ lang: codeLang, code: codeLines.join("\\n") });
      outLines.push(ph);
    }
    var text = outLines.join("\\n");
    text = escapeHtmlJs(text);

    text = text.replace(/^###### (.*)$/gm, '<h6 class="md-h6">$1</h6>');
    text = text.replace(/^##### (.*)$/gm, '<h5 class="md-h5">$1</h5>');
    text = text.replace(/^#### (.*)$/gm, '<h4 class="md-h4">$1</h4>');
    text = text.replace(/^### (.*)$/gm, '<h3 class="md-h3">$1</h3>');
    text = text.replace(/^## (.*)$/gm, '<h2 class="md-h2">$1</h2>');
    text = text.replace(/^# (.*)$/gm, '<h1 class="md-h1">$1</h1>');

    text = text.replace(/^(?:---|[*][*][*]|___)$/gm, '<hr class="md-hr">');
    text = text.replace(/^> (.*)$/gm, '<blockquote class="md-quote">$1</blockquote>');

    text = text.replace(/\`([^\`]+)\`/g, '<code class="md-inline-code">$1</code>');
    text = text.replace(/[*][*][*]([^*]+)[*][*][*]/g, '<strong><em>$1</em></strong>');
    text = text.replace(/[*][*]([^*]+)[*][*]/g, '<strong>$1</strong>');
    text = text.replace(/[*]([^*]+)[*]/g, '<em>$1</em>');
    text = text.replace(/\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1 <span class="ext-icon">↗</span></a>');

    text = text.replace(/^[-*] (.*)$/gm, '<li class="md-li">$1</li>');
    text = text.replace(/((?:<li class="md-li">.*?<\\/li>\\n?)+)/g, '<ul class="md-ul">$1</ul>');

    text = text.replace(/^\\d+[.] (.*)$/gm, '<li class="md-oli">$1</li>');
    text = text.replace(/((?:<li class="md-oli">.*?<\\/li>\\n?)+)/g, '<ol class="md-ol">$1</ol>');

    text = text.replace(/\\n\\n+/g, '</p><p class="md-p">');
    text = text.replace(/\\n/g, '<br>');
    text = '<div class="md-content"><p class="md-p">' + text + '</p></div>';

    text = text.replace(/<p class="md-p">\\s*<\\/(div|ul|ol|table|blockquote|h[1-6]|hr)>/g, '</$1>');
    text = text.replace(/<(div|ul|ol|table|blockquote|h[1-6]|hr)[^>]*>\\s*<\\/p>/g, function(m) { return m.replace('</p>', ''); });

    for (var k = 0; k < codeBlocks.length; k++) {
      var cb = codeBlocks[k];
      var cbHtml = '<div class="md-code-card">' +
        '<div class="md-code-head">' +
          '<span class="md-code-lang">' + escapeHtmlJs(cb.lang) + '</span>' +
          '<button type="button" class="btn-copy-code" data-code="' + escapeHtmlJs(cb.code) + '">复制</button>' +
        '</div>' +
        '<pre class="md-code-body"><code>' + escapeHtmlJs(cb.code) + '</code></pre>' +
      '</div>';
      text = text.replace("___CODE_BLOCK_" + k + "___", cbHtml);
    }

    return text;
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
`;
}
