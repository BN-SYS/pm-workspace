# ============================================================
# 상세 페이지 재캡처 — URL 파라미터 포함
# 데이터가 JS로 렌더링되는 상세 페이지를 ?id=N 파라미터와 함께 캡처
# ============================================================

$chrome    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222
$baseDir   = (Resolve-Path "$PSScriptRoot\..\outputs").Path
$outDir    = "$PSScriptRoot\images"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# ── 상세 페이지 목록 (path에 ?id=N 파라미터 포함) ──────────────
$pages = @(
  # 사용자 — 소개
  @{name="U08_소개_지역협회_상세";             path="about/region-detail.html?id=1"},
  # 교육
  @{name="U17_교육_자격취득_상세";             path="education/course-detail.html?id=1000"},
  @{name="U21_교육_수료생_후기상세";           path="education/review-detail.html?id=1"},
  # 회원 전용
  @{name="U23_회원_특강_상세";                 path="member/competency-detail.html?id=4000"},
  @{name="U25_회원_아카데미강좌_상세";         path="member/academy-course-detail.html?id=5000"},
  @{name="U27_회원_멘토링_상세";               path="member/mentoring-detail.html?id=6000"},
  @{name="U33_회원_강사신청_일정상세";         path="member/instructor-detail.html?id=7000"},
  @{name="U35_회원_숲일터_상세";               path="member/forest-work-detail.html?id=3"},
  # 커뮤니티
  @{name="U37_커뮤니티_공지사항_상세";         path="community/notice-detail.html?id=9999"},
  @{name="U40_커뮤니티_협회지_상세";           path="community/newsletter-detail.html?id=10"},
  @{name="U42_커뮤니티_언론보도_상세";         path="community/press-detail.html?id=9801"},
  @{name="U44_커뮤니티_갤러리_상세";           path="community/gallery-detail.html?id=4"},
  @{name="U47_커뮤니티_자료실_상세";           path="community/archive-detail.html?id=20"},
  # 관리자
  @{name="A02_회원_상세";                      path="admin/member-detail.html?id=50"},
  @{name="A06_강좌_상세";                      path="admin/course-detail.html?id=1000"},
  @{name="A09_강좌신청자_상세";               path="admin/applicant-detail.html?id=2000"},
  @{name="A13_정회원신청_상세";               path="admin/apply-regular-detail.html?id=3000"},
  @{name="A15_강사신청_상세";                  path="admin/apply-instructor-detail.html?id=5000"},
  @{name="A17_숲해설신청_상세";               path="admin/apply-forest-detail.html?id=5000"},
  @{name="A19_후원신청_상세";                  path="admin/apply-sponsor-detail.html?id=6000"},
  @{name="A21_일정_상세";                      path="admin/calendar-detail.html?id=1"},
  @{name="A24_게시판_글상세";                  path="admin/board-detail.html?type=notice&id=1"}
)

$prepareJS = @"
(function(){
  var hdr = document.querySelector('.site-header');
  if(hdr){ hdr.style.position='relative'; hdr.style.top='0'; hdr.style.left='0'; hdr.style.right='0'; hdr.style.zIndex='1'; }
  document.body.style.paddingTop = '0';
  var nav = document.getElementById('mobileNav');
  if(nav) nav.style.display='none';
  var st = document.createElement('style');
  st.textContent = '::-webkit-scrollbar{width:0!important;height:0!important}html,body{scrollbar-width:none!important;overflow-y:visible!important}';
  document.head.appendChild(st);
  document.querySelectorAll('*').forEach(function(el){
    var mh = parseInt(window.getComputedStyle(el).minHeight);
    if(mh > 300) el.style.minHeight = 'unset';
  });
})();
"@

