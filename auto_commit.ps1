# auto_commit.ps1 — 매일 오후 5시 자동 커밋+푸시
# 변경사항이 있을 때만 커밋함

$repoPath = "C:\Users\BN659\Desktop\배은아\기획PM"
Set-Location $repoPath

# 변경사항 확인
$status = git status --porcelain
if ($status) {
    $date = Get-Date -Format "yyyy-MM-dd"
    git add .
    git commit -m "auto: $date 업무 내용 저장"
    git push origin main
    Write-Output "[$date] 커밋 및 푸시 완료"
} else {
    Write-Output "[$(Get-Date -Format 'yyyy-MM-dd')] 변경사항 없음, 스킵"
}
