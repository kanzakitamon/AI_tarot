# タロットカード画像のリネームスクリプト
# 使用方法: .\rename-cards.ps1

$sourceDir = "$env:USERPROFILE\OneDrive\デスクトップ\タロットアルカナ"
$targetDir = "$PSScriptRoot\assets\cards"

# カード名のマッピング（ID, 日本語名, 英語ファイル名）
$cardMapping = @(
    @{Id=0; NameJP="愚者"; FileName="00-fool.png"},
    @{Id=1; NameJP="魔術師"; FileName="01-magician.png"},
    @{Id=2; NameJP="女教皇"; FileName="02-high-priestess.png"},
    @{Id=3; NameJP="女帝"; FileName="03-empress.png"},
    @{Id=4; NameJP="皇帝"; FileName="04-emperor.png"},
    @{Id=5; NameJP="教皇"; FileName="05-hierophant.png"},
    @{Id=6; NameJP="恋人"; FileName="06-lovers.png"},
    @{Id=7; NameJP="戦車"; FileName="07-chariot.png"},
    @{Id=8; NameJP="力"; FileName="08-strength.png"},
    @{Id=9; NameJP="隠者"; FileName="09-hermit.png"},
    @{Id=10; NameJP="運命の輪"; FileName="10-wheel-of-fortune.png"},
    @{Id=11; NameJP="正義"; FileName="11-justice.png"},
    @{Id=12; NameJP="吊された男"; FileName="12-hanged-man.png"},
    @{Id=13; NameJP="死神"; FileName="13-death.png"},
    @{Id=14; NameJP="節制"; FileName="14-temperance.png"},
    @{Id=15; NameJP="悪魔"; FileName="15-devil.png"},
    @{Id=16; NameJP="塔"; FileName="16-tower.png"},
    @{Id=17; NameJP="星"; FileName="17-star.png"},
    @{Id=18; NameJP="月"; FileName="18-moon.png"},
    @{Id=19; NameJP="太陽"; FileName="19-sun.png"},
    @{Id=20; NameJP="審判"; FileName="20-judgement.png"},
    @{Id=21; NameJP="世界"; FileName="21-world.png"}
)

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
} else {
    Write-Host "エラー: ソースディレクトリが見つかりません: $sourceDir"
    exit 1
}

Write-Host "`nカード名のマッピング:"
$cardMapping | ForEach-Object {
    Write-Host "  ID $($_.Id): $($_.NameJP) -> $($_.FileName)"
}

Write-Host "`n画像ファイルをリネームしてコピーしますか？ (Y/N)"
$response = Read-Host
if ($response -ne "Y" -and $response -ne "y") {
    Write-Host "キャンセルされました。"
    exit 0
}

# ファイルをコピー（手動マッピングが必要な場合は、ここで調整）
Write-Host "`nファイルをコピー中..."
$copiedCount = 0

# まず、ファイル名からIDを推測してコピーを試みる
foreach ($file in $sourceFiles) {
    $fileName = $file.BaseName
    $matched = $false
    
    # ファイル名にIDが含まれている場合（例: "0", "00", "01"など）
    foreach ($card in $cardMapping) {
        $idPattern = "^0*$($card.Id)"
        if ($fileName -match $idPattern -or $fileName -match $card.NameJP) {
            $targetPath = Join-Path $targetDir $card.FileName
            Copy-Item -Path $file.FullName -Destination $targetPath -Force
            Write-Host "  ✓ $($file.Name) -> $($card.FileName) ($($card.NameJP))"
            $copiedCount++
            $matched = $true
            break
        }
    }
    
    if (-not $matched) {
        Write-Host "  ⚠ マッチしませんでした: $($file.Name)"
    }
}

Write-Host "`n完了: $copiedCount 個のファイルをコピーしました。"
Write-Host "手動でマッピングが必要なファイルがある場合は、assets\cards フォルダで直接リネームしてください。"

