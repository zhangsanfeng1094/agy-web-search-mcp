import { IMAGE_ASPECT_RATIOS } from "./image.ts";

const AUTH_STORAGE_KEY = "agy-mcp-auth-token";
const TOOL_STORAGE_KEY = "agy-landing-playground-tool";

export const PLAYGROUND_CSS = `
  /* Playground Main Container */
  .pg-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Status Items */
  .pg-status-items {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* Tool Selector Segmented Tabs */
  .pg-tool-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }
  .pg-tool-tab {
    position: relative;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 14px 16px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .pg-tool-tab:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: var(--border-highlight);
    transform: translateY(-1px);
  }
  .pg-tool-tab.active {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.45);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .pg-tool-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .pg-tool-tab.active .pg-tool-icon {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    box-shadow: 0 2px 8px var(--primary-glow);
  }
  .pg-tool-info {
    flex: 1;
    min-width: 0;
  }
  .pg-tool-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
    gap: 6px;
  }
  .pg-tool-title {
    font-family: var(--font-mono);
    font-size: 13.5px;
    font-weight: 650;
    color: #fff;
  }
  .pg-tool-badge {
    font-size: 10.5px;
    padding: 1px 6px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
    font-weight: 500;
  }
  .pg-tool-tab.active .pg-tool-badge {
    background: rgba(99, 102, 241, 0.25);
    color: #c7d2fe;
  }
  .pg-tool-desc {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.4;
  }

  /* Two Column Layout */
  .pg-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(380px, 1.25fr);
    gap: 20px;
    align-items: start;
  }

  /* Left Panel: Form Card */
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
    border-bottom: 1px solid var(--border-subtle);
    background: rgba(8, 12, 20, 0.4);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .pg-card-head-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #f1f5f9;
  }
  .pg-card-body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Form Fields */
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
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  .pg-field-head label {
    font-weight: 600;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pg-tag-req {
    font-size: 10px;
    font-weight: 600;
    color: #f87171;
    background: rgba(244, 63, 94, 0.12);
    border: 1px solid rgba(244, 63, 94, 0.25);
    padding: 1px 5px;
    border-radius: 4px;
  }
  .pg-tag-opt {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-dim);
    background: rgba(255, 255, 255, 0.05);
    padding: 1px 5px;
    border-radius: 4px;
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
    font-family: var(--font-sans);
    font-size: 13px;
    outline: none;
    margin: 0;
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
    color: #818cf8;
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
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
  }
  .pg-file img {
    width: 34px;
    height: 34px;
    object-fit: cover;
    border-radius: 6px;
    background: #000;
    border: 1px solid var(--border-subtle);
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

  /* Right Panel: Result Console */
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
    color: var(--text-dim);
    gap: 12px;
    flex: 1;
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
    margin-bottom: 4px;
  }
  .pg-empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .pg-empty-desc {
    font-size: 12.5px;
    max-width: 320px;
    line-height: 1.5;
  }

  /* Loading State */
  .pg-loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 16px;
    color: var(--text-muted);
    flex: 1;
  }
  .pg-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(99, 102, 241, 0.2);
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
    background: rgba(99, 102, 241, 0.12);
    padding: 3px 10px;
    border-radius: 9999px;
    border: 1px solid rgba(99, 102, 241, 0.25);
  }

  /* Rendered Content Styles */
  .md-content {
    font-size: 13.5px;
    line-height: 1.7;
    color: #e2e8f0;
  }
  .md-content .md-p {
    margin-bottom: 12px;
  }
  .md-content h1, .md-content .md-h1 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 18px 0 10px;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: 6px;
  }
  .md-content h2, .md-content .md-h2 {
    font-size: 16px;
    font-weight: 650;
    color: #f1f5f9;
    margin: 16px 0 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding-bottom: 4px;
  }
  .md-content h3, .md-content .md-h3 {
    font-size: 14.5px;
    font-weight: 600;
    color: #e2e8f0;
    margin: 14px 0 6px;
  }
  .md-content .md-ul, .md-content .md-ol {
    margin: 8px 0 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .md-content .md-li, .md-content .md-oli {
    color: #cbd5e1;
  }
  .md-content .md-inline-code {
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
    color: #38bdf8;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .md-content .md-link {
    color: #818cf8;
    text-decoration: none;
    border-bottom: 1px dashed rgba(129, 140, 248, 0.5);
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  .md-content .md-link:hover {
    color: #a5b4fc;
    border-bottom-style: solid;
  }
  .md-content .ext-icon {
    font-size: 10px;
    opacity: 0.8;
  }
  .md-content .md-quote {
    border-left: 3px solid #6366f1;
    background: rgba(99, 102, 241, 0.06);
    padding: 8px 14px;
    border-radius: 0 8px 8px 0;
    margin: 12px 0;
    color: #cbd5e1;
    font-style: italic;
  }
  .md-content .md-hr {
    border: 0;
    height: 1px;
    background: var(--border-subtle);
    margin: 16px 0;
  }

  /* Code Blocks */
  .md-code-card {
    background: #060911;
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    margin: 12px 0;
    overflow: hidden;
  }
  .md-code-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle);
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-dim);
  }
  .md-code-head button {
    background: transparent;
    border: 0;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .md-code-head button:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
  .md-code-body {
    padding: 12px 14px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.55;
    color: #f1f5f9;
  }

  /* Image Results */
  .pg-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
  .pg-img-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
  }
  .pg-img-card:hover {
    border-color: #818cf8;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .pg-img-preview {
    position: relative;
    aspect-ratio: 1 / 1;
    background: #000;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pg-img-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }
  .pg-img-card:hover .pg-img-preview img {
    transform: scale(1.03);
  }
  .pg-img-meta {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-subtle);
    background: rgba(8, 12, 20, 0.6);
  }
  .pg-img-badge {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
  .pg-img-actions {
    display: flex;
    gap: 6px;
  }
  .pg-img-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 11px;
    text-decoration: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s;
  }
  .pg-img-btn:hover {
    background: #6366f1;
    color: #fff;
    border-color: #6366f1;
  }

  /* JSON Syntax Highlighting */
  .pg-json-view {
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.6;
    color: #f1f5f9;
    background: #060911;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--border-subtle);
    overflow: auto;
    max-height: 560px;
  }
  .json-key { color: #38bdf8; }
  .json-string { color: #a7f3d0; }
  .json-number { color: #fbcfe8; }
  .json-boolean { color: #fde68a; }
  .json-null { color: #94a3b8; }

  /* Execution History */
  .pg-history-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pg-history-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
  }
  .pg-history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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

export function playgroundHtml(authRequired: boolean): string {
  const ratios = IMAGE_ASPECT_RATIOS.map(
    (r) => `<option value="${r}"${r === "1:1" ? " selected" : ""}>${r}</option>`,
  ).join("");

  const authField = authRequired
    ? `<div class="pg-field">
        <div class="pg-field-head">
          <label for="pg-auth">MCP_AUTH_TOKEN <span class="pg-tag-req">Bearer 保护</span></label>
          <span class="pg-help">仅存本地浏览器</span>
        </div>
        <input id="pg-auth" type="password" autocomplete="off" placeholder="输入部署时设定的 MCP_AUTH_TOKEN">
        <p class="pg-help">用于 /mcp 请求鉴权，不会上报至第三方。</p>
      </div>`
    : "";

  return `<div class="pg-container">
    <!-- Header Card -->
    <div class="section-card" style="margin-bottom: 0;">
      <div class="card-header" style="margin-bottom: 12px;">
        <h2>
          <span class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </span>
          工具测试与调试控制台
        </h2>
        <div class="pg-status-items">
          <span class="status-pill ok" id="pg-session-pill"><span class="pulse-dot"></span>Google Session</span>
          <span class="endpoint-pill"><span class="method">POST</span> /mcp</span>
        </div>
      </div>
      <p class="hint-text">
        直接向当前 MCP 服务的 <code>POST /mcp</code> 发送 <code>tools/call</code> JSON-RPC 请求，实时验证搜索检索质量与 Imagen 3 生图效果。
      </p>
    </div>

    <!-- Tool Selector Tabs -->
    <div class="pg-tool-tabs" id="pg-picks">
      <div class="pg-tool-tab active" data-tool="search_web">
        <div class="pg-tool-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="pg-tool-info">
          <div class="pg-tool-top">
            <span class="pg-tool-title">search_web</span>
            <span class="pg-tool-badge">实时网页搜索</span>
          </div>
          <div class="pg-tool-desc">Google 联网检索，支持新闻事实与技术文档查询</div>
        </div>
      </div>
      <div class="pg-tool-tab" data-tool="generate_image">
        <div class="pg-tool-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </div>
        <div class="pg-tool-info">
          <div class="pg-tool-top">
            <span class="pg-tool-title">generate_image</span>
            <span class="pg-tool-badge">Imagen 3 绘图</span>
          </div>
          <div class="pg-tool-desc">高质量图像生成、比例调整与参考图垫图修改</div>
        </div>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="pg-layout">
      <!-- Left Panel: Request Parameters -->
      <div class="pg-card">
        <div class="pg-card-head">
          <span class="pg-card-head-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            请求参数配置
          </span>
          <button type="button" class="pg-tool-btn" id="pg-reset-btn" title="清空表单内容">清空重置</button>
        </div>
        <div class="pg-card-body">
          <form id="pg-form" class="pg-form" autocomplete="off">
            ${authField}

            <!-- search_web fields -->
            <div id="pg-fields-search_web">
              <div class="pg-field">
                <div class="pg-field-head">
                  <label for="pg-query">搜索查询词 (query) <span class="pg-tag-req">必填</span></label>
                  <span class="pg-help" id="pg-query-count"></span>
                </div>
                <textarea id="pg-query" rows="4" placeholder="输入搜索关键词或问题，例如：2026 年 Cloudflare Workers 免费套餐限制"></textarea>
                <div class="pg-presets">
                  <span style="font-size: 11px; color: var(--text-dim); align-self: center; margin-right: 2px;">推荐示例:</span>
                  <button type="button" class="pg-preset-btn" data-fill-query="2026 年 Cloudflare Workers 免费套餐限制与配额">⚡ Cloudflare 配额</button>
                  <button type="button" class="pg-preset-btn" data-fill-query="Bun v1.3 新特性与性能对比解析">🚀 Bun 运行时新特性</button>
                  <button type="button" class="pg-preset-btn" data-fill-query="DeepSeek V3 架构解析与技术报告核心亮点">🧠 DeepSeek V3 架构</button>
                </div>
              </div>
            </div>

            <!-- generate_image fields -->
            <div id="pg-fields-generate_image" hidden>
              <div class="pg-field">
                <div class="pg-field-head">
                  <label for="pg-prompt">画面描述提示词 (prompt) <span class="pg-tag-req">必填</span></label>
                </div>
                <textarea id="pg-prompt" rows="3" placeholder="描述要生成的画面内容、艺术风格、光影色彩细节，或说明如何基于参考图修改"></textarea>
                <div class="pg-presets">
                  <span style="font-size: 11px; color: var(--text-dim); align-self: center; margin-right: 2px;">预设灵感:</span>
                  <button type="button" class="pg-preset-btn" data-fill-prompt="赛博朋克风格未来城市夜景，雨夜霓虹灯反光，电影级光影，8K 超清壁纸">🌆 赛博朋克城市</button>
                  <button type="button" class="pg-preset-btn" data-fill-prompt="可爱水彩风小猫咪戴着魔法巫师帽，身边漂浮着发光的魔法书，柔和治愈配色">🐱 魔法小猫</button>
                  <button type="button" class="pg-preset-btn" data-fill-prompt="极简扁平风格太空探索插画，宇航员遥望绚丽星系，科技未来感渐变色">🚀 极简深空</button>
                </div>
              </div>

              <div class="pg-field">
                <div class="pg-field-head">
                  <label for="pg-aspect">画幅比例 (aspect_ratio) <span class="pg-tag-opt">选填</span></label>
                  <select id="pg-aspect" style="display: none;">${ratios}</select>
                </div>
                <div class="pg-ratio-grid" id="pg-ratio-grid">
                  <button type="button" class="pg-ratio-btn active" data-ratio="1:1">1:1<span class="ratio-sub">正方形</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="16:9">16:9<span class="ratio-sub">宽幅横屏</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="9:16">9:16<span class="ratio-sub">手机竖屏</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="4:3">4:3<span class="ratio-sub">标准横版</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="3:4">3:4<span class="ratio-sub">海报竖版</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="3:2">3:2<span class="ratio-sub">摄影横幅</span></button>
                  <button type="button" class="pg-ratio-btn" data-ratio="2:3">2:3<span class="ratio-sub">经典竖幅</span></button>
                </div>
              </div>

              <div class="pg-field">
                <div class="pg-field-head">
                  <label for="pg-image-name">保存文件名前缀 (image_name) <span class="pg-tag-opt">选填</span></label>
                </div>
                <input id="pg-image-name" type="text" placeholder="例如：cyberpunk_city_night">
              </div>

              <div class="pg-ref-card">
                <div class="pg-field">
                  <div class="pg-field-head">
                    <label>本地参考图上传 (images) <span class="pg-tag-opt">选填，最多 3 张</span></label>
                    <span class="pg-help" id="pg-file-count">0/3</span>
                  </div>
                  <div class="pg-drop" id="pg-drop">
                    <span class="pg-drop-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </span>
                    <span>点击上传或将图片拖拽至此处</span>
                    <span style="font-size: 11px; color: var(--text-dim);">支持 PNG, JPG, WebP 格式（浏览器自动转为 base64）</span>
                  </div>
                  <input id="pg-files" type="file" accept="image/*" multiple hidden>
                  <div class="pg-files" id="pg-file-list"></div>
                </div>

                <div class="pg-field" style="margin-top: 4px;">
                  <div class="pg-field-head">
                    <label for="pg-image-urls">网络参考图链接 (image_urls) <span class="pg-tag-opt">选填</span></label>
                  </div>
                  <textarea id="pg-image-urls" rows="2" placeholder="每行一个 http(s) 链接，可填之前生成的 /files/... 链接"></textarea>
                </div>
              </div>
            </div>

            <!-- Action Row -->
            <div class="pg-run-row">
              <div class="pg-run-left">
                <button type="submit" class="btn" id="pg-run">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  <span>运行调用</span>
                  <span class="btn-shortcut">Ctrl+↵</span>
                </button>
                <button type="button" class="btn danger" id="pg-abort-btn" style="display: none;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"></rect></svg>
                  <span>终止</span>
                </button>
              </div>
              <span class="hint-text" id="pg-run-hint" style="font-family: var(--font-mono); font-size: 12px;"></span>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Panel: Response Console -->
      <div class="pg-console" id="pg-result">
        <div class="pg-console-head">
          <div class="pg-console-left">
            <span class="pg-console-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              调试响应结果
            </span>
            <span id="pg-result-meta" class="hint-text">尚未调用</span>
          </div>
          <div class="pg-console-actions">
            <div class="pg-view-modes" id="pg-view-modes" style="display: none;">
              <button type="button" class="pg-view-btn active" data-mode="rendered">格式化视图</button>
              <button type="button" class="pg-view-btn" data-mode="raw">原始 JSON</button>
            </div>
            <button type="button" class="pg-tool-btn" id="pg-copy-result-btn" title="复制结果" style="display: none;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>复制</span>
            </button>
            <button type="button" class="pg-tool-btn" id="pg-clear-result-btn" title="清空输出">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
        <div class="pg-console-body" id="pg-result-body">
          <div class="pg-empty-state">
            <div class="pg-empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <div class="pg-empty-title">等待发起工具调用</div>
            <div class="pg-empty-desc">
              在左侧配置测试参数，点击「运行调用」或按 <kbd style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;">Ctrl + Enter</kbd> 即可直接调用 MCP 服务。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Execution History -->
    <div class="pg-history-card">
      <div class="pg-history-head">
        <span style="display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          近期调用记录 (点击可回填参数与结果)
        </span>
        <button type="button" class="pg-tool-btn" id="pg-clear-history-btn" style="display: none;">清空记录</button>
      </div>
      <div class="pg-history-list" id="pg-history">
        <span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无调试调用记录</span>
      </div>
    </div>
  </div>`;
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
  var pgLastResult = null;
  var pgViewMode = "rendered";

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

  // Update session pill in playground header
  var sessionPill = document.getElementById("pg-session-pill");
  if (sessionPill) {
    if (currentRefreshToken) {
      sessionPill.className = "status-pill ok";
      sessionPill.innerHTML = '<span class="pulse-dot"></span>Google Session 有效';
    } else {
      sessionPill.className = "status-pill warn";
      sessionPill.innerHTML = '<span class="pulse-dot"></span>无 Google Session';
    }
  }

  function setPgTool(name) {
    pgTool = name === "generate_image" ? "generate_image" : "search_web";
    try { localStorage.setItem(PG_TOOL_KEY, pgTool); } catch (e) {}
    document.querySelectorAll(".pg-tool-tab").forEach(function (b) {
      if (b.getAttribute("data-tool") === pgTool) b.classList.add("active");
      else b.classList.remove("active");
    });
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

  document.querySelectorAll(".pg-tool-tab, .pg-pick").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setPgTool(btn.getAttribute("data-tool") || "search_web");
    });
  });
  document.querySelectorAll("[data-pg-tool]").forEach(function (el) {
    el.addEventListener("click", function () {
      setPgTool(el.getAttribute("data-pg-tool") || "search_web");
    });
  });

  // Character counter helper
  function updateCharCounts() {
    var q = document.getElementById("pg-query");
    var qc = document.getElementById("pg-query-count");
    if (q && qc) qc.textContent = q.value ? (q.value.length + " 字") : "";
  }
  var qInput = document.getElementById("pg-query");
  if (qInput) {
    qInput.addEventListener("input", updateCharCounts);
  }

  // Preset query fillers
  document.querySelectorAll("[data-fill-query]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.getAttribute("data-fill-query") || "";
      var input = document.getElementById("pg-query");
      if (input) {
        input.value = q;
        input.focus();
        updateCharCounts();
      }
    });
  });

  // Preset prompt fillers
  document.querySelectorAll("[data-fill-prompt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = btn.getAttribute("data-fill-prompt") || "";
      var input = document.getElementById("pg-prompt");
      if (input) {
        input.value = p;
        input.focus();
      }
    });
  });

  // Aspect ratio visual selector sync
  var aspectSelect = document.getElementById("pg-aspect");
  var ratioButtons = document.querySelectorAll(".pg-ratio-btn");
  ratioButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = btn.getAttribute("data-ratio") || "1:1";
      if (aspectSelect) aspectSelect.value = r;
      ratioButtons.forEach(function (b) {
        if (b.getAttribute("data-ratio") === r) b.classList.add("active");
        else b.classList.remove("active");
      });
    });
  });
  if (aspectSelect) {
    aspectSelect.addEventListener("change", function () {
      var r = aspectSelect.value;
      ratioButtons.forEach(function (b) {
        if (b.getAttribute("data-ratio") === r) b.classList.add("active");
        else b.classList.remove("active");
      });
    });
  }

  // View modes switch (Rendered vs Raw JSON)
  var viewModesContainer = document.getElementById("pg-view-modes");
  document.querySelectorAll(".pg-view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      pgViewMode = btn.getAttribute("data-mode") || "rendered";
      document.querySelectorAll(".pg-view-btn").forEach(function (b) {
        if (b === btn) b.classList.add("active");
        else b.classList.remove("active");
      });
      if (pgLastResult) {
        var body = document.getElementById("pg-result-body");
        if (body) body.innerHTML = renderPgBody(pgLastResult);
      }
    });
  });

  // Reset form button
  var resetBtn = document.getElementById("pg-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (pgTool === "search_web") {
        var qInput = document.getElementById("pg-query");
        if (qInput) qInput.value = "";
        updateCharCounts();
      } else {
        var pInput = document.getElementById("pg-prompt");
        if (pInput) pInput.value = "";
        var nInput = document.getElementById("pg-image-name");
        if (nInput) nInput.value = "";
        var uInput = document.getElementById("pg-image-urls");
        if (uInput) uInput.value = "";
        pgFiles = [];
        renderPgFiles();
      }
      setPgHint("表单已重置");
    });
  }

  // Clear result console
  var clearResultBtn = document.getElementById("pg-clear-result-btn");
  if (clearResultBtn) {
    clearResultBtn.addEventListener("click", function () {
      pgLastResult = null;
      var body = document.getElementById("pg-result-body");
      var meta = document.getElementById("pg-result-meta");
      var copyBtn = document.getElementById("pg-copy-result-btn");
      if (meta) meta.textContent = "尚未调用";
      if (viewModesContainer) viewModesContainer.style.display = "none";
      if (copyBtn) copyBtn.style.display = "none";
      if (body) {
        body.innerHTML = '<div class="pg-empty-state">' +
          '<div class="pg-empty-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></div>' +
          '<div class="pg-empty-title">结果已清空</div>' +
          '<div class="pg-empty-desc">在左侧配置参数并点击「运行调用」即可重新发起调试。</div>' +
        '</div>';
      }
    });
  }

  // Copy result action
  var copyResultBtn = document.getElementById("pg-copy-result-btn");
  if (copyResultBtn) {
    copyResultBtn.addEventListener("click", function () {
      if (!pgLastResult) return;
      var textToCopy = "";
      if (pgViewMode === "raw" || !pgLastResult.formattedText) {
        textToCopy = pgLastResult.rawJson || pgLastResult.rawText || "";
      } else {
        textToCopy = pgLastResult.formattedText;
      }
      copyText(textToCopy).then(function (ok) {
        var origHtml = copyResultBtn.innerHTML;
        copyResultBtn.innerHTML = '<span>' + (ok ? "已复制 ✓" : "复制失败") + '</span>';
        setTimeout(function () { copyResultBtn.innerHTML = origHtml; }, 2000);
      });
    });
  }

  // Abort running request
  var abortBtn = document.getElementById("pg-abort-btn");
  if (abortBtn) {
    abortBtn.addEventListener("click", function () {
      if (pgAbort) {
        pgAbort.abort();
        pgAbort = null;
        if (pgTimer) { clearInterval(pgTimer); pgTimer = null; }
        var runBtn = document.getElementById("pg-run");
        if (runBtn) runBtn.disabled = false;
        abortBtn.style.display = "none";
        setPgHint("调用已手动取消");
        var meta = document.getElementById("pg-result-meta");
        if (meta) meta.innerHTML = '<span class="status-tag bad">ABORTED</span>';
        var body = document.getElementById("pg-result-body");
        if (body) body.innerHTML = '<div class="status-pill bad" style="margin-bottom:12px;">用户已手动取消请求</div>';
      }
    });
  }

  // Clear history
  var clearHistoryBtn = document.getElementById("pg-clear-history-btn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", function () {
      pgHistory = [];
      renderPgHistory();
    });
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      var pgPanel = document.getElementById("view-playground");
      if (pgPanel && (pgPanel.classList.contains("active") || pgPanel.style.display !== "none")) {
        e.preventDefault();
        runPlayground();
      }
    }
  });

  // Drag & drop file management
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
      var kb = Math.round(file.size / 1024);
      pgFiles.push({ mimeType: m[1], data: m[2], name: file.name, sizeKb: kb, preview: url });
      renderPgFiles();
    };
    reader.readAsDataURL(file);
  }
  function renderPgFiles() {
    var list = document.getElementById("pg-file-list");
    var countEl = document.getElementById("pg-file-count");
    if (countEl) countEl.textContent = pgFiles.length + "/3";
    if (!list) return;
    if (!pgFiles.length) {
      list.innerHTML = "";
      return;
    }
    list.innerHTML = pgFiles.map(function (f, i) {
      var sizeText = f.sizeKb ? " (" + f.sizeKb + "KB)" : "";
      return '<div class="pg-file">' +
        '<img alt="" src="' + f.preview + '">' +
        '<span class="name">' + escapeHtmlJs(f.name) + sizeText + '</span>' +
        '<button type="button" data-rm="' + i + '">移除</button>' +
      '</div>';
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
      if (!q) throw new Error("搜索 query 不能为空");
      return { query: q };
    }
    var prompt = String((document.getElementById("pg-prompt") || {}).value || "").trim();
    if (!prompt) throw new Error("生图 prompt 不能为空");
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
    var abortBtn = document.getElementById("pg-abort-btn");
    var meta = document.getElementById("pg-result-meta");
    var body = document.getElementById("pg-result-body");
    var copyBtn = document.getElementById("pg-copy-result-btn");
    var viewModes = document.getElementById("pg-view-modes");

    if (runBtn) runBtn.disabled = true;
    if (abortBtn) abortBtn.style.display = "inline-flex";
    if (copyBtn) copyBtn.style.display = "none";
    if (viewModes) viewModes.style.display = "none";

    setPgHint("正在调用 POST /mcp …");
    if (meta) meta.innerHTML = '<span class="status-tag ok" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border-color: rgba(99, 102, 241, 0.4);">RUNNING</span>';
    
    var toolDesc = pgTool === "search_web" ? "正在执行 Google 联网检索…" : "正在执行 Imagen 3 画图（通常需 5-15 秒）…";
    if (body) {
      body.innerHTML = '<div class="pg-loading-state">' +
        '<div class="pg-spinner"></div>' +
        '<div style="font-weight: 600; color: #fff;">' + toolDesc + '</div>' +
        '<div class="pg-loading-timer" id="pg-live-timer">0.0s</div>' +
        '<div class="hint-text" style="font-size: 12px;">调用方法: tools/call · 工具: ' + escapeHtmlJs(pgTool) + '</div>' +
      '</div>';
    }

    if (pgTimer) clearInterval(pgTimer);
    pgTimer = setInterval(function () {
      var elapsed = ((Date.now() - t0) / 1000).toFixed(1) + "s";
      setPgHint("调用中… " + elapsed);
      var timerEl = document.getElementById("pg-live-timer");
      if (timerEl) timerEl.textContent = elapsed;
    }, 100);

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
    var abortBtn = document.getElementById("pg-abort-btn");
    var copyBtn = document.getElementById("pg-copy-result-btn");
    var viewModes = document.getElementById("pg-view-modes");

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

    setPgHint(isError ? "调用失败 · 耗时 " + fmtMsJs(ms) : "调用成功 · 耗时 " + fmtMsJs(ms));
    var meta = document.getElementById("pg-result-meta");
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

    pgLastResult = {
      rpc: rpc,
      rawText: res.text,
      rawJson: prettyJson,
      isError: isError,
      errMsg: errMsg,
      texts: texts,
      images: images,
      formattedText: texts.join("\\n\\n")
    };

    var body = document.getElementById("pg-result-body");
    if (body) body.innerHTML = renderPgBody(pgLastResult);

    // Bind copy buttons in code blocks
    bindCodeCopyButtons();

    var label = pgTool === "search_web" ? (args.query || "") : (args.prompt || "");
    pgHistory.unshift({
      tool: pgTool,
      label: label,
      args: args,
      result: pgLastResult,
      ok: !isError,
      ms: ms,
      time: Date.now()
    });
    if (pgHistory.length > 8) pgHistory.length = 8;
    renderPgHistory();
  }

  function renderPgBody(res) {
    if (pgViewMode === "raw") {
      var highlighted = syntaxHighlightJson(res.rawJson || res.rawText || "");
      return '<div class="pg-json-view"><pre><code>' + highlighted + '</code></pre></div>';
    }

    var html = "";
    if (res.isError) {
      html += '<div class="status-pill bad" style="margin-bottom:14px; width: 100%; border-radius: 8px; padding: 10px 14px; font-size: 13px;">' +
        '<span style="font-weight: 700; margin-right: 6px;">❌ 调用出错:</span> ' + escapeHtmlJs(String(res.errMsg || "未知错误")) +
      '</div>';
    }

    if (res.texts && res.texts.length) {
      html += renderMarkdown(res.texts.join("\\n\\n"));
    } else if (!res.isError && (!res.images || !res.images.length)) {
      html += '<div class="hint-text" style="padding: 20px 0; text-align: center;">没有返回文本内容。</div>';
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

    return html;
  }

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

  function renderPgHistory() {
    var el = document.getElementById("pg-history");
    var clearBtn = document.getElementById("pg-clear-history-btn");
    if (!el) return;
    if (clearBtn) clearBtn.style.display = pgHistory.length ? "inline-flex" : "none";
    if (!pgHistory.length) {
      el.innerHTML = '<span class="hint-text" style="font-size: 12px; padding: 4px 0;">暂无调试调用记录</span>';
      return;
    }
    el.innerHTML = pgHistory.map(function (h, idx) {
      var q = h.label.length > 32 ? h.label.slice(0, 32) + "…" : h.label;
      var statusClass = h.ok ? "ok" : "bad";
      return '<div class="pg-hist-item ' + statusClass + '" data-hist-idx="' + idx + '" title="点击回填此记录">' +
        '<span class="pg-hist-dot ' + statusClass + '"></span>' +
        '<span style="font-weight: 600; color: #fff;">' + escapeHtmlJs(h.tool) + '</span>' +
        '<span>' + escapeHtmlJs(q || "—") + '</span>' +
        '<span style="color: var(--text-dim); font-size: 10.5px;">' + fmtMsJs(h.ms) + '</span>' +
      '</div>';
    }).join("");

    el.querySelectorAll("[data-hist-idx]").forEach(function (item) {
      item.addEventListener("click", function () {
        var idx = Number(item.getAttribute("data-hist-idx") || "0");
        var h = pgHistory[idx];
        if (!h) return;
        setPgTool(h.tool);
        if (h.tool === "search_web") {
          var qEl = document.getElementById("pg-query");
          if (qEl && h.args) qEl.value = h.args.query || "";
          updateCharCounts();
        } else {
          var pEl = document.getElementById("pg-prompt");
          if (pEl && h.args) pEl.value = h.args.prompt || "";
          var nEl = document.getElementById("pg-image-name");
          if (nEl && h.args) nEl.value = h.args.image_name || "";
          var rEl = document.getElementById("pg-aspect");
          if (rEl && h.args && h.args.aspect_ratio) {
            rEl.value = h.args.aspect_ratio;
            ratioButtons.forEach(function (b) {
              if (b.getAttribute("data-ratio") === h.args.aspect_ratio) b.classList.add("active");
              else b.classList.remove("active");
            });
          }
        }
        if (h.result) {
          pgLastResult = h.result;
          var body = document.getElementById("pg-result-body");
          var meta = document.getElementById("pg-result-meta");
          var copyBtn = document.getElementById("pg-copy-result-btn");
          var viewModes = document.getElementById("pg-view-modes");
          if (copyBtn) copyBtn.style.display = "inline-flex";
          if (viewModes) viewModes.style.display = "flex";
          if (meta) {
            meta.innerHTML = '<span class="status-tag ' + (h.ok ? "ok" : "bad") + '">' +
              (h.ok ? "200 OK" : "ERR") + '</span> <span class="mono" style="margin-left: 4px;">⚡ ' + fmtMsJs(h.ms) + '</span>';
          }
          if (body) body.innerHTML = renderPgBody(h.result);
          bindCodeCopyButtons();
        }
        setPgHint("已回填记录: " + h.tool);
      });
    });
  }
`;
}
