# タロットカード画像のコピースクリプト（シンプル版）
$sourceDir = "$env:USERPROFILE\OneDrive\デスクトップ\タロットアルカナ"
$targetDir = "$PSScriptRoot\assets\cards"

# ターゲットディレクトリを作成
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "Created directory: $targetDir"
}

# ソースディレクトリのファイルを確認
Write-Host "`nソースディレクトリのファイルを確認中..."
if (Test-Path $sourceDir) {
    $sourceFiles = Get-ChildItem -Path $sourceDir -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|PNG|JPG|JPEG)$' }
    Write-Host "見つかった画像ファイル: $($sourceFiles.Count) 個"
    $sourceFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
    
    if ($sourceFiles.Count -eq 0) {
        Write-Host "`nエラー: ソースフォルダに画像ファイルが見つかりません"
        Write-Host "ソースフォルダ: $sourceDir"
        exit 1
    }
} else {
    Write-Host "エラー: ソースディレクトリが見つかりません: $sourceDir"
    exit 1
}

# カード名のマッピング
$cardMapping = @{
    "00" = "00-fool.png"
    "01" = "01-magician.png"
    "02" = "02-high-priestess.png"
    "03" = "03-empress.png"
    "04" = "04-emperor.png"
    "05" = "05-hierophant.png"
    "06" = "06-lovers.png"
    "07" = "07-chariot.png"
    "08" = "08-strength.png"
    "09" = "09-hermit.png"
    "10" = "10-wheel-of-fortune.png"
    "11" = "11-justice.png"
    "12" = "12-hanged-man.png"
    "13" = "13-death.png"
    "14" = "14-temperance.png"
    "15" = "15-devil.png"
    "16" = "16-tower.png"
    "17" = "17-star.png"
    "18" = "18-moon.png"
    "19" = "19-sun.png"
    "20" = "20-judgement.png"
    "21" = "21-world.png"
}

Write-Host "`nファイルをコピー中..."
$copiedCount = 0

foreach ($file in $sourceFiles) {
    $fileName = $file.BaseName
    $matched = $false
    
    # ファイル名からIDを推測（数字で始まる場合）
    foreach ($id in $cardMapping.Keys) {
        if ($fileName -match "^$id" -or $fileName -match "^0*$id") {
            $targetFileName = $cardMapping[$id]
            $targetPath = Join-Path $targetDir $targetFileName
            Copy-Item -Path $file.FullName -Destination $targetPath -Force
            Write-Host "  ✓ $($file.Name) -> $targetFileName"
            $copiedCount++
            $matched = $true
            break
        }
    }
    
    # 日本語名でマッチングを試みる
    if (-not $matched) {
        $japaneseNames = @{
            "愚者" = "00-fool.png"
            "魔術師" = "01-magician.png"
            "女教皇" = "02-high-priestess.png"
            "女帝" = "03-empress.png"
            "皇帝" = "04-emperor.png"
            "教皇" = "05-hierophant.png"
            "恋人" = "06-lovers.png"
            "戦車" = "07-chariot.png"
            "力" = "08-strength.png"
            "隠者" = "09-hermit.png"
            "運命の輪" = "10-wheel-of-fortune.png"
            "正義" = "11-justice.png"
            "吊された男" = "12-hanged-man.png"
            "死神" = "13-death.png"
            "節制" = "14-temperance.png"
            "悪魔" = "15-devil.png"
            "塔" = "16-tower.png"
            "星" = "17-star.png"
            "月" = "18-moon.png"
            "太陽" = "19-sun.png"
            "審判" = "20-judgement.png"
            "世界" = "21-world.png"
        }
        
        foreach ($name in $japaneseNames.Keys) {
            if ($fileName -match $name) {
                $targetFileName = $japaneseNames[$name]
                $targetPath = Join-Path $targetDir $targetFileName
                Copy-Item -Path $file.FullName -Destination $targetPath -Force
                Write-Host "  ✓ $($file.Name) -> $targetFileName ($name)"
                $copiedCount++
                $matched = $true
                break
            }
        }
    }
    
    if (-not $matched) {
        Write-Host "  ⚠ マッチしませんでした: $($file.Name)"
    }
}

Write-Host "`n完了: $copiedCount 個のファイルをコピーしました。"
Write-Host "手動でマッピングが必要なファイルがある場合は、assets\cards フォルダで直接リネームしてください。"

