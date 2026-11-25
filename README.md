# RedVars – Live Target Variables

An [Obsidian](https://obsidian.md) plugin for penetration testers and security researchers.

Fill in target values once in the right-side panel — IP addresses, ports, hashes, domain names, credentials — and every `{{VAR}}` placeholder inside your notes' code blocks is replaced live in Reading View. Copy buttons on code blocks paste the substituted values, not the raw placeholders.

![RedVars panel screenshot](https://raw.githubusercontent.com/sideswipeishacking/redvars/main/docs/screenshot.png)

---

## Features

- **70+ built-in variables** across 10 security categories: Attacker, Target Network, Active Directory, Credentials & Hashes, Shells & Payloads, Lateral Movement, Exfiltration, Recon, Web Hacking, Wireless
- **Live substitution** in Reading View — values update instantly as you type, no reload needed
- **Custom variables** — add your own `{{VAR}}` names with descriptions, organised into custom sections you can create and rename
- **Smart copy** — Obsidian's code block copy button pastes the real values (strips line numbers from themed code blocks too)
- **Compact collapsible panel** — each category is a collapsible `<details>` block; fits neatly in a narrow side pane
- **Persistent** — values survive Obsidian restarts via the plugin's `data.json`

---

## Installation

### Community Plugin Store (recommended)
1. Open Obsidian → **Settings → Community plugins → Browse**
2. Search for **RedVars**
3. Click **Install** then **Enable**

### Manual
1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/sideswipeishacking/redvars/releases/latest)
2. Create folder `<your-vault>/.obsidian/plugins/redvars/`
3. Copy the three files into that folder
4. Open Obsidian → **Settings → Community plugins** → enable **RedVars – Live Target Variables**

---

## Usage

### Opening the panel
- Click the **crosshair (⊕)** icon in the left ribbon  
- Or run the command **Open Live Target Variables panel** from the Command Palette

### Setting values
Type into the input next to any variable name. Changes are auto-saved after 400 ms and immediately reflected in all open Reading View notes.

### Using placeholders in notes
Wrap any variable ID in double curly braces inside a fenced code block:

````markdown
```bash
evil-winrm -u {{USERNAME}} -H {{NTLM_HASH}} -i {{RHOST}}
```
````

Filled variables render in **green**; empty ones stay **orange** so you know what still needs a value.

### Custom variables & sections
At the bottom of the panel:
- **New section row** — type a section name and press `+ Section` to create a named group
- **Add variable row** — type a `VAR_NAME`, optional description, pick a section from the dropdown, press `+ Var`
- Hover a custom section header to reveal **✎ rename** and **✕ delete** controls

---

## Variable reference

| Category | Example variables |
|---|---|
| Attacker (Global) | `LHOST` `LPORT` `ATTACKER_IFACE` `WORDLIST_DIR` |
| Target Network | `RHOST` `RPORT` `TARGET_HOSTNAME` `TARGET_FQDN` `DNS_IP` |
| Active Directory | `DOMAIN` `DOMAIN_FQDN` `DC_IP` `AD_USER` `NTLM_HASH` `KERBEROS_TICKET` `DMSA_NAME` `SPN` `OU_PATH` |
| Credentials & Hashes | `USERNAME` `PASSWORD` `HASH` `SSH_KEY` `TICKET_FILE` |
| Shells & Payloads | `PAYLOAD_OS` `PAYLOAD_FORMAT` `PAYLOAD_OUT` `CMD_PAYLOAD` |
| Lateral Movement | `SERVICE_NAME` `SERVICE_PATH` `SHARE_IP` `TASK_NAME` `SESSION_ID` |
| Exfiltration | `EXFIL_IP` `EXFIL_PORT` `DATA_PATH` |
| Recon | `TARGET_DOMAIN` `RECON_PROJECT` `SNMP_COMMUNITY` |
| Web Hacking | `WEB_URL` `WEB_PATH` `WEB_PARAM` `WORDLIST` |
| Wireless | `BSSID` `CHANNEL` `ESSID` `WLAN_IFACE` `CAPTURE_FILE` |

---

## License

MIT © [sideswipeishacking](https://github.com/sideswipeishacking)
