<#
  anno_gen.ps1 — data-sb-anno 속성 기반 어노테이션 좌표 자동 생성

  사용법:
    powershell -ExecutionPolicy Bypass -File "anno_gen.ps1" -pageId "A20" -path "admin/apply-sponsor-detail.html"

  동작:
    1. HTML을 Chrome headless로 열어 data-sb-anno 요소의 top-left 좌표를 추출
    2. 전체 페이지 기준 % 좌표로 변환
    3. data/specs/{pageId}.js 의 ANNOTATIONS 블록을 자동 갱신

  HTML에 추가할 속성 예시:
    <div class="filter-card" data-sb-anno="1:검색·필터 영역">
    <div class="list-top"   data-sb-anno="2:목록 상단">
    <div class="table-wrap" data-sb-anno="3:목록 테이블">
    <div class="pagination" data-sb-anno="4:페이지네이션">
#>
param(
  [Parameter(Mandatory)][string]$pageId,
  [Parameter(Mandatory)][string]$path
)

$chrome  = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$baseDir = $PSScriptRoot
$outDir  = Join-Path $baseDir "..\outputs"
$specDir = Join-Path $baseDir "data\specs"

function Send-WS {
  param([System.Net.WebSockets.ClientWebSocket]$ws,[int]$id,[string]$method,[hashtable]$params=@{})
  $json  = @{id=$id;method=$method;params=$params} | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $seg   = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
  $ws.SendAsync($seg,[System.Net.WebSockets.WebSocketMessageType]::Text,$true,[System.Threading.CancellationToken]::None).Wait()
  $buf   = New-Object byte[] 2097152
  $result = ""
  do {
    $s    = New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)
    $recv = $ws.ReceiveAsync($s,[System.Threading.CancellationToken]::None).Result
    $result += [System.Text.Encoding]::UTF8.GetString($buf,0,$recv.Count)
  } while (!$recv.EndOfMessage)
  return $result | ConvertFrom-Json
}

# ── 파일 확인 ─────────────────────────────────────
$filePath = Join-Path $outDir $path
if (!(Test-Path $filePath)) { Write-Host "HTML 파일 없음: $filePath" -ForegroundColor Red; exit 1 }

$specFile = Join-Path $specDir "$pageId.js"
if (!(Test-Path $specFile)) { Write-Host "spec 파일 없음: $specFile" -ForegroundColor Red; exit 1 }

# ── Chrome CDP 실행 ──────────────────────────────
$width   = 1920
$port    = Get-Random -Minimum 9300 -Maximum 9399
$tmpProf = Join-Path ([System.IO.Path]::GetTempPath()) "chrome_anno_$port"
$fileUri = "file:///" + ((Resolve-Path $filePath).Path -replace '\\','/')

$proc = Start-Process $chrome -ArgumentList @(
  "--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage",
  "--disable-web-security","--allow-file-access-from-files",
  "--user-data-dir=$tmpProf","--remote-debugging-port=$port",
  "--window-size=${width},900",$fileUri
) -PassThru

Start-Sleep -Milliseconds 2500

try {
  $json    = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
  $pageTab = $json | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
  if (-not $pageTab) { $pageTab = $json[0] }

  $ws  = New-Object System.Net.WebSockets.ClientWebSocket
  $cts = New-Object System.Threading.CancellationTokenSource
  $ws.ConnectAsync([Uri]$pageTab.webSocketDebuggerUrl,$cts.Token).Wait()
  $cmdId = 1

  # 페이지 로드 대기
  for ($i=0;$i -lt 20;$i++) {
    $r = Send-WS $ws $cmdId "Runtime.evaluate" @{expression="document.readyState";returnByValue=$true}
    $cmdId++
    if ($r.result.result.value -eq "complete") { break }
    Start-Sleep -Milliseconds 300
  }
  Start-Sleep -Milliseconds 2000

  # 전체 페이지 높이 측정 (capture_single.ps1 동일 로직)
  $jsHeight = @"
(() => {
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position==='fixed'||cs.position==='sticky') el.style.position='relative';
    if (parseFloat(cs.minHeight)>300) el.style.minHeight='auto';
    if (el!==document.body&&el!==document.documentElement) {
      const ov=cs.overflow,ovy=cs.overflowY;
      if (ov==='hidden'||ovy==='hidden'||ov==='auto'||ovy==='auto'||ov==='scroll'||ovy==='scroll') {
        el.style.overflow='visible';el.style.height='auto';el.style.maxHeight='none';
      }
    }
  });
  const b=document.body,h=document.documentElement;
  return Math.max(b.scrollHeight,b.offsetHeight,h.scrollHeight,h.offsetHeight)+60;
})()
"@
  $r = Send-WS $ws $cmdId "Runtime.evaluate" @{expression=$jsHeight;returnByValue=$true}
  $cmdId++
  $pageHeight = [int]$r.result.result.value
  if ($pageHeight -lt 100) { $pageHeight = 3000 }

  # 뷰포트를 전체 페이지 크기로 설정
  Send-WS $ws $cmdId "Emulation.setDeviceMetricsOverride" @{
    width=$width;height=$pageHeight;deviceScaleFactor=1;mobile=$false
  } | Out-Null
  $cmdId++
  Start-Sleep -Milliseconds 500

  # data-sb-anno 요소 좌표 추출
  $jsAnno = @"
