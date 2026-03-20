# auto_commit.ps1
Set-Location "C:\Users\BN659\Desktop\������\��ȹPM"

$status = git status --porcelain
if ($status) {
    $date = Get-Date -Format "yyyy-MM-dd"
    git add .
    git commit -m "auto: $date save"
    git push origin main
    Write-Output "[$date] committed and pushed"
} else {
    Write-Output "[$(Get-Date -Format 'yyyy-MM-dd')] no changes, skipped"
}
