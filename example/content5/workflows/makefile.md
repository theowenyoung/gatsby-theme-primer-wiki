# Makefile Sample

```Makefile
.PHONY: start reload stop
start:
	systemctl start caddy
stop:
	systemctl stop caddy
reload:
	systemctl reload caddy
```
