# members.html 단일 캡처 — 첫 번째 사진 tooltip 강제 노출
$chrome    = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9223
$fileUrl   = "file:///C:/Users/BN659/Desktop/배은아/기획PM/projects/foresto_homepage/outputs/about/members.html"
$outFile   = "C:\Users\BN659\Desktop\배은아\기획PM\projects\foresto_homepage\screenshots\07_소개_조직도임원진.png"

$proc = Start-Process $chrome -ArgumentList @(
  "--headless=new",
  "--remote-debugging-port=$debugPort",
  "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  "--disable-extensions", "--font-render-hinting=none",
  "about:blank"
) -PassThru
Start-Sleep -Milliseconds 2500

$targets = Invoke-RestMethod "http://localhost:$debugPort/json/list"
$wsUrl   = ($targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1).webSocketDebuggerUrl
$ws      = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$wsUrl, [System.Threading.CancellationToken]::None).Wait()

function Send-CDP2 { param($ws,$id,$method,$params=@{})
  $msg=[System.Text.Encoding]::UTF8.GetBytes((@{id=$id;method=$method;params=$params}|ConvertTo-Json -Depth 10 -Compress))
  $ws.SendAsync([System.ArraySegment[byte]]::new($msg),[System.Net.WebSockets.WebSocketMessageType]::Text,$true,[System.Threading.CancellationToken]::None).Wait()
}
function Recv-CDP2 { param($ws,[int]$ms=8000)
  $acc=[System.Collections.Generic.List[byte]]::new(); $chunk=[byte[]]::new(65536)
  $cts=[System.Threading.CancellationTokenSource]::new($ms)
  try { do { $r=$ws.ReceiveAsync([System.ArraySegment[byte]]::new($chunk),$cts.Token).GetAwaiter().GetResult(); $acc.AddRange([System.ArraySegment[byte]]::new($chunk,0,$r.Count)) } while(-not $r.EndOfMessage)
    return [System.Text.Encoding]::UTF8.GetString($acc.ToArray())|ConvertFrom-Json } catch { return $null }
}
function Wait-CDP2 { param($ws,[int]$id,[int]$ms=15000)
  $dl=[DateTime]::Now.AddMilliseconds($ms)
  while([DateTime]::Now -lt $dl){ $m=Recv-CDP2 $ws 2000; if($m -and $m.id -eq $id){ return $m } }
  return $null
}

$id = 1

# 페이지 이동
Send-CDP2 $ws $id "Page.navigate" @{url=$fileUrl}; $null=Wait-CDP2 $ws $id 12000; $id++
Start-Sleep -Milliseconds 1500

# fixed 헤더 → relative + 스크롤바 제거
$setupJS = @"
(function(){
  var hdr=document.querySelector('.site-header');
  if(hdr){hdr.style.position='relative';hdr.style.top='0';hdr.style.left='0';hdr.style.right='0';}
  document.body.style.paddingTop='0';
  var st=document.createElement('style');
  st.textContent='::-webkit-scrollbar{width:0!important}html,body{scrollbar-width:none!important;overflow-y:visible!important}';
  document.head.appendChild(st);
  var nav=document.getElementById('mobileNav');
  if(nav)nav.style.display='none';
})();
"@
Send-CDP2 $ws $id "Runtime.evaluate" @{expression=$setupJS;returnByValue=$true}; $null=Wait-CDP2 $ws $id 3000; $id++

# 첫 번째 og-photo-tip 강제 표시 + 위치 고정
$showPhotoJS = @"
(function(){
  var tip = document.querySelector('.og-name-wrap.has-photo .og-photo-tip');
  if(tip){
    tip.style.display = 'block';
    tip.style.position = 'absolute';
    tip.style.left = '110%';
    tip.style.top = '50%';
    tip.style.transform = 'translateY(-50%)';
  }
})();
"@
Send-CDP2 $ws $id "Runtime.evaluate" @{expression=$showPhotoJS;returnByValue=$true}; $null=Wait-CDP2 $ws $id 3000; $id++
Start-Sleep -Milliseconds 1200

# 높이 측정 (푸터 기준 + 여유 20px)
Send-CDP2 $ws $id "Runtime.evaluate" @{
  expression="(function(){var f=document.getElementById('ftr');if(f){var r=f.getBoundingClientRect();return Math.round(r.bottom+window.scrollY)+20;}return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)+20;})();"
  returnByValue=$true
}
$hResp=$null; $hResp=Wait-CDP2 $ws $id 5000; $id++
$rawH = if ($hResp -and $hResp.result.result.value) { [int]$hResp.result.result.value } else { 5000 }
$pageH = [Math]::Max($rawH, 800)
$pageH=[Math]::Min($pageH,20000)

# 뷰포트 설정
Send-CDP2 $ws $id "Emulation.setDeviceMetricsOverride" @{width=1920;height=$pageH;deviceScaleFactor=1;mobile=$false}
$null=Wait-CDP2 $ws $id 3000; $id++

# 캡처
Send-CDP2 $ws $id "Page.captureScreenshot" @{format="png";clip=@{x=0;y=0;width=1920;height=$pageH;scale=1}}
$ssResp=Wait-CDP2 $ws $id 30000; $id++

if($ssResp.result.data){
  [System.IO.File]::WriteAllBytes($outFile,[Convert]::FromBase64String($ssResp.result.data))
  Write-Host "저장 완료: $outFile  (${pageH}px)" -ForegroundColor Green
} else {
  Write-Host "캡처 실패" -ForegroundColor Red
}

try { $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,"",[System.Threading.CancellationToken]::None)|Out-Null } catch {}
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
