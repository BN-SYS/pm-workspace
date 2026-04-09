<#
  capture.ps1 — 스토리보드 스크린샷 자동 캡처

  ★ 기획자가 수정할 곳: 아래 배열 2개만.
  ★ pages.js 의 img 파일명·path 값과 반드시 일치시킬 것.
  ★ 나머지는 건드리지 않는다.

  실행 방법:
    cd "{프로젝트}/story_board"
    .\capture.ps1
#>

# ══════════════════════════════════════════════════════
# ★ 수정 영역 — pages.js 와 동일하게 유지
# ══════════════════════════════════════════════════════

$userPages = @(
  @{name="U01_홈_메인"; path="index.html"}
  # @{name="U02_..."; path="...html"}
)

$adminPages = @(
  @{name="A01_회원_목록"; path="admin/members.html"}
  # @{name="A02_..."; path="...html"}
)

# ══════════════════════════════════════════════════════
# ★ 이 아래는 수정하지 않는다
# ══════════════════════════════════════════════════════

$chrome  = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir  = Join-Path $PSScriptRoot "images"
$base    = Join-Path $PSScriptRoot ".." "outputs"
$waitMs  = 2000

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function Capture($name, $htmlPath) {
  $full = Join-Path $base $htmlPath
  if (-not (Test-Path $full)) { Write-Host "SKIP $name ($htmlPath 없음)"; return }
  $out  = Join-Path $outDir "$name.png"
  $url  = "file:///" + $full.Replace("\", "/")
  $args = @(
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--window-size=1920,5000",
    "--screenshot=$out",
    $url
  )
  & $chrome @args 2>$null
  Start-Sleep -Milliseconds $waitMs
  Write-Host "OK $name"
}

foreach ($p in $userPages)  { Capture $p.name $p.path }
foreach ($p in $adminPages) { Capture $p.name $p.path }

Write-Host "`n캡처 완료. images/ 폴더 확인."
