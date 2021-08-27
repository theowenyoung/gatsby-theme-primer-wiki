---
tags:
  - Setup
  - Files
---

# FileBrowser Setup

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
```

## Systemd

```bash
sudo vim /etc/systemd/system/filebrowser.service
```

```bash
[Unit]
Description=File browser: %I
After=network.target

[Service]
User=www-data
Group=www-data
ExecStart=/usr/local/sbin/filebrowser -c /etc/filebrowser/%I -d /etc/filebrowser/filebrowser.db

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now filebrowser
```
