// タロットカード画像のコピースクリプト
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.env.USERPROFILE, 'OneDrive', 'デスクトップ', 'タロットアルカナ');
const targetDir = path.join(__dirname, 'assets', 'cards');

// カード名のマッピング
const cardMapping = {
  '00': '00-fool.png',
  '01': '01-magician.png',
  '02': '02-high-priestess.png',
  '03': '03-empress.png',
  '04': '04-emperor.png',
  '05': '05-hierophant.png',
  '06': '06-lovers.png',
  '07': '07-chariot.png',
  '08': '08-strength.png',
  '09': '09-hermit.png',
  '10': '10-wheel-of-fortune.png',
  '11': '11-justice.png',
  '12': '12-hanged-man.png',
  '13': '13-death.png',
  '14': '14-temperance.png',
  '15': '15-devil.png',
  '16': '16-tower.png',
  '17': '17-star.png',
  '18': '18-moon.png',
  '19': '19-sun.png',
  '20': '20-judgement.png',
  '21': '21-world.png'
};

// ターゲットディレクトリを作成
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// ソースディレクトリのファイルを確認
console.log('\nソースディレクトリのファイルを確認中...');
if (!fs.existsSync(sourceDir)) {
  console.error(`エラー: ソースディレクトリが見つかりません: ${sourceDir}`);
  process.exit(1);
}

const sourceFiles = fs.readdirSync(sourceDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
});

console.log(`見つかった画像ファイル: ${sourceFiles.length} 個`);
sourceFiles.forEach(file => console.log(`  - ${file}`));

if (sourceFiles.length === 0) {
  console.error('\nエラー: ソースフォルダに画像ファイルが見つかりません');
  process.exit(1);
}

// ファイルをコピー
console.log('\nファイルをコピー中...');
let copiedCount = 0;

sourceFiles.forEach(file => {
  const fileName = path.parse(file).name;
  let matched = false;
  
  // ファイル名からIDを抽出（例: "amateras-blog-00-the-fool-waite" -> "00"）
  const idMatch = fileName.match(/-(\d{2})-/);
  if (idMatch) {
    const id = idMatch[1];
    if (cardMapping[id]) {
      const targetFileName = cardMapping[id];
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, targetFileName);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  ✓ ${file} -> ${targetFileName}`);
      copiedCount++;
      matched = true;
    }
  }
  
  // ファイル名の先頭にIDがある場合（例: "00-fool.png"）
  if (!matched) {
    for (const id in cardMapping) {
      if (fileName.startsWith(id) || fileName.match(new RegExp(`^0*${id}`))) {
        const targetFileName = cardMapping[id];
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, targetFileName);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ✓ ${file} -> ${targetFileName}`);
        copiedCount++;
        matched = true;
        break;
      }
    }
  }
  
  if (!matched) {
    console.log(`  ⚠ マッチしませんでした: ${file}`);
  }
});

console.log(`\n完了: ${copiedCount} 個のファイルをコピーしました。`);
console.log('手動でマッピングが必要なファイルがある場合は、assets\\cards フォルダで直接リネームしてください。');

