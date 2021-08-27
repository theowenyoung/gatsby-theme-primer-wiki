---
tags:
  - Tips
  - Linux
  - Commands
  - Bash
---

# Linux Common Commands

## View current system info

```bash
lsb_release -a
```

Output:

```bash
Distributor ID:	Debian
Description:	Debian GNU/Linux 10 (buster)
Release:	10
Codename:	buster
```

## View all users

```bash
cat /etc/passwd | grep -v nologin|grep -v halt|grep -v shutdown|awk -F":" '{ print $1"|"$3"|"$4 }'|more
```

## Get Publish IP

```bash
hostname -I
```

## Change user group

```bash
usermod -g groupname username
```

## Get user group

```bash
id -g -n
```

## Remove apt ppa

```bash
sudo add-apt-repository --remove ppa:qbittorrent-team/qbittorrent-stable
```

## Get current shell

```bash
echo "$SHELL"
```

## Get current cpu arch

```bash
arch
```

or

```bash
dpkg --print-architecture
```

## Unzip tar.gz

```bash
tar -xf x.tar.gz
```

See also [here](https://linuxize.com/post/how-to-extract-unzip-tar-gz-file/)

Tar to specific directory

```bash
tar -xf x.tar.gz -C ./xxx
```
