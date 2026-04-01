# ============================================================
# foresto_homepage 스토리보드 전체 캡처
# 출력: story_board/images/*.png
# 사용자 페이지(U__) + 관리자 페이지(A__) 구분 네이밍
# ============================================================

$chrome    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222
$baseDir   = "C:\Users\BN659\Desktop\배은아\기획PM\projects\foresto_homepage\outputs"
$outDir    = "C:\Users\BN659\Desktop\배은아\기획PM\projects\foresto_homepage\story_board\images"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# ── 사용자 페이지 ───────────────────────────────────────────
$userPages = @(
  # 메인
  @{name="U01_홈_메인";                        path="index.html"},
  # 소개
  @{name="U02_소개_인사말";                    path="about/index.html"},
  @{name="U03_소개_미션비전";                  path="about/vision.html"},
  @{name="U04_소개_주요사업";                  path="about/project.html"},
  @{name="U05_소개_연혁";                      path="about/history.html"},
  @{name="U06_소개_조직도임원진";              path="about/members.html"},
  @{name="U07_소개_전국지역협회";              path="about/regions.html"},
  @{name="U08_소개_지역협회_상세";             path="about/region-detail.html"},
  @{name="U09_소개_회원규정";                  path="about/regulation.html"},
  @{name="U10_소개_오시는길";                  path="about/contact.html"},
  # 교육
  @{name="U11_교육_숲해설가란";               path="education/forester.html"},
  @{name="U12_교육_FAQ";                       path="education/faq.html"},
  @{name="U13_교육_기초과정_개요";             path="education/academy.html"},
  @{name="U14_교육_기초과정_신청";             path="education/academy-apply.html"},
  @{name="U15_교육_자격취득_과정소개";         path="education/course-intro.html"},
  @{name="U16_교육_자격취득_목록";             path="education/course-list.html"},
  @{name="U17_교육_자격취득_상세";             path="education/course-detail.html"},
  @{name="U18_교육_역량강화_과정";             path="education/job-training.html"},
  @{name="U19_교육_역량강화_신청";             path="education/job-training-apply.html"},
  @{name="U20_교육_수료생_후기목록";           path="education/reviews.html"},
  @{name="U21_교육_수료생_후기상세";           path="education/review-detail.html"},
  # 회원 전용
  @{name="U22_회원_특강_목록";                 path="member/competency.html"},
  @{name="U23_회원_특강_상세";                 path="member/competency-detail.html"},
  @{name="U24_회원_아카데미강좌_목록";         path="member/academy-course.html"},
  @{name="U25_회원_아카데미강좌_상세";         path="member/academy-course-detail.html"},
  @{name="U26_회원_멘토링_목록";               path="member/mentoring.html"},
  @{name="U27_회원_멘토링_상세";               path="member/mentoring-detail.html"},
  @{name="U28_회원_사공단_소개";               path="member/sagongdan.html"},
  @{name="U29_회원_사공단_소식목록";           path="member/sagongdan-news.html"},
  @{name="U30_회원_사공단_일지목록";           path="member/sagongdan-log.html"},
  @{name="U31_회원_동아리_목록";               path="member/club.html"},
  @{name="U32_회원_강사신청_일정목록";         path="member/instructor.html"},
  @{name="U33_회원_강사신청_일정상세";         path="member/instructor-detail.html"},
  @{name="U34_회원_숲일터_목록";               path="member/forest-work.html"},
  @{name="U35_회원_숲일터_상세";               path="member/forest-work-detail.html"},
  # 커뮤니티
  @{name="U36_커뮤니티_공지사항_목록";         path="community/notice-list.html"},
  @{name="U37_커뮤니티_공지사항_상세";         path="community/notice-detail.html"},
  @{name="U38_커뮤니티_협회캘린더";            path="community/calendar.html"},
  @{name="U39_커뮤니티_협회지_목록";           path="community/newsletter.html"},
  @{name="U40_커뮤니티_협회지_상세";           path="community/newsletter-detail.html"},
  @{name="U41_커뮤니티_언론보도_목록";         path="community/press.html"},
  @{name="U42_커뮤니티_언론보도_상세";         path="community/press-detail.html"},
  @{name="U43_커뮤니티_갤러리_목록";           path="community/gallery.html"},
  @{name="U44_커뮤니티_갤러리_상세";           path="community/gallery-detail.html"},
  @{name="U45_커뮤니티_갤러리_글쓰기";         path="community/gallery-write.html"},
  @{name="U46_커뮤니티_자료실_목록";           path="community/archive.html"},
  @{name="U47_커뮤니티_자료실_상세";           path="community/archive-detail.html"},
  # 참여
  @{name="U48_참여_정회원_가입안내";           path="participate/membership.html"},
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
  @{name="U61_이메일무단수집거부";             path="email.html"}
)

