const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.env.USERPROFILE, 'OneDrive', 'デスクトップ', 'タロットアルカナ');
const targetDir = path.join(__dirname, 'assets', 'sounds');

console.log('Source directory:', sourceDir);
console.log('Target directory:', targetDir);

// 必要なファイル名のマッピング（実際のファイル名 → 必要なファイル名）
const fileMapping = {
  'shuffle.mp3': 'shuffle.mp3',
  'card-select.mp3': 'card-select.mp3',
  'card-flip.mp3': 'card-flip.mp3',
  // 大文字小文字のバリエーションも考慮
  'Shuffle.mp3': 'shuffle.mp3',
  'Card-select.mp3': 'card-select.mp3',
  'Card-flip.mp3': 'card-flip.mp3',
};

try {
  // ソースディレクトリの存在確認
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir);
    process.exit(1);
  }

  // ターゲットディレクトリの作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // MP3ファイルを検索
  const files = fs.readdirSync(sourceDir).filter(file => 
    file.toLowerCase().endsWith('.mp3')
  );

  console.log('Found MP3 files:', files);

  if (files.length === 0) {
    console.log('No MP3 files found in source directory.');
    process.exit(0);
  }

  // ファイルをコピー
  let copiedCount = 0;
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetFileName = fileMapping[file] || file.toLowerCase();
    const targetPath = path.join(targetDir, targetFileName);

    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied: ${file} → ${targetFileName}`);
      copiedCount++;
    } catch (error) {
      console.error(`✗ Failed to copy ${file}:`, error.message);
    }
  }

  console.log(`\nCopied ${copiedCount} file(s).`);
  
  // コピーされたファイルを確認
  const copiedFiles = fs.readdirSync(targetDir).filter(file => 
    file.toLowerCase().endsWith('.mp3')
  );
  console.log('\nFiles in target directory:', copiedFiles);

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

