#!/usr/bin/env bash
set -euo pipefail

host_name=""
user_name=""
port="22"
remote_config_path="/config"
dry_run="false"

usage() {
  cat <<'USAGE'
Usage:
  ./tools/deploy-home-assistant-sftp.sh --host HOST [--user USER] [--port 22] [--remote-config-path /config] [--dry-run]

Examples:
  ./tools/deploy-home-assistant-sftp.sh --host homeassistant.local --user root
  ./tools/deploy-home-assistant-sftp.sh --host 192.168.1.10 --user root --remote-config-path /homeassistant
  ./tools/deploy-home-assistant-sftp.sh --host homeassistant.local --user root --dry-run
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host|-h)
      host_name="${2:-}"
      shift 2
      ;;
    --user|-u)
      user_name="${2:-}"
      shift 2
      ;;
    --port|-p)
      port="${2:-}"
      shift 2
      ;;
    --remote-config-path|-r)
      remote_config_path="${2:-}"
      shift 2
      ;;
    --dry-run)
      dry_run="true"
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$host_name" ]]; then
  echo "Missing required --host value." >&2
  usage >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$script_dir/.." && pwd)"
remote="${host_name}"
if [[ -n "$user_name" ]]; then
  remote="${user_name}@${host_name}"
fi
remote_config="${remote_config_path%/}"

if [[ "$dry_run" == "true" ]]; then
  echo "SCP target: $remote"
  echo "Remote Home Assistant config path: $remote_config"
  echo "Port: $port"
  echo
  echo "Will execute:"
  echo "  ssh -p $port $remote mkdir -p $remote_config/themes $remote_config/www $remote_config/www/dashboard"
  echo "  scp -P $port $repo_root/themes/hatsune-miku.yaml $remote:$remote_config/themes/"
  echo "  scp -P $port $repo_root/www/hatsune-miku-background.webp $remote:$remote_config/www/"
  echo "  scp -P $port -r $repo_root/www/hatsune-miku-icons $remote:$remote_config/www/"
  echo "  scp -P $port -r $repo_root/dashboard/* $remote:$remote_config/www/dashboard/"
  exit 0
fi

echo "Deploying Home Assistant custom UI files to ${remote}:${remote_config} ..."


# Deploy files
scp -P "$port" "$repo_root/themes/hatsune-miku.yaml" "$remote:$remote_config/themes/"
scp -P "$port" "$repo_root/www/hatsune-miku-background.webp" "$remote:$remote_config/www/"
scp -P "$port" -r "$repo_root/www/hatsune-miku-icons" "$remote:$remote_config/www/"
scp -P "$port" -r "$repo_root/dashboard/ac-temp-status-card" "$remote:$remote_config/www"
scp -P "$port" -r "$repo_root/dashboard/battery-bar-card" "$remote:$remote_config/www"
scp -P "$port" -r "$repo_root/dashboard/samsung-smart-remote-card" "$remote:$remote_config/www"
echo
echo "Deploy complete."
echo "Restart Home Assistant or reload themes/resources if needed."
echo
echo "For sidebar icon replacement, make sure configuration.yaml contains:"
cat <<'YAML'
frontend:
  extra_module_url:
    - /local/hatsune-miku-icons/hatsune-miku-iconset.js
YAML
