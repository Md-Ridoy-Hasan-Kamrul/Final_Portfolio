$url = "https://assets.codepen.io/721952/all-peeps.png"
$output = "public/images/peeps/all-peeps.png"

Write-Host "Downloading all-peeps.png..." -ForegroundColor Green

try {
    $webClient = New-Object System.Net.WebClient
    $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    $webClient.DownloadFile($url, $output)
    Write-Host "Download complete! File saved to: $output" -ForegroundColor Green
} catch {
    Write-Host "Download failed. Please download manually from:" -ForegroundColor Red
    Write-Host $url -ForegroundColor Yellow
    Write-Host "Save it to: $output" -ForegroundColor Yellow
}
