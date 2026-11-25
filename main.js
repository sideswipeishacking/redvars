const { Plugin, ItemView, Notice, MarkdownView } = require('obsidian');

const VIEW_TYPE = 'redvars';

const CATEGORIES = [
  {
    id: 'attacker', label: 'Attacker (Global)', icon: '⚔',
    vars: [
      { id: 'LHOST', desc: 'Your attacker/listener IP' },
      { id: 'LPORT', desc: 'Default listener port' },
      { id: 'ATTACKER_IFACE', desc: 'Network interface (tun0, eth0)' },
      { id: 'ATTACKER_MAC', desc: 'Your MAC address' },
      { id: 'HTTP_PORT', desc: 'HTTP server port' },
      { id: 'PROXY_IP', desc: 'Proxy/Burp listener IP' },
      { id: 'PROXY_PORT', desc: 'Proxy/Burp listener port' },
      { id: 'WORDLIST_DIR', desc: 'Base wordlists path' },
      { id: 'TOOLS_DIR', desc: 'Base tools directory' },
    ]
  },
  {
    id: 'target', label: 'Target Network', icon: '🎯',
    vars: [
      { id: 'RHOST', desc: 'Target machine IP' },
      { id: 'RPORT', desc: 'Target port' },
      { id: 'TARGET_HOSTNAME', desc: 'Target hostname' },
      { id: 'TARGET_FQDN', desc: 'Target FQDN (host.domain.local)' },
      { id: 'INTERNAL_IP', desc: 'Internal pivot target IP' },
      { id: 'ROUTER_IP', desc: 'Default gateway' },
      { id: 'DNS_IP', desc: 'DNS server IP' },
      { id: 'SUBNET', desc: 'Target subnet (192.168.1.0/24)' },
      { id: 'VICTIM_IP', desc: 'Second victim IP (MITM)' },
    ]
  },
  {
    id: 'ad', label: 'Active Directory', icon: '🏢',
    vars: [
      { id: 'DOMAIN', desc: 'NetBIOS / short domain name' },
      { id: 'DOMAIN_FQDN', desc: 'Full AD FQDN (corp.local)' },
      { id: 'DC_IP', desc: 'Domain controller IP' },
      { id: 'AD_USER', desc: 'AD username' },
      { id: 'AD_PASS', desc: 'AD password' },
      { id: 'AD_GROUP', desc: 'AD group name' },
      { id: 'AD_IFACE', desc: 'Interface on AD network' },
      { id: 'NTLM_HASH', desc: 'NTLM / RC4 hash' },
      { id: 'KERBEROS_TICKET', desc: 'Base64 Kerberos TGT' },
      { id: 'DMSA_NAME', desc: 'dMSA account (BadSuccessor)' },
      { id: 'SPN', desc: 'Kerberos SPN' },
      { id: 'OU_PATH', desc: 'Active Directory OU path' },
    ]
  },
  {
    id: 'creds', label: 'Credentials & Hashes', icon: '🔑',
    vars: [
      { id: 'USERNAME', desc: 'Generic login username' },
      { id: 'PASSWORD', desc: 'Plaintext password' },
      { id: 'HASH', desc: 'Generic hash (NTLM/MD5/SHA1)' },
      { id: 'SSH_KEY', desc: 'SSH private key file path' },
      { id: 'TICKET_FILE', desc: 'Kerberos ticket file (.kirbi/.ccache)' },
      { id: 'ENCRYPT_KEY', desc: 'Payload XOR / encryption key' },
    ]
  },
  {
    id: 'payload', label: 'Shells & Payloads', icon: '💣',
    vars: [
      { id: 'PAYLOAD_OS', desc: 'Target OS (windows / linux)' },
      { id: 'PAYLOAD_ARCH', desc: 'Target arch (x64 / x86)' },
      { id: 'PAYLOAD_FORMAT', desc: 'Output format (exe / elf / raw / csharp)' },
      { id: 'PAYLOAD_OUT', desc: 'Output filename (revshell.exe)' },
      { id: 'TARGET_EXE', desc: 'Legitimate exe to backdoor' },
      { id: 'CMD_PAYLOAD', desc: 'Command string to execute' },
      { id: 'STAGED_PORT', desc: 'Stager callback port' },
    ]
  },
  {
    id: 'lateral', label: 'Lateral Movement', icon: '↔',
    vars: [
      { id: 'SERVICE_NAME', desc: 'Windows service name' },
      { id: 'SERVICE_PATH', desc: 'Service binary path' },
      { id: 'SHARE_IP', desc: 'SMB share server IP' },
      { id: 'SHARE_NAME', desc: 'SMB share name' },
      { id: 'TASK_NAME', desc: 'Scheduled task name' },
      { id: 'TUNNEL_USER', desc: 'SSH tunnel username' },
      { id: 'PIVOT_PORT', desc: 'SOCKS / pivot listener port' },
      { id: 'SESSION_ID', desc: 'RDP hijack session ID' },
    ]
  },
  {
    id: 'exfil', label: 'Exfiltration', icon: '📤',
    vars: [
      { id: 'EXFIL_IP', desc: 'Exfil server IP' },
      { id: 'EXFIL_PORT', desc: 'Exfil listener port' },
      { id: 'EXFIL_DNS', desc: 'DNS exfil domain' },
      { id: 'DATA_PATH', desc: 'Target-side data path to exfil' },
    ]
  },
  {
    id: 'recon', label: 'Recon', icon: '🔍',
    vars: [
      { id: 'TARGET_DOMAIN', desc: 'Root domain for web recon' },
      { id: 'RECON_PROJECT', desc: 'Recon-ng project name' },
      { id: 'SERVICE_VERSION', desc: 'Service ID for searchsploit' },
      { id: 'SNMP_COMMUNITY', desc: 'SNMP community string' },
    ]
  },
  {
    id: 'web', label: 'Web Hacking', icon: '🌐',
    vars: [
      { id: 'WEB_URL', desc: 'Full target URL' },
      { id: 'WEB_PATH', desc: 'URL path / endpoint' },
      { id: 'WEB_PARAM', desc: 'URL / POST parameter name' },
      { id: 'WEB_DB', desc: 'Database name (SQLi)' },
      { id: 'WEB_TABLE', desc: 'Table name (SQLi)' },
      { id: 'WORDLIST', desc: 'Wordlist path (relative to WORDLIST_DIR)' },
      { id: 'USER_WORDLIST', desc: 'Usernames wordlist path' },
    ]
  },
  {
    id: 'wireless', label: 'Wireless', icon: '📡',
    vars: [
      { id: 'BSSID', desc: 'Target AP MAC address' },
      { id: 'CHANNEL', desc: 'Target WiFi channel' },
      { id: 'ESSID', desc: 'Target network name (SSID)' },
      { id: 'WLAN_IFACE', desc: 'Wireless interface (wlan0mon)' },
      { id: 'CAPTURE_FILE', desc: 'Capture output file name' },
      { id: 'WPA_HASH_FILE', desc: 'Converted WPA hash file (.hc22000)' },
    ]
  },
];