(() => {
  const els = document.querySelectorAll('[data-sb-anno]');
  const result = [];
  const pw = $width;
  const ph = $pageHeight;
  els.forEach(el => {
    const attr = el.getAttribute('data-sb-anno');
    const parts = attr.split(':');
    const n = parseInt(parts[0]);
    const label = parts.slice(1).join(':').trim();
    const rect = el.getBoundingClientRect();
    // top-left 좌표를 % 로 변환 (소수점 1자리)
    const x = Math.round(rect.left / pw * 1000) / 10;
    const y = Math.round(rect.top  / ph * 1000) / 10;
    result.push({ n, x, y, label });
  });
  result.sort((a,b) => a.n - b.n);
  return JSON.stringify(result);
})()
"@
  $r = Send-WS $ws $cmdId "Runtime.evaluate" @{expression=$jsAnno;returnByValue=$true}
  $cmdId++

  $annos = $r.result.result.value | ConvertFrom-Json

  if (!$annos -or $annos.Count -eq 0) {
    Write-Host "data-sb-anno 요소를 찾지 못했습니다." -ForegroundColor Yellow
    Write-Host "HTML 파일에 data-sb-anno=`"N:라벨`" 속성을 추가했는지 확인하세요." -ForegroundColor Yellow
    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"",$cts.Token).Wait()
    exit 1
  }

  # ── 결과 출력 ──────────────────────────────────
  Write-Host ""
  Write-Host "── 추출 결과 (${pageId}, 페이지 ${width}x${pageHeight}) ──" -ForegroundColor Cyan
  foreach ($a in $annos) {
    Write-Host "  n:$($a.n)  x:$($a.x)%  y:$($a.y)%  // $($a.label)" -ForegroundColor White
  }

  # ── ANNOTATIONS 배열 문자열 생성 ───────────────
  $lines = @("window.ANNOTATIONS['$pageId'] = [")
  foreach ($a in $annos) {
    $xStr = "{0:F1}" -f [double]$a.x
    $yStr = "{0:F1}" -f [double]$a.y
    # 정수면 소수점 제거
    if ($a.x -eq [math]::Floor($a.x)) { $xStr = [int]$a.x }
    if ($a.y -eq [math]::Floor($a.y)) { $yStr = [int]$a.y }
    $lines += "  { n: $($a.n), x: $xStr, y: $yStr },   // $($a.label)"
  }
  $lines += "];"
  $newAnnoBlock = $lines -join "`n"

  # ── spec .js 파일 자동 갱신 ───────────────────
  $specContent = Get-Content $specFile -Raw -Encoding UTF8

  # ANNOTATIONS 블록 정규식: window.ANNOTATIONS[...] = [ ... ];
  $pattern = "window\.ANNOTATIONS\['" + [regex]::Escape($pageId) + "'\]\s*=\s*\[[\s\S]*?\];"
  if ($specContent -match $pattern) {
    $newContent = [regex]::Replace($specContent, $pattern, $newAnnoBlock)
    [System.IO.File]::WriteAllText($specFile, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host ""
    Write-Host "OK  $specFile 자동 갱신 완료" -ForegroundColor Green
  } else {
    Write-Host ""
    Write-Host "spec 파일에서 ANNOTATIONS 블록을 찾지 못했습니다." -ForegroundColor Yellow
    Write-Host "아래 내용을 수동으로 붙여넣으세요:" -ForegroundColor Yellow
    Write-Host $newAnnoBlock -ForegroundColor Gray
  }

  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"",$cts.Token).Wait()

} catch {
  Write-Host "오류: $($_.Exception.Message)" -ForegroundColor Red
} finally {
  if ($proc -and !$proc.HasExited) { $proc.Kill() }
}
