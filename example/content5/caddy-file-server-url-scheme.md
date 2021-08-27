---
tags:
  - Medias
  - Files
  - Server
  - Proxies
  - Templates
---

# Caddy File Server Browser with URL Scheme

[Template](https://gist.github.com/theowenyoung/e09cb6e2c59f247fdc3f4e6fe4401481)

Use this template to display the follow page:
![](../attachments/caddy-file-template-screenshot.png)

```bash
localhost {
  root * /root
  encode gzip
  file_server {
    browse ./file-browser-template-for-caddy.html
    hide .*
  }
}
```
