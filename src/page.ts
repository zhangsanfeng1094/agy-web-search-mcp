import { generateImageToolDef, searchToolDef, SERVER_NAME, SERVER_VERSION } from "./mcp.ts";
import type { MetricsSnapshot } from "./metrics.ts";
import type { SessionSource } from "./types.ts";

const CSS = `
  :root {
    --bg-base: #080c14;
    --bg-sidebar: #0d121f;
    --bg-surface: rgba(17, 24, 39, 0.7);
    --bg-surface-elevated: rgba(30, 41, 59, 0.6);
    --bg-card: rgba(15, 23, 42, 0.75);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-highlight: rgba(255, 255, 255, 0.16);
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --primary-glow: rgba(99, 102, 241, 0.25);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --success: #10b981;
    --success-bg: rgba(16, 185, 129, 0.12);
    --success-border: rgba(16, 185, 129, 0.25);
    --danger: #f43f5e;
    --danger-bg: rgba(244, 63, 94, 0.12);
    --danger-border: rgba(244, 63, 94, 0.25);
    --warning: #f59e0b;
    --warning-bg: rgba(245, 158, 11, 0.12);
    --warning-border: rgba(245, 158, 11, 0.25);
    --code-bg: #0b0f19;
    --sidebar-width: 260px;
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-main);
    background-color: var(--bg-base);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.12), transparent 100%),
      radial-gradient(ellipse 60% 40% at 100% 20%, rgba(56, 189, 248, 0.06), transparent 100%),
      radial-gradient(ellipse 50% 30% at 0% 80%, rgba(139, 92, 246, 0.04), transparent 100%);
    background-attachment: fixed;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    display: flex;
  }

  /* App Layout */
  .app-layout {
    display: flex;
    width: 100%;
    min-height: 100vh;
  }

  /* Sidebar */
  aside.sidebar {
    width: var(--sidebar-width);
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 20px 16px;
    backdrop-filter: blur(16px);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px 24px;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 20px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px var(--primary-glow);
    flex-shrink: 0;
  }

  .brand-logo svg {
    width: 20px;
    height: 20px;
    color: #fff;
  }

  .brand-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-title .sub {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .version-pill {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 9999px;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  /* Nav items */
  nav.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .nav-group-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-dim);
    padding: 8px 10px 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 550;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }

  .nav-item:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  .nav-item.active {
    color: #fff;
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
  }

  .nav-item svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--text-dim);
    transition: color 0.15s;
  }

  .nav-item:hover svg, .nav-item.active svg {
    color: #818cf8;
  }

  .nav-item .badge-count {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
  }

  .nav-item.active .badge-count {
    background: rgba(99, 102, 241, 0.3);
    color: #c7d2fe;
  }

  /* Sidebar Footer */
  .sidebar-footer {
    padding-top: 16px;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .server-status-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .server-status-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11.5px;
    color: var(--text-dim);
  }

  /* Main Content Area */
  main.main-content {
    margin-left: var(--sidebar-width);
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: calc(100% - var(--sidebar-width));
  }

  /* Top Bar */
  header.top-bar {
    height: 64px;
    border-bottom: 1px solid var(--border-subtle);
    background: rgba(8, 12, 20, 0.65);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    gap: 16px;
  }

  .top-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-menu-btn {
    display: none;
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
  }

  .view-title {
    font-size: 16px;
    font-weight: 650;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .top-bar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .endpoint-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    padding: 6px 12px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-main);
  }

  .endpoint-pill .method {
    font-weight: 700;
    color: #38bdf8;
    font-size: 11px;
  }

  .copy-btn-mini {
    background: transparent;
    border: 0;
    color: var(--text-muted);
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;
  }
  .copy-btn-mini:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }

  /* View Panels */
  .content-body {
    padding: 32px;
    max-width: 1100px;
    width: 100%;
  }

  .view-panel {
    display: none;
  }

  .view-panel.active {
    display: block;
    animation: fadeIn 0.25s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Section Cards */
  .section-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
    transition: border-color 0.2s;
  }

  .section-card:hover {
    border-color: var(--border-highlight);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 12px;
  }

  h2 {
    font-size: 16px;
    font-weight: 650;
    letter-spacing: -0.01em;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-icon {
    color: #818cf8;
    display: inline-flex;
    align-items: center;
  }

  /* Status Badges */
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .status-pill.ok {
    background: var(--success-bg);
    color: #34d399;
    border: 1px solid var(--success-border);
  }

  .status-pill.bad {
    background: var(--danger-bg);
    color: #f87171;
    border: 1px solid var(--danger-border);
  }

  .status-pill.warn {
    background: var(--warning-bg);
    color: #fbbf24;
    border: 1px solid var(--warning-border);
  }

  .pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: currentColor;
    box-shadow: 0 0 8px currentColor;
    display: inline-block;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 0;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px var(--primary-glow);
    transition: all 0.15s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
    color: #fff;
  }

  .btn:active { transform: translateY(0); }

  .btn.ghost {
    background: rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    border: 1px solid var(--border-subtle);
    box-shadow: none;
  }

  .btn.ghost:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: var(--border-highlight);
  }

  .btn.danger {
    background: var(--danger-bg);
    color: #f87171;
    border: 1px solid var(--danger-border);
    box-shadow: none;
  }

  .btn.danger:hover {
    background: rgba(244, 63, 94, 0.2);
    color: #fff;
  }

  .btn-google {
    background: #ffffff;
    color: #1f2937;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .btn-google:hover {
    background: #f3f4f6;
    color: #111827;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  }

  /* Session & Login Section */
  .session-card-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 16px 20px;
  }

  .session-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .session-account-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-main);
  }

  .session-account-row .email {
    font-family: var(--font-mono);
    color: #34d399;
    font-weight: 600;
  }

  .session-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hint-text {
    font-size: 12.5px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Tabs */
  .tabs-nav {
    display: flex;
    gap: 6px;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 14px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .tab-btn {
    background: transparent;
    border: 0;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 13px;
    font-weight: 550;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tab-btn:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.04);
  }

  .tab-btn.active {
    color: #818cf8;
    background: rgba(99, 102, 241, 0.12);
    border-bottom: 2px solid #6366f1;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .code-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    background: var(--code-bg);
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid var(--border-subtle);
    font-size: 12px;
    color: var(--text-dim);
    font-family: var(--font-mono);
  }

  pre {
    padding: 16px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    color: #e2e8f0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: rgba(255, 255, 255, 0.07);
    padding: 2px 6px;
    border-radius: 4px;
    color: #e2e8f0;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin: 16px 0 18px;
  }

  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: transform 0.15s, border-color 0.15s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--border-highlight);
  }

  .stat-card .n {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
    color: #fff;
  }

  .stat-card .n.ok { color: #34d399; }
  .stat-card .n.bad { color: #f87171; }

  .stat-card .l {
    color: var(--text-muted);
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* Metrics Table */
  .table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid var(--border-subtle);
    margin-top: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }

  th {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-dim);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border-subtle);
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border-subtle);
    vertical-align: middle;
    color: var(--text-main);
  }

  tr:last-child td { border-bottom: 0; }
  tr:hover td { background: rgba(255, 255, 255, 0.02); }

  td.mono {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  td.q { word-break: break-word; }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .status-tag.ok { background: var(--success-bg); color: #34d399; }
  .status-tag.bad { background: var(--danger-bg); color: #f87171; }

  /* Tools List */
  .tools-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tool-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 18px 20px;
    transition: border-color 0.15s;
  }

  .tool-card:hover {
    border-color: var(--border-highlight);
  }

  .tool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .tool-name-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tool-name {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 700;
    color: #38bdf8;
  }

  .tool-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 9999px;
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.25);
    font-weight: 500;
  }

  .tool-summary {
    color: var(--text-muted);
    font-size: 13.5px;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .params-box {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 12px;
  }

  .params-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dim);
    margin-bottom: 8px;
  }

  .param-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .param-item:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .param-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .req {
    color: #f87171;
    font-size: 11px;
    font-weight: 600;
    background: var(--danger-bg);
    padding: 1px 6px;
    border-radius: 4px;
  }

  .opt {
    color: var(--text-dim);
    font-size: 11px;
    background: rgba(255, 255, 255, 0.05);
    padding: 1px 6px;
    border-radius: 4px;
  }

  .param-desc {
    color: var(--text-muted);
    font-size: 12.5px;
  }

  .returns-box {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12.5px;
    color: var(--text-muted);
    background: rgba(99, 102, 241, 0.05);
    border-left: 3px solid #6366f1;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
  }

  .returns-box .k {
    color: #818cf8;
    font-weight: 600;
    flex-shrink: 0;
  }

  /* Form & OAuth Views */
  .auth-card {
    max-width: 560px;
    margin: 60px auto;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 18px;
    padding: 36px 32px;
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
  }

  .auth-card h1 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
  }

  ol.step-list {
    margin: 20px 0;
    padding-left: 0;
    list-style: none;
    counter-reset: step-counter;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  ol.step-list li {
    counter-increment: step-counter;
    position: relative;
    padding-left: 36px;
    color: var(--text-muted);
    font-size: 13.5px;
  }

  ol.step-list li::before {
    content: counter(step-counter);
    position: absolute;
    left: 0;
    top: 0;
    width: 24px;
    height: 24px;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
  }

  textarea {
    width: 100%;
    min-height: 100px;
    background: var(--code-bg);
    color: var(--text-main);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: var(--font-mono);
    font-size: 13px;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    margin: 14px 0 18px;
  }

  textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
  }

  .form-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .muted { color: var(--text-muted); }
  .ok { color: #34d399; }
  .bad { color: #f87171; }
  a { color: #818cf8; text-decoration: none; }
  a:hover { text-decoration: underline; }

  @media (max-width: 820px) {
    aside.sidebar {
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 10px 0 30px rgba(0,0,0,0.5);
    }
    aside.sidebar.open {
      transform: translateX(0);
    }
    main.main-content {
      margin-left: 0;
      width: 100%;
    }
    .mobile-menu-btn {
      display: inline-flex;
    }
    header.top-bar {
      padding: 0 16px;
    }
    .content-body {
      padding: 20px 14px 60px;
    }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

export const SESSION_STORAGE_KEY = "agy-web-search-session";

export function landingHtml(opts: {
  session: SessionSource;
  authRequired: boolean;
  origin: string;
  oauthManual: boolean;
  metrics: MetricsSnapshot;
}): string {
  const sessionLabel = {
    env: "server env (AGY_REFRESH_TOKEN)",
    header: "request header",
    file: "local agy token file",
    missing: "missing — sign in with Google",
  }[opts.session];

  const prompt = agentConfigPrompt({
    origin: opts.origin,
    authRequired: opts.authRequired,
    refreshToken: undefined,
  });

  const hint = opts.oauthManual
    ? "agy 的 OAuth 客户端只能回调 localhost。授权后浏览器会打开一个打不开的页面，把地址栏完整 URL 贴回来即可。"
    : "本机回调会自动接住授权码，登录后 session 写进这个浏览器的 localStorage。";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${SERVER_NAME} · Streamable HTTP MCP</title>
  <style>${CSS}</style>
</head>
<body data-origin="${escapeHtml(opts.origin)}" data-auth="${opts.authRequired ? "1" : "0"}">
<div class="app-layout">

  <!-- Sidebar -->
  <aside class="sidebar" id="app-sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <path d="M11 8v6"></path>
          <path d="M8 11h6"></path>
        </svg>
      </div>
      <div class="brand-title">
        <span>${SERVER_NAME}</span>
        <span class="sub">
          MCP Server <span class="version-pill">${SERVER_VERSION}</span>
        </span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group-title">控制台导航</div>
      <a class="nav-item active" data-view="config" href="#config">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        <span>快速配置与 Prompt</span>
      </a>
      <a class="nav-item" data-view="tools" href="#tools">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        <span>工具列表</span>
        <span class="badge-count">2</span>
      </a>
      <a class="nav-item" data-view="metrics" href="#metrics">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <span>服务监控与日志</span>
        <span class="pulse-dot" style="margin-left: auto; color: #34d399;"></span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="server-status-card">
        <div class="server-status-top">
          <span>协议支持</span>
          <span style="color: #38bdf8; font-weight: 600;">Streamable HTTP</span>
        </div>
        <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">
          POST /mcp
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="top-bar-left">
        <button type="button" class="mobile-menu-btn" id="mobile-menu-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span class="view-title" id="current-view-title">快速配置与 Prompt</span>
      </div>

      <div class="top-bar-right">
        <div class="endpoint-pill" title="MCP Endpoint">
          <span class="method">POST</span>
          <code>${escapeHtml(opts.origin)}/mcp</code>
          <button type="button" class="copy-btn-mini" onclick="navigator.clipboard.writeText('${escapeHtml(opts.origin)}/mcp')" title="复制端点">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
        <span class="status-pill ${opts.authRequired ? "warn" : "ok"}">
          <span class="pulse-dot"></span>
          ${opts.authRequired ? "Bearer Auth 开启" : "公开端点"}
        </span>
      </div>
    </header>

    <div class="content-body">

      <!-- View 1: Config & Prompt -->
      <div class="view-panel active" id="view-config">
        <!-- Session Section -->
        <section class="section-card" id="login-section">
          <div class="card-header">
            <h2 id="login-title">
              <span class="section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              Google 授权状态
            </h2>
            <div>
              Session: <span id="session-status" data-source="${opts.session}" class="status-pill ${opts.session === "missing" ? "bad" : "ok"}"><span class="pulse-dot"></span>${escapeHtml(sessionLabel)}</span>
            </div>
          </div>

          <div class="session-card-inner">
            <div class="session-info">
              <div class="session-account-row" id="login-account" hidden>
                <span>绑定账号:</span>
                <span id="login-email" class="email ok"></span>
              </div>
              <p class="hint-text" id="login-hint">${escapeHtml(hint)}</p>
            </div>
            <div class="session-actions">
              <a class="btn btn-google" id="login-btn" href="/oauth/login">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Sign in with Google
              </a>
              <button type="button" class="btn danger" id="logout-btn" hidden>退出登录</button>
            </div>
          </div>
        </section>

        <!-- Agent Config Prompt -->
        <section class="section-card">
          <div class="card-header">
            <h2>
              <span class="section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </span>
              给 Agent 的配置 prompt
            </h2>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span id="copy-agent-status" class="hint-text ok"></span>
              <button type="button" class="btn" id="copy-agent-prompt">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                一键复制
              </button>
            </div>
          </div>

          <div class="tabs-nav">
            <button type="button" class="tab-btn active" data-tab="prompt">Agent 全量 Prompt (推荐)</button>
            <button type="button" class="tab-btn" data-tab="grok">Grok (TOML)</button>
            <button type="button" class="tab-btn" data-tab="claude">Claude (JSON)</button>
            <button type="button" class="tab-btn" data-tab="cursor">Cursor / VS Code (JSON)</button>
            <button type="button" class="tab-btn" data-tab="curl">cURL 调试</button>
          </div>

          <div class="code-container">
            <div class="code-header">
              <span id="code-snippet-type">AGENT_PROMPT.md</span>
              <span>UTF-8</span>
            </div>
            <pre id="agent-prompt">${escapeHtml(prompt)}</pre>
          </div>

          <p class="hint-text" style="margin-top: 12px;">
            复制后直接发给 Grok / Claude / Cursor，让它自动写入 MCP 配置。登录成功后 prompt 会自动附加 <code>X-Agy-Refresh-Token</code>（保存在本地 localStorage）。也可以通过 <code>wrangler secret put AGY_REFRESH_TOKEN</code> 持久化到 Cloudflare 服务端。
          </p>
        </section>
      </div>

      <!-- View 2: Tools -->
      <div class="view-panel" id="view-tools">
        <section class="section-card">
          <div class="card-header">
            <h2>工具</h2>
            <span class="hint-text">连上 <code>/mcp</code> 后 Agent 可调用的 2 个工具</span>
          </div>
          ${toolsHtml()}
        </section>
      </div>

      <!-- View 3: Metrics & Monitoring -->
      <div class="view-panel" id="view-metrics">
        <section class="section-card">
          <div class="card-header">
            <h2>
              <span class="section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </span>
              监控
            </h2>
            <span class="hint-text">监控数据每 15 秒更新，不会整页刷新</span>
          </div>
          <div id="metrics-root">${metricsHtml(opts.metrics)}</div>
        </section>
      </div>

    </div>
  </main>
</div>

${browserSessionScript()}
</body>
</html>`;
}