# ── 관리자 페이지 ───────────────────────────────────────────
$adminPages = @(
  # 회원관리
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

$pages = $userPages + $adminPages

# ── fixed 헤더 → relative 변환 JS ─────────────────────────
$fixHeaderJS = @"
(function(){
  var hdr = document.querySelector('.site-header');
  if(hdr){ hdr.style.position='relative'; hdr.style.top='0'; hdr.style.left='0'; hdr.style.right='0'; hdr.style.zIndex='1'; }
  document.body.style.paddingTop = '0';
  var st = document.createElement('style');
  st.textContent = '::-webkit-scrollbar{width:0!important;height:0!important}html,body{scrollbar-width:none!important;overflow-y:visible!important}';
  document.head.appendChild(st);
  var nav = document.getElementById('mobileNav');
  if(nav) nav.style.display='none';
})();
"@

# ── CDP 헬퍼 ──────────────────────────────────────────────
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

# ── Chrome 시작 ───────────────────────────────────────────
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

try {
  $targets = Invoke-RestMethod "http://localhost:$debugPort/json/list" -ErrorAction Stop
} catch {
  Start-Sleep -Milliseconds 2000
  $targets = Invoke-RestMethod "http://localhost:$debugPort/json/list"
}

$wsUrl = ($targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1).webSocketDebuggerUrl
$ws    = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()
Write-Host "CDP 연결 완료`n" -ForegroundColor Green

$msgId = 1; $ok = 0; $fail = 0; $total = $pages.Count

foreach ($page in $pages) {
  $fileUrl = ("file:///" + $baseDir + "/" + $page.path) -replace '\\','/'
  $outFile = "$outDir\$($page.name).png"
  Write-Host "[$($ok+$fail+1)/$total] $($page.name)" -NoNewline

  try {
    # 페이지 이동
    Send-CDP $ws $msgId "Page.navigate" @{url=$fileUrl}
    $null = Wait-CDP $ws $msgId 12000; $msgId++
    Start-Sleep -Milliseconds 1200

    # fixed 헤더 처리
    Send-CDP $ws $msgId "Runtime.evaluate" @{expression=$fixHeaderJS; returnByValue=$true}
    $null = Wait-CDP $ws $msgId 3000; $msgId++
    Start-Sleep -Milliseconds 300

    # 전체 페이지 크기 측정
    Send-CDP $ws $msgId "Runtime.evaluate" @{
      expression    = "({w: Math.max(document.body.scrollWidth,1920), h: document.body.scrollHeight})"
      returnByValue = $true
    }
    $sizeRes = Wait-CDP $ws $msgId 5000; $msgId++
    $pw = [int]$sizeRes.result.result.value.w
    $ph = [int]$sizeRes.result.result.value.h
    if ($ph -lt 600) { $ph = 900 }

    # 뷰포트 설정 (1920px 고정 폭)
    Send-CDP $ws $msgId "Emulation.setDeviceMetricsOverride" @{
      width=1920; height=$ph; deviceScaleFactor=1; mobile=$false
    }
    $null = Wait-CDP $ws $msgId 3000; $msgId++
    Start-Sleep -Milliseconds 200

    # 스크린샷
    Send-CDP $ws $msgId "Page.captureScreenshot" @{format="png"; captureBeyondViewport=$true}
    $ssRes = Wait-CDP $ws $msgId 30000; $msgId++

    if ($ssRes -and $ssRes.result.data) {
      [IO.File]::WriteAllBytes($outFile, [Convert]::FromBase64String($ssRes.result.data))
      Write-Host "  OK" -ForegroundColor Green; $ok++
    } else {
      Write-Host "  SKIP (no data)" -ForegroundColor Yellow; $fail++
    }
  } catch {
    Write-Host "  FAIL: $_" -ForegroundColor Red; $fail++
  }
}

$ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"",
  [System.Threading.CancellationToken]::None).Wait()
$proc | Stop-Process -Force

Write-Host "`n완료: $ok/$total 성공, $fail 실패" -ForegroundColor Cyan
Write-Host "출력 위치: $outDir" -ForegroundColor Cyan
