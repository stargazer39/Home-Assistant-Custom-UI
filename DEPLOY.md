# Deploy To Home Assistant

Use the SFTP deploy scripts from PowerShell or Bash. They assume SSH keys are already configured.

## Windows PowerShell

```powershell
.\tools\deploy-home-assistant-sftp.ps1 -HostName homeassistant.local -UserName root
```

If your Home Assistant config directory is not `/config`, pass it explicitly:

```powershell
.\tools\deploy-home-assistant-sftp.ps1 -HostName 192.168.1.10 -UserName root -RemoteConfigPath /homeassistant
```

Preview the SFTP commands without uploading:

```powershell
.\tools\deploy-home-assistant-sftp.ps1 -HostName homeassistant.local -UserName root -DryRun
```

## Linux / macOS

```bash
chmod +x ./tools/deploy-home-assistant-sftp.sh
./tools/deploy-home-assistant-sftp.sh --host homeassistant.local --user root
```

If your Home Assistant config directory is not `/config`, pass it explicitly:

```bash
./tools/deploy-home-assistant-sftp.sh --host 192.168.1.10 --user root --remote-config-path /homeassistant
```

Preview the SFTP commands without uploading:

```bash
./tools/deploy-home-assistant-sftp.sh --host homeassistant.local --user root --dry-run
```

## Uploaded Files

The script uploads:

- `themes/hatsune-miku.yaml` to `/config/themes/`
- `www/hatsune-miku-background.webp` to `/config/www/`
- `www/hatsune-miku-icons/` to `/config/www/hatsune-miku-icons/`
- `dashboard/` to `/config/www/dashboard/`

For sidebar icon replacement, make sure `configuration.yaml` includes:

```yaml
frontend:
  extra_module_url:
    - /local/hatsune-miku-icons/hatsune-miku-iconset.js
```