export function oauthWaitHtml(opts: { authUrl: string; error?: string }): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>完成 Google 授权 · ${SERVER_NAME}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="auth-card fade-in">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div class="brand-logo" style="width: 36px; height: 36px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
      <h1>完成 Google 授权</h1>
    </div>
    <p class="muted" style="font-size: 13.5px; margin-bottom: 16px;">agy 桌面端 OAuth 默认回调 localhost。远程部署时需要完成授权后手动贴回回调 URL。</p>

    <ol class="step-list">
      <li>点击打开 <a class="btn btn-google" style="display: inline-flex; padding: 4px 12px; margin-left: 6px; font-size: 12px;" href="${escapeHtml(opts.authUrl)}" target="_blank" rel="noopener">Google 授权页 ↗</a></li>
      <li>登录并确认授权相关权限</li>
      <li>浏览器会重定向到 <code>http://localhost:51121/oauth-callback?code=...</code>（页面无法访问是完全正常的）</li>
      <li>复制浏览器地址栏的完整 URL，粘贴到下方输入框中</li>
    </ol>

    ${opts.error ? `<div class="status-pill bad" style="width: 100%; margin-bottom: 14px; padding: 8px 12px; border-radius: 8px;">${escapeHtml(opts.error)}</div>` : ""}

    <form method="post" action="/oauth/complete">
      <label class="hint-text" style="font-weight: 600; display: block; margin-bottom: 4px;">回调 URL</label>
      <textarea name="callback" required placeholder="http://localhost:51121/oauth-callback?code=4/0A..."></textarea>
      <div class="form-actions">
        <button class="btn" type="submit" style="flex: 1;">完成登录</button>
        <a class="btn ghost" href="/">返回首页</a>
      </div>
    </form>
  </div>
