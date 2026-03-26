# ============================================
# foresto_homepage 전체 페이지 풀스크린샷 캡처
# Chrome CDP (DevTools Protocol) 사용
# fixed 헤더 → relative 변환 후 캡처 (중간 반복 방지)
# ============================================

$chrome    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222
$baseDir   = "C:\Users\BN659\Desktop\배은아\기획PM\projects\foresto_homepage\outputs"
$outDir    = "C:\Users\BN659\Desktop\배은아\기획PM\projects\foresto_homepage\screenshots"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# ── 캡처할 페이지 목록 ──────────────────────
$pages = @(
  @{name="01_홈_메인";                  path="index.html"},
  @{name="02_소개_인사말";              path="about/index.html"},
  @{name="03_소개_미션비전";            path="about/vision.html"},
  @{name="04_소개_주요사업";            path="about/project.html"},
  @{name="05_소개_연혁";               path="about/history.html"},
  @{name="06_소개_오시는길";            path="about/contact.html"},
  @{name="07_소개_조직도임원진";        path="about/members.html"},
  @{name="08_소개_전국지역협회";        path="about/regions.html"},
  @{name="09_소개_지역협회상세";        path="about/region-detail.html"},
  @{name="10_소개_회원규정";            path="about/regulation.html"},
  @{name="11_소개_정회원가입안내";      path="participate/membership.html"},
  @{name="12_소개_정회원신청";          path="participate/regular-apply.html"},
  @{name="13_소개_후원안내";            path="participate/donate-info.html"},
  @{name="14_소개_후원하기";            path="participate/donate.html"},
  @{name="15_교육_숲해설가란";          path="education/forester.html"},
  @{name="16_교육_FAQ";                path="education/faq.html"},
  @{name="17_교육_기초과정개요";        path="education/academy.html"},
  @{name="18_교육_기초과정신청";        path="education/academy-apply.html"},
  @{name="19_교육_자격취득과정";        path="education/course-intro.html"},
  @{name="20_교육_과정신청목록";        path="education/course-list.html"},
  @{name="21_교육_과정상세";            path="education/course-detail.html"},
  @{name="22_교육_수료생후기";          path="education/reviews.html"},
  @{name="23_교육_수료생후기상세";      path="education/review-detail.html"},
  @{name="24_교육_역량강화과정";        path="education/job-training.html"},
  @{name="25_교육_역량강화신청";        path="education/job-training-apply.html"},
  @{name="26_회원_특강목록";            path="member/competency.html"},
  @{name="27_회원_특강상세";            path="member/competency-detail.html"},
  @{name="28_회원_강좌목록";            path="member/academy-course.html"},
  @{name="29_회원_강좌상세";            path="member/academy-course-detail.html"},
  @{name="30_회원_멘토링목록";          path="member/mentoring.html"},
  @{name="31_회원_멘토링상세";          path="member/mentoring-detail.html"},
  @{name="32_회원_사공단";             path="member/sagongdan.html"},
  @{name="33_회원_사공단소식";          path="member/sagongdan-news.html"},
  @{name="34_회원_사공단일지";          path="member/sagongdan-log.html"},
  @{name="35_회원_동아리단";            path="member/club.html"},
  @{name="36_회원_강사신청";            path="member/instructor.html"},
  @{name="37_커뮤_공지사항";            path="community/notice-list.html"},
  @{name="38_커뮤_공지상세";            path="community/notice-detail.html"},
  @{name="39_커뮤_협회캘린더";          path="community/calendar.html"},
  @{name="40_커뮤_협회지목록";          path="community/newsletter.html"},
  @{name="41_커뮤_협회지상세";          path="community/newsletter-detail.html"},
  @{name="42_커뮤_언론보도목록";        path="community/press.html"},
  @{name="43_커뮤_언론보도상세";        path="community/press-detail.html"},
  @{name="44_커뮤_갤러리";             path="community/gallery.html"},
  @{name="45_커뮤_갤러리상세";          path="community/gallery-detail.html"},
  @{name="46_커뮤_자료실";             path="community/archive.html"},
  @{name="47_커뮤_자료실상세";          path="community/archive-detail.html"},
  @{name="48_숲해설신청";              path="forest/index.html"},
  @{name="49_사이트맵";                path="sitemap.html"},
  @{name="50_이용약관";                path="terms.html"},
  @{name="51_개인정보처리방침";         path="privacy.html"},
  @{name="52_이메일무단수집거부";       path="email.html"}
)

# ── fixed 헤더 제거 + body padding 초기화 JS ─
# position:fixed 요소를 relative로 전환 → 중간에 헤더 반복 없이 자연스러운 전체 페이지 캡처
$fixHeaderJS = @"
(function(){
  var hdr = document.querySelector('.site-header');
  if(hdr){
    hdr.style.position = 'relative';
    hdr.style.top = '0';
    hdr.style.left = '0';
    hdr.style.right = '0';
    hdr.style.zIndex = '1';
  }
  document.body.style.paddingTop = '0';
  // 스크롤바 gutter 제거 → 콘텐츠가 뷰포트 전체 너비(1920px)를 사용하도록
  var st = document.createElement('style');
  st.textContent = '::-webkit-scrollbar{width:0!important;height:0!important}html,body{scrollbar-width:none!important;overflow-y:visible!important}';
  document.head.appendChild(st);
  // 모바일 드로어 닫기
  var nav = document.getElementById('mobileNav');
  if(nav) nav.style.display = 'none';
})();
"@

