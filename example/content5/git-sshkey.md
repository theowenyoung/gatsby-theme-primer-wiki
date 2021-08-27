---
tags:
  - Git
  - SSH
  - Auth
---

# Use ssh key for Git

Reference: [Generating a new SSH key and adding it to the ssh-agent - GitHub Docs](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

## Generate ssh key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Start the ssh-agent in the background.
eval "$(ssh-agent -s)"
# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519
```

## Add ssh key to Github

```bash
cat .ssh/id_ed25519.pub
```

[SSH Keys Setting](https://github.com/settings/keys)