</body>
</html>`;
}

export function oauthSuccessHtml(opts: {
  origin: string;
  authRequired: boolean;
  refreshToken: string;
  email?: string;
}): string {
  const grok = grokSnippet(opts.origin, opts.authRequired, opts.refreshToken);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>授权成功 · ${SERVER_NAME}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="auth-card fade-in" style="max-width: 680px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--success-bg); border: 2px solid var(--success-border); color: #34d399; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h1>已拿到 Google session</h1>
      <p class="muted">登录账号: <span class="ok" style="font-weight: 600;">${escapeHtml(opts.email || "(unknown)")}</span></p>
      <p class="hint-text" style="margin-top: 6px;">Token 已写入此浏览器的 localStorage，即将自动返回首页…</p>
    </div>

    <div style="margin-bottom: 16px;">
      <div class="hint-text" style="font-weight: 600; margin-bottom: 6px; text-transform: uppercase;">refresh_token</div>
      <div class="code-container">
        <pre>${escapeHtml(opts.refreshToken)}</pre>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="hint-text" style="font-weight: 600; margin-bottom: 6px; text-transform: uppercase;">Grok MCP 配置</div>
      <div class="code-container">
        <pre>${escapeHtml(grok)}</pre>
      </div>
    </div>

    <div style="text-align: center;">
      <a class="btn" href="/">返回首页</a>
    </div>
  </div>
  ${browserSessionScript({ refreshToken: opts.refreshToken, email: opts.email })}
</body>
</html>`;
}

