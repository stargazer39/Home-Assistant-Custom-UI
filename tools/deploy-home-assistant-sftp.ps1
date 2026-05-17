param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,

  [string]$UserName = "",

  [int]$Port = 22,

  [string]$RemoteConfigPath = "/config",

  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$remote = if ($UserName) { "$UserName@$HostName" } else { $HostName }
$remoteConfig = $RemoteConfigPath.TrimEnd("/")
$batchFile = New-TemporaryFile

function Add-SftpCommand {
  param([string]$Command)
  Add-Content -Path $batchFile -Value $Command -Encoding ascii
}

try {
  Add-SftpCommand "lcd `"$repoRoot`""

  Add-SftpCommand "-mkdir `"$remoteConfig/themes`""
  Add-SftpCommand "-mkdir `"$remoteConfig/www`""
  Add-SftpCommand "-mkdir `"$remoteConfig/www/hatsune-miku-icons`""
  Add-SftpCommand "-mkdir `"$remoteConfig/www/dashboard`""

  Add-SftpCommand "put `"themes/hatsune-miku.yaml`" `"$remoteConfig/themes/hatsune-miku.yaml`""
  Add-SftpCommand "put `"www/hatsune-miku-background.webp`" `"$remoteConfig/www/hatsune-miku-background.webp`""
  Add-SftpCommand "put -r `"www/hatsune-miku-icons`" `"$remoteConfig/www/`""
  Add-SftpCommand "put -r `"dashboard`" `"$remoteConfig/www/`""

  Add-SftpCommand "bye"

  if ($DryRun) {
    Write-Host "SFTP target: $remote"
    Write-Host "Remote Home Assistant config path: $remoteConfig"
    Write-Host ""
    Get-Content -Path $batchFile
    exit 0
  }

  Write-Host "Deploying Home Assistant custom UI files to ${remote}:${remoteConfig} ..."
  sftp -P $Port -b $batchFile $remote
  Write-Host ""
  Write-Host "Deploy complete."
  Write-Host "Restart Home Assistant or reload themes/resources if needed."
  Write-Host ""
  Write-Host "For sidebar icon replacement, make sure configuration.yaml contains:"
  Write-Host "frontend:"
  Write-Host "  extra_module_url:"
  Write-Host "    - /local/hatsune-miku-icons/hatsune-miku-iconset.js"
}
finally {
  Remove-Item -LiteralPath $batchFile -Force -ErrorAction SilentlyContinue
}
