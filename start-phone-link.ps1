param(
  [switch]$NoOpen,
  [switch]$NoPause
)

$ErrorActionPreference = "Stop"
$port = 8787
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$appVersion = "10"
$localUrl = "http://localhost:$port/?v=$appVersion"

function Get-PhoneIp {
  $adapters = Get-NetAdapter -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Status -eq "Up" -and
      $_.InterfaceDescription -notmatch "Virtual|VMware|Hyper-V|Loopback|TAP|Tunnel" -and
      $_.Name -notmatch "vEthernet|Virtual|Loopback|VMware|TAP|Tunnel"
    } |
    Sort-Object InterfaceMetric, ifIndex

  foreach ($adapter in $adapters) {
    $ip = Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $adapter.ifIndex -ErrorAction SilentlyContinue |
      Where-Object {
        $_.IPAddress -notmatch "^127\." -and
        $_.IPAddress -notmatch "^169\.254\." -and
        $_.IPAddress -match "^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)"
      } |
      Select-Object -First 1 -ExpandProperty IPAddress

    if ($ip) { return $ip }
  }

  return Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
      $_.IPAddress -notmatch "^127\." -and
      $_.IPAddress -notmatch "^169\.254\."
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
}

Set-Location $root

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host "Python was not found. Please install Python or run this on a computer with Python available." -ForegroundColor Red
  if (-not $NoPause) { Read-Host "Press Enter to close" | Out-Null }
  exit 1
}

$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
  Start-Process -FilePath $python.Source -ArgumentList @("-m", "http.server", "$port", "--bind", "0.0.0.0") -WorkingDirectory $root -WindowStyle Hidden
  Start-Sleep -Seconds 1
}

$ip = Get-PhoneIp
if (-not $ip) {
  Write-Host "No LAN IP was found. Make sure this computer is connected to Wi-Fi or the local network." -ForegroundColor Red
  if (-not $NoPause) { Read-Host "Press Enter to close" | Out-Null }
  exit 1
}

$phoneUrl = "http://$ip`:$port/?v=$appVersion"

try {
  Set-Clipboard -Value $phoneUrl
  $copyText = "Copied to clipboard"
} catch {
  $copyText = "Copy manually"
}

Write-Host ""
Write-Host "Basketball scorekeeper is running." -ForegroundColor Green
Write-Host ""
Write-Host "Phone link:" -ForegroundColor Cyan
Write-Host $phoneUrl -ForegroundColor Yellow
Write-Host ""
Write-Host "$copyText. Send this single link to the scorekeeper's phone." -ForegroundColor Cyan
Write-Host "Keep this computer on while phones are using the link." -ForegroundColor DarkGray
Write-Host ""

if (-not $NoOpen) {
  Start-Process $localUrl
}

if (-not $NoPause) {
  Read-Host "Press Enter to close this window" | Out-Null
}