export function oauthErrorHtml(message: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>登录失败 · ${SERVER_NAME}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="auth-card fade-in" style="text-align: center;">
    <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--danger-bg); border: 2px solid var(--danger-border); color: #f87171; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
    </div>
    <h1>登录失败</h1>
    <p class="bad" style="margin: 12px 0 24px; font-size: 14px;">${escapeHtml(message)}</p>
    <div class="form-actions" style="justify-content: center;">
      <a class="btn" href="/oauth/login">重试登录</a>
      <a class="btn ghost" href="/">返回首页</a>
    </div>
  </div>
</body>
</html>`;
}

const TOOL_COPY: Record<string, { title: string; summary: string; params: Record<string, string>; returns: string }> = {
  search_web: {
    title: "网页搜索",
    summary: "用 agy 的 Google session 做实时网页搜索。适合新闻、近况、需要出处的事实。",
    params: {
      query: "搜索词。需要时带上日期或地区。",
    },
    returns: "一段带引用的文本：摘要、实际搜索词、来源链接。",
  },
  generate_image: {
    title: "生成图片",
    summary: "用 agy 的生图模型画图或改图。适合 UI 稿、图标、素材。画界面时不要加手机/电脑外框，除非用户明确要。",
    params: {
      prompt: "要画什么，或怎么改参考图。",
      image_name: "保存用的短文件名，小写加下划线，最多约 3 个词，例如 login_page_mockup。",
      aspect_ratio: "画幅。默认 1:1。",
      image_urls: "http(s) 参考图，包括本服务之前的 /files/... 链接。不能传本地路径。",
      images: "本地参考图。本服务读不到用户磁盘，请把文件读成 base64 放进 data（可带 mimeType）。和 image_urls 合计最多 3 张。",
    },
    returns: "图片文件 + 短时下载地址。Agent 必须立刻 curl/下载到用户本地工作目录，禁止只贴 URL。",
  },
};

function toolsHtml(): string {
  const cards = [searchToolDef(), generateImageToolDef()].map(toolCard).join("");
  return `<div class="tools-list">${cards}</div>`;
}

function toolCard(def: ReturnType<typeof searchToolDef>): string {
  const copy = TOOL_COPY[def.name];
  const required = new Set(def.inputSchema.required ?? []);
  const props = def.inputSchema.properties as Record<string, { description?: string; enum?: string[]; type?: string }>;
  const params = Object.entries(props)
    .map(([name, prop]) => {
      const desc = copy?.params[name] || prop.description || "";
      const enumHint = prop.enum?.length ? `可选值：${prop.enum.join(" / ")}。` : "";
      const badge = required.has(name) ? `<span class="req">必填</span>` : `<span class="opt">可选</span>`;
      return `<div class="param-item">
        <div class="param-top">
          <code>${escapeHtml(name)}</code>
          ${badge}
          <span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">${escapeHtml(prop.type || "string")}</span>
        </div>
        <div class="param-desc">${escapeHtml(desc)} ${escapeHtml(enumHint)}</div>
      </div>`;
    })
    .join("");

  return `<div class="tool-card">
    <div class="tool-header">
      <div class="tool-name-wrap">
        <span class="tool-name">${escapeHtml(copy?.title || def.name)}</span>
        <span class="tool-badge"><code>${escapeHtml(def.name)}</code></span>
      </div>
    </div>
    <p class="tool-summary">${escapeHtml(copy?.summary || def.description)}</p>
    <div class="params-box">
      <div class="params-title">参数 (Parameters)</div>
      ${params}
    </div>
    <div class="returns-box">
      <span class="k">返回：</span>
      <span>${escapeHtml(copy?.returns || "")}</span>
    </div>
  </div>`;
}

function metricsHtml(m: MetricsSnapshot): string {
  const rate = m.total ? `${Math.round((m.ok / m.total) * 100)}%` : "—";
  const rows = m.recent.length
    ? m.recent
        .map((e) => {
          const err = e.error ? `<div class="bad" style="font-size: 12px; margin-top: 3px;">${escapeHtml(e.error)}</div>` : "";
          return `<tr>
            <td class="mono">${escapeHtml(fmtTime(e.at))}</td>
            <td><span class="status-tag ${e.ok ? "ok" : "bad"}">${e.ok ? "200 OK" : "ERR"}</span></td>
            <td class="mono">${escapeHtml(fmtMs(e.ms))}</td>
            <td class="q">
              <span style="font-weight: 550; color: #38bdf8; font-family: var(--font-mono); font-size: 12px; margin-right: 6px;">[${escapeHtml(e.tool || "search_web")}]</span>
              <span>${escapeHtml(e.query || "—")}</span>
              ${err}
            </td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 24px 14px;">还没有 search_web 调用</td></tr>`;

  return `
<div class="stats-grid">
  ${statBox(String(m.total), "总调用")}
  ${statBox(String(m.ok), "成功", "ok")}
  ${statBox(String(m.fail), "失败", m.fail ? "bad" : undefined)}
  ${statBox(rate, "成功率", m.fail && m.ok === 0 ? "bad" : "ok")}
  ${statBox(m.lastMs != null ? fmtMs(m.lastMs) : "—", "最近耗时")}
  ${statBox(m.avgMs != null ? fmtMs(m.avgMs) : "—", "平均耗时")}
  ${statBox(m.p95Ms != null ? fmtMs(m.p95Ms) : "—", "P95")}
  ${statBox(String(m.authFail), "未授权", m.authFail ? "bad" : undefined)}
</div>

<div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 6px; flex-wrap: wrap; gap: 8px;">
  <span class="hint-text">
    ${m.total ? `自 ${escapeHtml(fmtTime(m.startedAt))} 起。` : ""}${
      m.persistent
        ? "跨请求保存在 Cloudflare Durable Object。"
        : "记在当前进程内存里，重启或 Worker 冷启动会清零。"
    }
  </span>
  <span class="hint-text">显示最近 20 条调用记录</span>
</div>

<div class="table-wrap">
  <table>
    <thead><tr><th>时间</th><th>状态</th><th>耗时</th><th>查询与工具</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
}

function statBox(n: string, label: string, tone?: "ok" | "bad"): string {
  return `<div class="stat-card">
    <div class="l">${escapeHtml(label)}</div>
    <div class="n${tone ? ` ${tone}` : ""}">${escapeHtml(n)}</div>
  </div>`;
}

function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(ms >= 10_000 ? 0 : 1)}s` : `${ms}ms`;
}