# ── CDP 헬퍼 함수 ────────────────────────────
function Send-CDP {
  param($ws, $id, $method, $params = @{})
  $msg   = @{id=$id; method=$method; params=$params} | ConvertTo-Json -Depth 10 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
  $seg   = [System.ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true,
    [System.Threading.CancellationToken]::None).Wait()
}

function Recv-CDP {
  param($ws, [int]$timeoutMs = 8000)
  # 청크 방식으로 수신 - 스크린샷 base64가 수십 MB를 초과해도 안전하게 처리
  $chunk = [byte[]]::new(65536)   # 64KB 청크
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

# ── Chrome 시작 ──────────────────────────────
Write-Host "Chrome 시작 중..." -ForegroundColor Cyan
$proc = Start-Process $chrome -ArgumentList @(
  "--headless=new",
  "--remote-debugging-port=$debugPort",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--disable-extensions",
  "--font-render-hinting=none",
  "about:blank"
) -PassThru
Start-Sleep -Milliseconds 2500

# CDP 연결
try {
  $targets = Invoke-RestMethod "http://localhost:$debugPort/json/list" -ErrorAction Stop
} catch {
  Write-Host "재시도..." -ForegroundColor Yellow
  Start-Sleep -Milliseconds 2000
  $targets = Invoke-RestMethod "http://localhost:$debugPort/json/list"
}

$wsUrl = ($targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1).webSocketDebuggerUrl
$ws    = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()
Write-Host "CDP 연결 완료`n" -ForegroundColor Green

$msgId = 1
$ok    = 0
$fail  = 0
$total = $pages.Count

foreach ($page in $pages) {
  $fileUrl = ("file:///" + $baseDir + "/" + $page.path) -replace '\\','/'
  $outFile = "$outDir\$($page.name).png"
  Write-Host "[$($ok+$fail+1)/$total] $($page.name)" -NoNewline

  try {
    # 1. 페이지 이동
    Send-CDP $ws $msgId "Page.navigate" @{url=$fileUrl}
    $null = Wait-CDP $ws $msgId 12000
    $msgId++
    Start-Sleep -Milliseconds 1000   # JS·폰트·이미지 로드 대기

    # 2. fixed 헤더 → relative 변환 + padding 제거
    Send-CDP $ws $msgId "Runtime.evaluate" @{
      expression    = $fixHeaderJS
      returnByValue = $true
    }
    $null = Wait-CDP $ws $msgId 3000
    $msgId++

    # 3. 전체 페이지 높이 재측정 (레이아웃 변경 반영)
    Send-CDP $ws $msgId "Runtime.evaluate" @{
      expression    = "(function(){var f=document.getElementById('ftr');if(f){var r=f.getBoundingClientRect();return Math.round(r.bottom+window.scrollY);}return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);})();"
      returnByValue = $true
    }
    $hResp = Wait-CDP $ws $msgId 5000
    $msgId++
    $pageH = if ($hResp.result.result.value) { [int]$hResp.result.result.value } else { 5000 }
    $pageH = [Math]::Max($pageH, 800)
    $pageH = [Math]::Min($pageH, 20000)

    # 4. 뷰포트를 전체 높이로 설정
    Send-CDP $ws $msgId "Emulation.setDeviceMetricsOverride" @{
      width             = 1920
      height            = $pageH
      deviceScaleFactor = 1
      mobile            = $false
    }
    $null = Wait-CDP $ws $msgId 3000
    $msgId++

    # 5. 스크린샷 캡처
    Send-CDP $ws $msgId "Page.captureScreenshot" @{
      format = "png"
      clip   = @{ x=0; y=0; width=1920; height=$pageH; scale=1 }
    }
    $ssResp = Wait-CDP $ws $msgId 20000
    $msgId++

    if ($ssResp.result.data) {
      [System.IO.File]::WriteAllBytes($outFile, [Convert]::FromBase64String($ssResp.result.data))
      Write-Host "  ✓  ${pageH}px" -ForegroundColor Green
      $ok++
    } else {
      Write-Host "  ✗ 데이터 없음" -ForegroundColor Red
      $fail++
    }

  } catch {
    Write-Host "  ✗ $_" -ForegroundColor Red
    $fail++
  }
}

# 종료
try {
  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "",
    [System.Threading.CancellationToken]::None) | Out-Null
} catch {}
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host " 완료:  성공 $ok  /  실패 $fail  /  전체 $total" -ForegroundColor Cyan
Write-Host " 저장:  $outDir"                           -ForegroundColor Cyan
Write-Host "========================================"  -ForegroundColor Cyan
