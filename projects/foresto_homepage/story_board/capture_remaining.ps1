# ============================================================
# 나머지 페이지 캡처 (U49~A32)
# capture.ps1 실행 후 크래시된 페이지 재캡처용
# ============================================================

$chrome    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222
$baseDir   = (Resolve-Path "$PSScriptRoot\..\outputs").Path
$outDir    = "$PSScriptRoot\images"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$pages = @(
  # 참여
  @{name="U49_참여_정회원_신청";               path="participate/regular-apply.html"},
  @{name="U50_참여_후원_안내";                 path="participate/donate-info.html"},
  @{name="U51_참여_후원하기";                  path="participate/donate.html"},
  @{name="U52_참여_숲해설신청";               path="forest/index.html"},
  # 인증
  @{name="U53_인증_로그인";                    path="auth/login.html"},
  @{name="U54_인증_아이디비밀번호찾기";        path="auth/find.html"},
  @{name="U55_인증_회원가입";                  path="auth/register.html"},
  # 마이페이지
  @{name="U56_마이페이지_홈";                  path="mypage/index.html"},
  @{name="U57_마이페이지_증명서미리보기";      path="mypage/certificate-preview.html"},
  # 기타
  @{name="U58_사이트맵";                       path="sitemap.html"},
  @{name="U59_이용약관";                       path="terms.html"},
  @{name="U60_개인정보처리방침";               path="privacy.html"},
  @{name="U61_이메일무단수집거부";             path="email.html"},
  # 관리자 — 회원관리
  @{name="A01_회원_목록";                      path="admin/members.html"},
  @{name="A02_회원_상세";                      path="admin/member-detail.html"},
  @{name="A03_회원_등록수정";                  path="admin/member-edit.html"},
  @{name="A04_탈퇴회원_목록";                  path="admin/members-withdrawn.html"},
  # 강좌관리
  @{name="A05_강좌_목록";                      path="admin/courses.html"},
  @{name="A06_강좌_상세";                      path="admin/course-detail.html"},
  @{name="A07_강좌_등록수정";                  path="admin/course-edit.html"},
  @{name="A08_강좌신청자_목록";               path="admin/applicants.html"},
  @{name="A09_강좌신청자_상세";               path="admin/applicant-detail.html"},
  # 강사 일정관리
  @{name="A10_강사일정_목록";                  path="admin/instructor-schedule.html"},
  @{name="A11_강사일정_등록수정";              path="admin/instructor-schedule-edit.html"},
  # 기타신청관리
  @{name="A12_정회원신청_목록";               path="admin/apply-regular.html"},
  @{name="A13_정회원신청_상세";               path="admin/apply-regular-detail.html"},
  @{name="A14_강사신청_목록";                  path="admin/apply-instructor.html"},
  @{name="A15_강사신청_상세";                  path="admin/apply-instructor-detail.html"},
  @{name="A16_숲해설신청_목록";               path="admin/apply-forest.html"},
  @{name="A17_숲해설신청_상세";               path="admin/apply-forest-detail.html"},
  @{name="A18_후원신청_목록";                  path="admin/apply-sponsor.html"},
  @{name="A19_후원신청_상세";                  path="admin/apply-sponsor-detail.html"},
  # 일정관리
  @{name="A20_일정_목록";                      path="admin/calendar.html"},
  @{name="A21_일정_상세";                      path="admin/calendar-detail.html"},
  @{name="A22_일정_등록수정";                  path="admin/calendar-edit.html"},
  # 게시판관리
  @{name="A23_게시판_목록";                    path="admin/board.html"},
  @{name="A24_게시판_글상세";                  path="admin/board-detail.html"},
  @{name="A25_게시판_글등록수정";              path="admin/board-edit.html"},
  # 콘텐츠관리
  @{name="A26_조직도임원진_관리";              path="admin/organization.html"},
  @{name="A27_연혁_목록";                      path="admin/history.html"},
  @{name="A28_연혁_등록수정";                  path="admin/history-edit.html"},
  @{name="A29_배너_목록";                      path="admin/banner.html"},
  @{name="A30_배너_등록수정";                  path="admin/banner-edit.html"},
  @{name="A31_팝업_목록";                      path="admin/popup.html"},
  @{name="A32_팝업_등록수정";                  path="admin/popup-edit.html"}
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
  # 혹시 남은 프로세스 정리
  Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq '' } | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 500

  $proc = Start-Process $chrome -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--disable-extensions",
    "--font-render-hinting=none",
    "about:blank"
  ) -PassThru
  Start-Sleep -Milliseconds 2500

  try {
    $targets = Invoke-RestMethod "http://localhost:$port/json/list" -ErrorAction Stop
  } catch {
    Start-Sleep -Milliseconds 2000
    $targets = Invoke-RestMethod "http://localhost:$port/json/list"
  }

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

$msgId = 1; $ok = 0; $fail = 0; $total = $pages.Count
$batchSize = 20  # 20페이지마다 예방적 Chrome 재시작

function Restart-Chrome-Session {
  param($port, $procRef, $wsRef)
  Write-Host "`n--- Chrome 재시작 ---" -ForegroundColor Cyan
  try { $wsRef.Value.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"", [System.Threading.CancellationToken]::None).Wait() } catch {}
  $procRef.Value | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 2000
  $s = Start-Chrome $port
  $wsRef.Value   = $s.ws
  $procRef.Value = $s.proc
  Write-Host "재시작 완료`n" -ForegroundColor Green
  return 1  # 새 msgId
}

$wsRef   = [ref]$ws
$procRef = [ref]$proc

for ($i = 0; $i -lt $pages.Count; $i++) {
  $page = $pages[$i]

  # 예방적 재시작
  if ($i -gt 0 -and $i % $batchSize -eq 0) {
    $msgId = Restart-Chrome-Session $debugPort $procRef $wsRef
    $ws   = $wsRef.Value
    $proc = $procRef.Value
  }

  $fileUrl = ("file:///" + $baseDir + "/" + $page.path) -replace '\\','/'
  $outFile = "$outDir\$($page.name).png"
  Write-Host "[$($i+1)/$total] $($page.name)" -NoNewline

  $captured = $false
  $attempts = 0

  while (-not $captured -and $attempts -lt 2) {
    $attempts++
    try {
      $ws = $wsRef.Value
      Send-CDP $ws $msgId "Page.navigate" @{url=$fileUrl}
      $null = Wait-CDP $ws $msgId 12000; $msgId++

      $ref = [ref]$msgId
      Wait-Ready $ws $ref 10000
      $msgId = $ref.Value

      Start-Sleep -Milliseconds 2000

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
        Write-Host "  SKIP (no data)" -ForegroundColor Yellow; $fail++
        $captured = $true  # skip이면 재시도 없음
      }
    } catch {
      if ($attempts -lt 2) {
        Write-Host "  RETRY (Chrome 재시작)..." -ForegroundColor Yellow
        $msgId = Restart-Chrome-Session $debugPort $procRef $wsRef
        $ws   = $wsRef.Value
        $proc = $procRef.Value
      } else {
        Write-Host "  FAIL: $_" -ForegroundColor Red; $fail++
      }
    }
  }
}

try { $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"", [System.Threading.CancellationToken]::None).Wait() } catch {}
$proc | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n완료: $ok/$total 성공, $fail 실패" -ForegroundColor Cyan
Write-Host "출력 위치: $outDir" -ForegroundColor Cyan