function fmtTime(at: number): string {
  return new Date(at).toISOString().replace("T", " ").slice(0, 19) + "Z";
}

function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function browserSessionScript(justLoggedIn?: { refreshToken: string; email?: string }): string {
  return `<script>
(function () {
  var KEY = ${jsonForScript(SESSION_STORAGE_KEY)};
  var justLoggedIn = ${justLoggedIn ? jsonForScript({ refreshToken: justLoggedIn.refreshToken, email: justLoggedIn.email || "" }) : "null"};
  if (justLoggedIn && justLoggedIn.refreshToken) {
    localStorage.setItem(KEY, JSON.stringify({
      refreshToken: justLoggedIn.refreshToken,
      email: justLoggedIn.email || "",
      savedAt: Date.now()
    }));
    location.replace("/");
    return;
  }
  var origin = document.body.getAttribute("data-origin") || "";
  var auth = document.body.getAttribute("data-auth") === "1";
  var s = null;
  try {
    s = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch (e) {
    s = null;
  }

  var currentRefreshToken = s && typeof s.refreshToken === "string" ? s.refreshToken : undefined;

  if (s && typeof s.refreshToken === "string" && s.refreshToken) {
    var status = document.getElementById("session-status");
    if (status && status.getAttribute("data-source") === "missing") {
      status.className = "status-pill ok";
      status.innerHTML = '<span class="pulse-dot"></span>' + (s.email ? ("browser (" + escapeHtmlJs(s.email) + ")") : "browser (localStorage)");
    }
    var title = document.getElementById("login-title");
    var account = document.getElementById("login-account");
    var emailEl = document.getElementById("login-email");
    var loginBtn = document.getElementById("login-btn");
    var logout = document.getElementById("logout-btn");
    var hint = document.getElementById("login-hint");
    if (title) title.innerHTML = '<span class="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span> 浏览器里已有 session';
    if (account) account.hidden = false;
    if (emailEl) emailEl.textContent = s.email || "(unknown)";
    if (loginBtn) loginBtn.textContent = "重新登录";
    if (logout) {
      logout.hidden = false;
      logout.addEventListener("click", function () {
        localStorage.removeItem(KEY);
        location.reload();
      });
    }
    if (hint) {
      hint.textContent = "session 存在这个浏览器的 localStorage。点一键复制，把 prompt 贴给 Agent 写入 MCP 配置。";
    }
  }

  // Sidebar navigation & View switching
  var viewTitles = {
    config: "快速配置与 Prompt",
    tools: "工具列表 (Tools)",
    metrics: "服务监控与日志 (Metrics)"
  };

  var VIEW_KEY = "agy-landing-view";
  function switchView(viewName) {
    var validViews = ["config", "tools", "metrics"];
    if (validViews.indexOf(viewName) === -1) viewName = "config";

    // Update nav items
    var navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(function (item) {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update view panels
    var panels = document.querySelectorAll(".view-panel");
    panels.forEach(function (p) {
      if (p.id === "view-" + viewName) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });

    // Update topbar title
    var titleEl = document.getElementById("current-view-title");
    if (titleEl && viewTitles[viewName]) {
      titleEl.textContent = viewTitles[viewName];
    }

    try { localStorage.setItem(VIEW_KEY, viewName); } catch (e) {}

    // Close mobile drawer if open
    var sidebar = document.getElementById("app-sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }

  // Handle URL hash changes
  function handleHash() {
    var hash = location.hash.replace(/^#/, "");
    if (hash) {
      switchView(hash);
      return;
    }
    var saved = null;
    try { saved = localStorage.getItem(VIEW_KEY); } catch (e) {}
    if (saved) switchView(saved);
  }

  window.addEventListener("hashchange", handleHash);
  handleHash();

  var navLinks = document.querySelectorAll(".nav-item");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var view = link.getAttribute("data-view");
      if (view) {
        switchView(view);
      }
    });
  });

  // Mobile menu button
  var mobileBtn = document.getElementById("mobile-menu-btn");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", function () {
      var sidebar = document.getElementById("app-sidebar");
      if (sidebar) sidebar.classList.toggle("open");
    });
  }

  // Client configuration snippet tabs
  var TAB_KEY = "agy-landing-config-tab";
  var currentTab = "prompt";
  try {
    var savedTab = localStorage.getItem(TAB_KEY);
    if (savedTab) currentTab = savedTab;
  } catch (e) {}
  function updateCodeSnippet() {
    var promptEl = document.getElementById("agent-prompt");
    var typeEl = document.getElementById("code-snippet-type");
    if (!promptEl) return;
    var content = "";
    if (currentTab === "prompt") {
      content = agentClientPrompt(origin, auth, currentRefreshToken);
      if (typeEl) typeEl.textContent = "AGENT_PROMPT.md";
    } else if (currentTab === "grok") {
      content = grokClientSnippet(origin, auth, currentRefreshToken);
      if (typeEl) typeEl.textContent = "config.toml (Grok)";
    } else if (currentTab === "claude") {
      var headersObj = {};
      if (auth) headersObj["Authorization"] = "Bearer \${AGY_MCP_TOKEN}";
      if (currentRefreshToken) headersObj["X-Agy-Refresh-Token"] = currentRefreshToken;
      var claudeConfig = {
        mcpServers: {
          "agy-web-search": {
            url: origin + "/mcp",
            headers: Object.keys(headersObj).length ? headersObj : undefined
          }
        }
      };
      content = JSON.stringify(claudeConfig, null, 2);
      if (typeEl) typeEl.textContent = ".claude.json / claude_desktop_config.json";
    } else if (currentTab === "cursor") {
      var headersObj = {};
      if (auth) headersObj["Authorization"] = "Bearer \${AGY_MCP_TOKEN}";
      if (currentRefreshToken) headersObj["X-Agy-Refresh-Token"] = currentRefreshToken;
      var cursorConfig = {
        mcpServers: {
          "agy-web-search": {
            url: origin + "/mcp",
            headers: Object.keys(headersObj).length ? headersObj : undefined
          }
        }
      };
      content = JSON.stringify(cursorConfig, null, 2);
      if (typeEl) typeEl.textContent = ".cursor/mcp.json";
    } else if (currentTab === "curl") {
      var hAuth = auth ? "  -H \\"Authorization: Bearer \${AGY_MCP_TOKEN}\\" \\\\\\n" : "";
      var hTok = currentRefreshToken ? ("  -H \\"X-Agy-Refresh-Token: " + currentRefreshToken + "\\" \\\\\\n") : "";
      content = "curl -X POST " + origin + "/mcp \\\\\\n" +
        "  -H \\"Content-Type: application/json\\" \\\\\\n" +
        hAuth + hTok +
        "  -d '{\\"jsonrpc\\":\\"2.0\\",\\"id\\":1,\\"method\\":\\"tools/call\\",\\"params\\":{\\"name\\":\\"search_web\\",\\"arguments\\":{\\"query\\":\\"最新 AI 动态\\"} }}'";
      if (typeEl) typeEl.textContent = "curl_test.sh";
    }
    promptEl.textContent = content;
  }

  var tabBtns = document.querySelectorAll(".tab-btn");
  function applyTab(tab) {
    currentTab = tab || "prompt";
    tabBtns.forEach(function (b) {
      if (b.getAttribute("data-tab") === currentTab) b.classList.add("active");
      else b.classList.remove("active");
    });
    try { localStorage.setItem(TAB_KEY, currentTab); } catch (e) {}
    updateCodeSnippet();
  }
  applyTab(currentTab);
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTab(btn.getAttribute("data-tab") || "prompt");
    });
  });

  var copyBtn = document.getElementById("copy-agent-prompt");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var el = document.getElementById("agent-prompt");
      var text = el ? el.textContent || "" : "";
      copyText(text).then(function (ok) {
        var st = document.getElementById("copy-agent-status");
        if (st) st.textContent = ok ? "✓ 已复制到剪贴板" : "复制失败，请手动选中";
        if (ok) setTimeout(function () { if (st) st.textContent = ""; }, 2500);
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  function escapeHtmlJs(s) {
    return s.replace(/[&<>"']/g, function(c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c;
    });
  }
  function fmtMsJs(ms) {
    return ms >= 1000 ? (ms / 1000).toFixed(ms >= 10000 ? 0 : 1) + "s" : ms + "ms";
  }
  function fmtTimeJs(at) {
    return new Date(at).toISOString().replace("T", " ").slice(0, 19) + "Z";
  }
  function statBoxJs(n, label, tone) {
    return '<div class="stat-card"><div class="l">' + escapeHtmlJs(label) + '</div><div class="n' + (tone ? " " + tone : "") + '">' + escapeHtmlJs(String(n)) + "</div></div>";
  }
  function renderMetrics(m) {
    var rate = m.total ? Math.round((m.ok / m.total) * 100) + "%" : "—";
    var rows;
    if (m.recent && m.recent.length) {
      rows = m.recent.map(function (e) {
        var err = e.error ? '<div class="bad" style="font-size: 12px; margin-top: 3px;">' + escapeHtmlJs(e.error) + "</div>" : "";
        return "<tr>" +
          '<td class="mono">' + escapeHtmlJs(fmtTimeJs(e.at)) + "</td>" +
          '<td><span class="status-tag ' + (e.ok ? "ok" : "bad") + '">' + (e.ok ? "200 OK" : "ERR") + "</span></td>" +
          '<td class="mono">' + escapeHtmlJs(fmtMsJs(e.ms)) + "</td>" +
          '<td class="q"><span style="font-weight: 550; color: #38bdf8; font-family: var(--font-mono); font-size: 12px; margin-right: 6px;">[' +
          escapeHtmlJs(e.tool || "search_web") + "]</span><span>" + escapeHtmlJs(e.query || "—") + "</span>" + err + "</td></tr>";
      }).join("");
    } else {
      rows = '<tr><td colspan="4" style="text-align: center; color: var(--text-dim); padding: 24px 14px;">还没有 search_web 调用</td></tr>';
    }
    var persist = m.persistent
      ? "跨请求保存在 Cloudflare Durable Object。"
      : "记在当前进程内存里，重启或 Worker 冷启动会清零。";
    var since = m.total ? "自 " + escapeHtmlJs(fmtTimeJs(m.startedAt)) + " 起。" : "";
    return '<div class="stats-grid">' +
      statBoxJs(String(m.total), "总调用") +
      statBoxJs(String(m.ok), "成功", "ok") +
      statBoxJs(String(m.fail), "失败", m.fail ? "bad" : undefined) +
      statBoxJs(rate, "成功率", m.fail && m.ok === 0 ? "bad" : "ok") +
      statBoxJs(m.lastMs != null ? fmtMsJs(m.lastMs) : "—", "最近耗时") +
      statBoxJs(m.avgMs != null ? fmtMsJs(m.avgMs) : "—", "平均耗时") +
      statBoxJs(m.p95Ms != null ? fmtMsJs(m.p95Ms) : "—", "P95") +
      statBoxJs(String(m.authFail), "未授权", m.authFail ? "bad" : undefined) +
      "</div>" +
      '<div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 6px; flex-wrap: wrap; gap: 8px;">' +
      '<span class="hint-text">' + since + persist + "</span>" +
      '<span class="hint-text">显示最近 20 条调用记录</span></div>' +
      '<div class="table-wrap"><table><thead><tr><th>时间</th><th>状态</th><th>耗时</th><th>查询与工具</th></tr></thead><tbody>' +
      rows + "</tbody></table></div>";
  }
  var metricsRoot = document.getElementById("metrics-root");
  function refreshMetrics() {
    if (document.hidden || !metricsRoot) return;
    fetch("/health", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.metrics && metricsRoot) metricsRoot.innerHTML = renderMetrics(data.metrics);
      })
      .catch(function () {});
  }
  setInterval(refreshMetrics, 15000);
  function grokClientSnippet(origin, authRequired, refreshToken) {
    var headers = [];
    if (authRequired) headers.push('Authorization = "Bearer \${AGY_MCP_TOKEN}"');
    if (refreshToken) headers.push('"X-Agy-Refresh-Token" = "' + refreshToken + '"');
    var headerLine = headers.length ? "\\nheaders = { " + headers.join(", ") + " }" : "";
    return "[mcp_servers.agy]\\nurl = \\"" + origin + "/mcp\\"" + headerLine;
  }
  function agentClientPrompt(origin, authRequired, refreshToken) {
    var lines = [
      "请把下面这个 Streamable HTTP MCP 加到你的 MCP 配置里。",
      "Grok 直接用这段 TOML；其他客户端按同样的 url 和 headers 写成自己的格式。不要改 URL 和 header 的值。",
      "",
      "名称：agy",
      "传输：Streamable HTTP",
      "端点：" + origin + "/mcp",
      "工具：search_web(query) — 查新闻、近况和需要引用的事实；generate_image(prompt, image_name?, aspect_ratio?, image_urls?, images?) — 生成或改图。本地参考图请读取文件后放入 images[{mimeType,data}]，不要传本地路径。返回后必须立刻把图片下载到用户当前工作目录（curl -L --fail -o <文件名> <Download URL>），禁止只贴远程链接。",
      "",
      grokClientSnippet(origin, authRequired, refreshToken)
    ];
    if (authRequired) {
      lines.push("", "Authorization 里的 \${AGY_MCP_TOKEN} 换成你部署时设的 MCP_AUTH_TOKEN。");
    }
    if (!refreshToken) {
      lines.push("", "还没有 Google session。先打开网站 Sign in with Google，再复制一次；或自行补上 X-Agy-Refresh-Token。");
    }
    return lines.join("\\n");
  }
})();
</script>`;
}