class LiveTargetView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'Live Target Variables'; }
  getIcon() { return 'crosshair'; }

  async onOpen() { this.render(); }
  async onClose() {}

  render() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass('ltv-root');

    const hdr = root.createDiv('ltv-header');
    hdr.createSpan({ cls: 'ltv-title', text: '🎯 Target Variables' });
    const clearAll = hdr.createEl('button', { cls: 'ltv-btn-danger', text: 'Clear All' });
    clearAll.addEventListener('click', () => this.handleClearAll());

    for (const cat of CATEGORIES) {
      const det = root.createEl('details', { cls: 'ltv-cat' });
      det.setAttribute('open', '');
      const sum = det.createEl('summary', { cls: 'ltv-cat-hdr' });
      sum.createSpan({ text: cat.icon + '  ' + cat.label });
      for (const v of cat.vars) {
        this.renderVarRow(det, v.id, v.desc, false);
      }
    }

    const customSections = this.plugin.settings._customSections || [];
    const customVars = this.plugin.settings._customVars || [];
    const knownIds = new Set(customSections.map(s => s.id));

    for (const section of customSections) {
      const sVars = customVars.filter(v => v.section === section.id);
      this.renderCustomSection(root, section, sVars);
    }

    const uncat = customVars.filter(v => !v.section || !knownIds.has(v.section));
    if (uncat.length > 0) {
      this.renderCustomSection(root, { id: '', label: 'Custom' }, uncat, false);
    }

    this.renderAddArea(root);
  }

  renderCustomSection(root, section, vars, canEdit = true) {
    const det = root.createEl('details', { cls: 'ltv-cat' });
    det.setAttribute('open', '');
    const sum = det.createEl('summary', { cls: 'ltv-cat-hdr' });

    if (canEdit && section.id) {
      const labelSpan = sum.createSpan({ cls: 'ltv-section-label', text: '✦  ' + section.label });

      const renameBtn = sum.createEl('button', { cls: 'ltv-btn ltv-cat-ctrl ltv-rename-section', text: '✎' });
      renameBtn.setAttribute('title', 'Rename section');
      renameBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = section.label;
        inp.className = 'ltv-section-rename-inp';
        labelSpan.replaceWith(inp);
        inp.focus(); inp.select();
        const save = async () => {
          const newLabel = inp.value.trim() || section.label;
          section.label = newLabel;
          const idx = (this.plugin.settings._customSections || []).findIndex(s => s.id === section.id);
          if (idx >= 0) this.plugin.settings._customSections[idx].label = newLabel;
          await this.plugin.saveSettings();
          this.render();
        };
        inp.addEventListener('blur', save);
        inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') inp.blur(); if (ev.key === 'Escape') this.render(); });
      });

      const delBtn = sum.createEl('button', { cls: 'ltv-btn ltv-cat-ctrl ltv-delete-section', text: '✕' });
      delBtn.setAttribute('title', 'Delete section (vars move to Custom)');
      delBtn.addEventListener('click', async (e) => {
        e.preventDefault(); e.stopPropagation();
        (this.plugin.settings._customVars || []).forEach(v => { if (v.section === section.id) v.section = ''; });
        this.plugin.settings._customSections = (this.plugin.settings._customSections || []).filter(s => s.id !== section.id);
        await this.plugin.saveSettings();
        this.render();
      });
    } else {
      sum.createSpan({ text: '✦  ' + (section.label || 'Custom') });
    }

    for (const v of vars) {
      this.renderVarRow(det, v.id, v.desc, true);
    }
  }

  renderAddArea(root) {
    const addBox = root.createDiv('ltv-add-box');

    const secRow = addBox.createDiv('ltv-add-row ltv-section-row');
    const secInp = secRow.createEl('input', { cls: 'ltv-add-desc', placeholder: 'New section name…' });
    secInp.type = 'text';
    const secBtn = secRow.createEl('button', { cls: 'ltv-add-btn', text: '+ Section' });
    secBtn.addEventListener('click', async () => {
      const label = secInp.value.trim();
      if (!label) { new Notice('Enter a section name.'); return; }
      const id = 'custom-' + Date.now();
      if (!this.plugin.settings._customSections) this.plugin.settings._customSections = [];
      this.plugin.settings._customSections.push({ id, label });
      await this.plugin.saveSettings();
      secInp.value = '';
      this.render();
    });
    secInp.addEventListener('keydown', (e) => { if (e.key === 'Enter') secBtn.click(); });

    const addRow = addBox.createDiv('ltv-add-row');
    const nameInp = addRow.createEl('input', { cls: 'ltv-add-name', placeholder: 'VAR_NAME' });
    nameInp.type = 'text';
    nameInp.addEventListener('input', () => {
      nameInp.value = nameInp.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    });
    const descInp = addRow.createEl('input', { cls: 'ltv-add-desc', placeholder: 'description' });
    descInp.type = 'text';

    const sel = addRow.createEl('select', { cls: 'ltv-section-sel' });
    const defOpt = sel.createEl('option'); defOpt.value = ''; defOpt.textContent = 'Custom';
    for (const s of (this.plugin.settings._customSections || [])) {
      const opt = sel.createEl('option'); opt.value = s.id; opt.textContent = s.label;
    }

    const addBtn = addRow.createEl('button', { cls: 'ltv-add-btn', text: '+ Var' });
    addBtn.addEventListener('click', async () => {
      const id = nameInp.value.trim();
      const desc = descInp.value.trim() || id;
      const section = sel.value;
      if (!id) { new Notice('Enter a variable name.'); return; }
      const existing = [...CATEGORIES.flatMap(c => c.vars), ...(this.plugin.settings._customVars || [])];
      if (existing.find(v => v.id === id)) { new Notice(`${id} already exists.`); return; }
      if (!this.plugin.settings._customVars) this.plugin.settings._customVars = [];
      this.plugin.settings._customVars.push({ id, desc, section });
      this.plugin.settings[id] = '';
      await this.plugin.saveSettings();
      nameInp.value = ''; descInp.value = '';
      this.render();
    });
    [nameInp, descInp].forEach(el => {
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });
    });
  }

  renderVarRow(parent, id, desc, canDelete) {
    const data = this.plugin.settings;
    const row = parent.createDiv('ltv-row');
    const lbl = row.createEl('label', { cls: 'ltv-var-name', text: id });
    lbl.setAttribute('title', desc);

    const inp = row.createEl('input', { cls: 'ltv-var-input' });
    inp.type = 'text';
    inp.placeholder = desc;
    inp.value = data[id] || '';
    inp.addEventListener('input', () => {
      this.plugin.settings[id] = inp.value;
      clearTimeout(inp._saveTimer);
      inp._saveTimer = setTimeout(() => this.plugin.saveSettings(), 400);
    });

    const copyBtn = row.createEl('button', { cls: 'ltv-btn ltv-copy', text: '⧉' });
    copyBtn.setAttribute('title', 'Copy value');
    copyBtn.addEventListener('click', async () => {
      if (!inp.value) return;
      await navigator.clipboard.writeText(inp.value);
      const orig = copyBtn.getText();
      copyBtn.setText('✓');
      setTimeout(() => copyBtn.setText(orig), 900);
    });

    const clrBtn = row.createEl('button', { cls: 'ltv-btn ltv-clear-row', text: '✕' });
    clrBtn.setAttribute('title', 'Clear value');
    clrBtn.addEventListener('click', async () => {
      inp.value = '';
      this.plugin.settings[id] = '';
      await this.plugin.saveSettings();
    });

    if (canDelete) {
      const delBtn = row.createEl('button', { cls: 'ltv-btn ltv-delete-var', text: '🗑' });
      delBtn.setAttribute('title', 'Delete variable');
      delBtn.addEventListener('click', async () => {
        this.plugin.settings._customVars = (this.plugin.settings._customVars || []).filter(v => v.id !== id);
        delete this.plugin.settings[id];
        await this.plugin.saveSettings();
        this.render();
      });
    }
  }

  async handleClearAll() {
    for (const cat of CATEGORIES) {
      for (const v of cat.vars) {
        this.plugin.settings[v.id] = '';
      }
    }
    for (const v of (this.plugin.settings._customVars || [])) {
      this.plugin.settings[v.id] = '';
    }
    await this.plugin.saveSettings();
    new Notice('All target variables cleared.');
    this.render();
  }
}

class LiveTargetPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new LiveTargetView(leaf, this));
    this.addRibbonIcon('crosshair', 'Live Target Variables', () => this.activateView());
    this.addCommand({
      id: 'open-panel',
      name: 'Open Live Target Variables panel',
      callback: () => this.activateView(),
    });

    this.registerMarkdownPostProcessor((el) => {
      this.substituteVars(el);
    });
  }

  substituteVars(el) {
    const values = this.settings;
    el.querySelectorAll('code').forEach(code => {
      if (!code.textContent.includes('{{')) return;
      code.innerHTML = code.innerHTML.replace(
        /\{\{([A-Z0-9_]+)\}\}/g,
        (match, name) => {
          const val = values[name];
          if (val) {
            return `<span class="ltv-val" title="${name}">${val}</span>`;
          }
          return `<span class="ltv-empty">${match}</span>`;
        }
      );
      // Override Obsidian's copy button: it captures innerText in a closure
      // before our postprocessor runs, so we replace it with a fresh handler
      // that reads code.textContent at click time (already substituted).
      const pre = code.closest('pre');
      if (!pre) return;
      const copyBtn = pre.querySelector('.copy-code-button');
      if (!copyBtn) return;
      const fresh = copyBtn.cloneNode(true); // copies appearance, drops listeners
      copyBtn.replaceWith(fresh);
      fresh.addEventListener('click', (e) => {
        e.stopPropagation();
        // Clone and strip user-select:none children (line numbers from themes/plugins).
        // We check computed styles on the live elements before cloning, then
        // remove the matching positions in the detached clone.
        const clone = code.cloneNode(true);
        const origEls = Array.from(code.querySelectorAll('*'));
        const cloneEls = Array.from(clone.querySelectorAll('*'));
        origEls.forEach((el, i) => {
          const cs = window.getComputedStyle(el);
          const us = cs.userSelect || cs.webkitUserSelect;
          if (us === 'none' && cloneEls[i]) cloneEls[i].remove();
        });
        navigator.clipboard.writeText(clone.textContent);
        const prev = fresh.textContent;
        fresh.textContent = 'Copied!';
        setTimeout(() => { fresh.textContent = prev; }, 2000);
      });
    });
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activateView() {
    const ws = this.app.workspace;
    let leaf = ws.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = ws.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    ws.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, await this.loadData() || {});
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.getLeavesOfType('markdown').forEach(leaf => {
      if (leaf.view instanceof MarkdownView) {
        leaf.view.previewMode.rerender(true);
      }
    });
  }
}

module.exports = LiveTargetPlugin;