$measureJS = @"
(function(){
  var maxBottom = 0;
  document.querySelectorAll('body *').forEach(function(el){
    var s = window.getComputedStyle(el);
    if(s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return;
    var r = el.getBoundingClientRect();
    var bottom = r.bottom + window.pageYOffset;
    if(bottom > maxBottom) maxBottom = bottom;
  });
  return { w: Math.max(document.body.scrollWidth, 1920), h: Math.max(Math.ceil(maxBottom), 600) };
})()
"@

function Send-CDP {
  param($ws, $id, $method, $params = @{})
  $msg   = @{id=$id; method=$method; params=$params} | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
  $seg   = [System.ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
}

function Recv-CDP {
  param($ws, [int]$timeoutMs = 8000)
  $chunk = [byte[]]::new(65536)
  $seg   = [System.ArraySegment[byte]]::new($chunk)
  $acc   = [System.Collections.Generic.List[byte]]::new()
  $cts   = [System.Threading.CancellationTokenSource]::new($timeoutMs)
  try {
    do {
      $r = $ws.ReceiveAsync($seg, $cts.Token).GetAwaiter().GetResult()
      $acc.AddRange([System.ArraySegment[byte]]::new($chunk, 0, $r.Count))
    } while (-not $r.EndOfMessage)
    return [System.Text.Encoding]::UTF8.GetString($acc.ToArray()) | ConvertFrom-Json
  } catch { return $null }
}

function Wait-CDP {
  param($ws, [int]$id, [int]$timeoutMs = 15000)
  $deadline = [DateTime]::Now.AddMilliseconds($timeoutMs)
  while ([DateTime]::Now -lt $deadline) {
    $msg = Recv-CDP $ws 2000
    if ($msg -and $msg.id -eq $id) { return $msg }
  }
  return $null
}

function Wait-Ready {
  param($ws, [ref]$msgId, [int]$maxMs = 10000)
  $deadline = [DateTime]::Now.AddMilliseconds($maxMs)
  while ([DateTime]::Now -lt $deadline) {
    Send-CDP $ws $msgId.Value "Runtime.evaluate" @{expression="document.readyState"; returnByValue=$true}
    $r = Wait-CDP $ws $msgId.Value 2000
    $msgId.Value++
    if ($r -and $r.result.result.value -eq 'complete') { return }
    Start-Sleep -Milliseconds 300
  }
}

function Start-Chrome {
  param([int]$port)
  Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq '' } | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 500
  $proc = Start-Process $chrome -ArgumentList @(
    "--headless=new", "--remote-debugging-port=$port",
    "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--disable-extensions", "--font-render-hinting=none", "about:blank"
  ) -PassThru
  Start-Sleep -Milliseconds 2500
  try { $targets = Invoke-RestMethod "http://localhost:$port/json/list" -ErrorAction Stop }
  catch { Start-Sleep -Milliseconds 2000; $targets = Invoke-RestMethod "http://localhost:$port/json/list" }
  $wsUrl = ($targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1).webSocketDebuggerUrl
  $ws    = [System.Net.WebSockets.ClientWebSocket]::new()
  $ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()
  return @{ proc=$proc; ws=$ws }
}

# ── 메인 ──────────────────────────────────────────────────
Write-Host "Chrome 시작 중..." -ForegroundColor Cyan
$session = Start-Chrome $debugPort
$ws   = $session.ws
$proc = $session.proc
Write-Host "CDP 연결 완료`n" -ForegroundColor Green

$wsRef   = [ref]$ws
$procRef = [ref]$proc
$msgId   = 1; $ok = 0; $fail = 0; $total = $pages.Count
$batchSize = 12

for ($i = 0; $i -lt $pages.Count; $i++) {
  $page = $pages[$i]

  if ($i -gt 0 -and $i % $batchSize -eq 0) {
    Write-Host "`n--- Chrome 재시작 ($i/$total) ---" -ForegroundColor Cyan
    try { $wsRef.Value.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"", [System.Threading.CancellationToken]::None).Wait() } catch {}
    $procRef.Value | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 2000
    $s = Start-Chrome $debugPort; $wsRef.Value = $s.ws; $procRef.Value = $s.proc
    $msgId = 1
    Write-Host "재시작 완료`n" -ForegroundColor Green
  }

  # file:// URL은 ?query 파라미터를 그대로 지원
  $filePart  = $page.path -replace '\?.*', ''
  $queryPart = if ($page.path -match '\?(.+)') { "?$($Matches[1])" } else { '' }
  $fileUrl   = ("file:///" + $baseDir + "/" + $filePart) -replace '\\','/'
  $fileUrl  += $queryPart
  $outFile   = "$outDir\$($page.name).png"
  Write-Host "[$($i+1)/$total] $($page.name)" -NoNewline

  $captured = $false; $attempts = 0
  while (-not $captured -and $attempts -lt 2) {
    $attempts++
    try {
      $ws = $wsRef.Value
      Send-CDP $ws $msgId "Page.navigate" @{url=$fileUrl}
      $null = Wait-CDP $ws $msgId 12000; $msgId++

      $ref = [ref]$msgId
      Wait-Ready $ws $ref 10000
      $msgId = $ref.Value

      # 상세 페이지 JS 렌더링 충분히 대기
      Start-Sleep -Milliseconds 3000

      Send-CDP $ws $msgId "Runtime.evaluate" @{expression=$prepareJS; returnByValue=$true}
      $null = Wait-CDP $ws $msgId 3000; $msgId++
      Start-Sleep -Milliseconds 300

      Send-CDP $ws $msgId "Runtime.evaluate" @{expression=$measureJS; returnByValue=$true}
      $sizeRes = Wait-CDP $ws $msgId 5000; $msgId++
      $pw = [int]$sizeRes.result.result.value.w
      $ph = [int]$sizeRes.result.result.value.h

      Send-CDP $ws $msgId "Emulation.setDeviceMetricsOverride" @{
        width=1920; height=$ph; deviceScaleFactor=1; mobile=$false
      }
      $null = Wait-CDP $ws $msgId 3000; $msgId++
      Start-Sleep -Milliseconds 200

      Send-CDP $ws $msgId "Page.captureScreenshot" @{format="png"; captureBeyondViewport=$true}
      $ssRes = Wait-CDP $ws $msgId 30000; $msgId++

      if ($ssRes -and $ssRes.result.data) {
        [IO.File]::WriteAllBytes($outFile, [Convert]::FromBase64String($ssRes.result.data))
        Write-Host "  OK  (${pw}x${ph})" -ForegroundColor Green; $ok++
        $captured = $true
      } else {
        Write-Host "  SKIP (no data)" -ForegroundColor Yellow; $fail++; $captured = $true
      }
    } catch {
      if ($attempts -lt 2) {
        Write-Host "  RETRY..." -ForegroundColor Yellow
        try { $wsRef.Value.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"", [System.Threading.CancellationToken]::None).Wait() } catch {}
        $procRef.Value | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 2000
        $s = Start-Chrome $debugPort; $wsRef.Value = $s.ws; $procRef.Value = $s.proc; $msgId = 1
      } else { Write-Host "  FAIL: $_" -ForegroundColor Red; $fail++ }
    }
  }
}

try { $wsRef.Value.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"", [System.Threading.CancellationToken]::None).Wait() } catch {}
$procRef.Value | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n완료: $ok/$total 성공, $fail 실패" -ForegroundColor Cyan
Write-Host "출력 위치: $outDir" -ForegroundColor Cyan