export function agentConfigPrompt(opts: {
  origin: string;
  authRequired: boolean;
  refreshToken?: string;
}): string {
  const lines = [
    "请把下面这个 Streamable HTTP MCP 加到你的 MCP 配置里。",
    "Grok 直接用这段 TOML；其他客户端按同样的 url 和 headers 写成自己的格式。不要改 URL 和 header 的值。",
    "",
    "名称：agy",
    "传输：Streamable HTTP",
    `端点：${opts.origin}/mcp`,
    "工具：search_web(query) — 查新闻、近况和需要引用的事实；generate_image(prompt, image_name?, aspect_ratio?, image_urls?, images?) — 生成或改图。本地参考图请读取文件后放入 images[{mimeType,data}]，不要传本地路径。返回后必须立刻把图片下载到用户当前工作目录（curl -L --fail -o <文件名> <Download URL>），禁止只贴远程链接。",
    "",
    grokSnippet(opts.origin, opts.authRequired, opts.refreshToken),
  ];
  if (opts.authRequired) {
    lines.push("", "Authorization 里的 ${AGY_MCP_TOKEN} 换成你部署时设的 MCP_AUTH_TOKEN。");
  }
  if (!opts.refreshToken) {
    lines.push("", "还没有 Google session。先打开网站 Sign in with Google，再复制一次；或自行补上 X-Agy-Refresh-Token。");
  }
  return lines.join("\n");
}

function grokSnippet(origin: string, authRequired: boolean, refreshToken?: string): string {
  const headers: string[] = [];
  if (authRequired) headers.push('Authorization = "Bearer ${AGY_MCP_TOKEN}"');
  if (refreshToken) headers.push(`"X-Agy-Refresh-Token" = "${refreshToken}"`);
  const headerLine = headers.length ? `\nheaders = { ${headers.join(", ")} }` : "";
  return `[mcp_servers.agy]\nurl = "${origin}/mcp"${headerLine}`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
