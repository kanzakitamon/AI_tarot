// 相談文の妥当性チェック

// 設定定数（調整可能）
const MIN_LENGTH = 8; // 最小文字数
const REPEAT_CHAR_THRESHOLD = 0.8; // 同一文字繰り返しの閾値（80%）

// テスト文字列パターン（大文字小文字、全角半角を吸収）
const TEST_PATTERNS = [
  /test/i,
  /テスト/i,
  /てすと/i,
  /aaa/i,
  /あああ/i,
  /asdf/i,
  /1111/i,
  /１２３４/i,
  /aaaa/i,
  /ああああ/i,
];

// 相談を示すキーワード（大文字小文字、全角半角を吸収）
const CONSULTATION_KEYWORDS = [
  // 疑問詞
  /[？?]/,
  /か/,
  /どう/,
  /なぜ/,
  /なんで/,
  /どうして/,
  /どちら/,
  /どっち/,
  /いつ/,
  /どこ/,
  /だれ/,
  /誰/,
  /何/,
  /なに/,
  // 相談・迷いを示す語
  /相談/,
  /迷/,
  /悩/,
  /困/,
  /不安/,
  /心配/,
  /わからない/,
  /分からない/,
  /わから/,
  /分から/,
  /教えて/,
  /アドバイス/,
  /助けて/,
  /助け/,
  /どうすれば/,
  /どうしたら/,
  /すべき/,
  /した方が/,
  /したほうが/,
  /すべきか/,
  /した方がいい/,
  /したほうがいい/,
  /した方が良い/,
  /したほうが良い/,
  /した方がよい/,
  /したほうがよい/,
  /した方が良いか/,
  /したほうが良いか/,
  /した方がよいか/,
  /したほうがよいか/,
  /した方がいいか/,
  /したほうがいいか/,
  /した方が良いのか/,
  /したほうが良いのか/,
  /した方がよいのか/,
  /したほうがよいのか/,
  /した方がいいのか/,
  /したほうがいいのか/,
  /べき/,
  /方がいい/,
  /ほうがいい/,
  /方が良い/,
  /ほうが良い/,
  /方がよい/,
  /ほうがよい/,
];

// 入力テキストを正規化（前後空白除去、全角→半角、連続空白圧縮、英字小文字化）
export function normalizeForValidation(text: string): string {
  // 前後空白除去
  let normalized = text.trim();
  
  // 全角→半角変換（英数字・記号）
  normalized = normalized
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[Ａ-Ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[ａ-ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/　/g, ' '); // 全角スペース→半角スペース
  
  // 連続空白を1つに圧縮
  normalized = normalized.replace(/\s+/g, ' ');
  
  // 英字を小文字化
  normalized = normalized.toLowerCase();
  
  return normalized;
}

// バリデーション結果
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// 相談文の妥当性をチェック
export function validateInput(text: string): ValidationResult {
  const normalized = normalizeForValidation(text);
  
  // 1. 最小文字数チェック
  if (normalized.length < MIN_LENGTH) {
    return {
      isValid: false,
      errorMessage: `相談内容をもう少し詳しく書いてください\n\n（現在${normalized.length}文字。${MIN_LENGTH}文字以上必要です）`,
    };
  }
  
  // 2. テスト文字列チェック
  for (const pattern of TEST_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isValid: false,
        errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
      };
    }
  }
  
  // 3. 記号のみ・数字のみチェック
  const withoutSpaces = normalized.replace(/\s/g, '');
  if (withoutSpaces.length === 0) {
    return {
      isValid: false,
      errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
    };
  }
  
  // 記号のみチェック
  if (/^[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/.test(withoutSpaces)) {
    return {
      isValid: false,
      errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
    };
  }
  
  // 数字のみチェック
  if (/^\d+$/.test(withoutSpaces)) {
    return {
      isValid: false,
      errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
    };
  }
  
  // 4. 同一文字の繰り返し比率チェック
  const charCounts: Record<string, number> = {};
  for (const char of withoutSpaces) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  const maxCount = Math.max(...Object.values(charCounts));
  const repeatRatio = maxCount / withoutSpaces.length;
  
  if (repeatRatio >= REPEAT_CHAR_THRESHOLD) {
    return {
      isValid: false,
      errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
    };
  }
  
  // 5. 相談を示すキーワードチェック
  let hasConsultationKeyword = false;
  for (const keyword of CONSULTATION_KEYWORDS) {
    if (keyword.test(normalized)) {
      hasConsultationKeyword = true;
      break;
    }
  }
  
  if (!hasConsultationKeyword) {
    return {
      isValid: false,
      errorMessage: '相談内容をもう少し詳しく書いてください\n\n例：『今の仕事を辞めて転職した方がいい？』『恋人と別れるべきか迷ってる』',
    };
  }
  
  return {
    isValid: true,
  };
}

