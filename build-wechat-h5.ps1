$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $root "index.html"
$cssPath = Join-Path $root "styles.css"
$jsPath = Join-Path $root "app.js"
$configPath = Join-Path $root "player-config.js"
$iconPath = Join-Path $root "basketball-icon.svg"
$outputDir = Join-Path $root "wechat-h5"
$outputPath = Join-Path $outputDir "index.html"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$html = Get-Content -Raw -Encoding UTF8 $indexPath
$css = Get-Content -Raw -Encoding UTF8 $cssPath
$js = Get-Content -Raw -Encoding UTF8 $jsPath
$configJs = if (Test-Path $configPath) { Get-Content -Raw -Encoding UTF8 $configPath } else { "" }
$icon = Get-Content -Raw -Encoding UTF8 $iconPath
$iconData = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($icon))
$iconHref = "data:image/svg+xml;base64,$iconData"
$configInline = if ($configJs) { "<script>`r`n$configJs`r`n</script>`r`n" } else { "" }

$html = $html -replace '<link rel="manifest"[^>]*>\s*', ''
$html = $html -replace '<link rel="icon"[^>]*>', "<link rel=""icon"" href=""$iconHref"" type=""image/svg+xml"" />"
$html = $html -replace '<link rel="stylesheet"[^>]*>', "<style>`r`n$css`r`n</style>"
$html = $html -replace '<script src="\./player-config\.js[^"]*"></script>\s*', ''
$html = $html -replace '<script src="\./app\.js[^"]*"></script>', "$configInline<script>`r`n$js`r`n</script>"

$wechatNotice = @'
      <section class="offline-note" aria-label="wechat notice">
        &#24494;&#20449;&#38142;&#25509;&#29256;&#65306;&#24494;&#20449;&#37324;&#30452;&#25509;&#25171;&#24320;&#21363;&#21487;&#35760;&#20998;&#12290;&#25968;&#25454;&#20445;&#23384;&#22312;&#24403;&#21069;&#25163;&#26426;&#30340;&#24494;&#20449;&#27983;&#35272;&#22120;&#37324;&#65307;&#27604;&#36187;&#32467;&#26463;&#21518;&#24314;&#35758;&#28857;&#8220;&#22797;&#21046;&#35760;&#24405;&#30721;&#8221;&#25110;&#8220;&#20445;&#23384;&#27604;&#36187;&#35760;&#24405;&#8221;&#30041;&#26723;&#12290;
      </section>

'@

$html = $html -replace '      <section class="result-strip" id="resultStrip" aria-live="polite"></section>\s*', "      <section class=""result-strip"" id=""resultStrip"" aria-live=""polite""></section>`r`n`r`n$wechatNotice"

$html = $html -replace '</style>', @'

.offline-note {
  margin: -4px 0 14px;
  padding: 10px 12px;
  color: #075b49;
  background: #ecf8f4;
  border: 1px solid #b9ded4;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}
</style>
'@

Set-Content -Path $outputPath -Encoding UTF8 -Value $html

Write-Host "Built WeChat H5 file:"
Write-Host $outputPath
