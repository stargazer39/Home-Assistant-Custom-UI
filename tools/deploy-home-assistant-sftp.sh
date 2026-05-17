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
batch_file="$(mktemp)"

cleanup() {
  rm -f "$batch_file"
}
trap cleanup EXIT

cat > "$batch_file" <<SFTP
lcd "$repo_root"
-mkdir "$remote_config/themes"
-mkdir "$remote_config/www"
-mkdir "$remote_config/www/hatsune-miku-icons"
put "themes/hatsune-miku.yaml" "$remote_config/themes/hatsune-miku.yaml"
put "www/hatsune-miku-background.webp" "$remote_config/www/hatsune-miku-background.webp"
put -r "www/hatsune-miku-icons" "$remote_config/www/"
put -r "dashboard/*" "$remote_config/www/dashboard/"
bye
SFTP

if [[ "$dry_run" == "true" ]]; then
  echo "SFTP target: $remote"
  echo "Remote Home Assistant config path: $remote_config"
  echo
  cat "$batch_file"
  exit 0
fi

echo "Deploying Home Assistant custom UI files to ${remote}:${remote_config} ..."
sftp -P "$port" -b "$batch_file" "$remote"
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
