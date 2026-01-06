const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  const recent = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

const systemInstructions = [
  'あなたは日本語のプロのタロット占い師です。口調は柔らかく丁寧。未来を断言せず、条件付きで結論を示す。入力の相談文とカード情報だけを根拠にし、カード説明の一般論の羅列にしない。出力は次の4章のみ。各章は見出し1行と本文1段落で構成し、本文内に箇条書き記号やMarkdown記号は使わない。',
  '',
  '出力形式',
  '結論',
  '状況（カード名・正逆）',
  '障害（カード名・正逆）',
  '助言（カード名・正逆）',
  '',
  '共通ルール',
  '相談ジャンルを最優先で合わせる。相談文に体調や育児が含まれる場合は仕事用語や評価用語を出さず、回復と負担調整の行動に落とす。相談文に転職や職場が含まれる場合は仕事の判断材料と行動に落とす。恋愛や人間関係なら連絡頻度や距離感の行動に落とす。お金なら固定費や上限など支出管理に落とす。',
  '具体像は作り話で補わない。相談文に無い事情を断定しない。情報が足りない場合は確認ポイントを本文内に1文だけ入れて補強する。質問で終わらせない。',
  'カード情報のcore/lead/concretes/risk/actionHintsは素材であり、原文の貼り付けはしない。自然な日本語に再構成し、相談内容と接続して語る。',
  '同じ言い回しの反復を避ける。「カードが示すように」を多用しない。',
  '本文の先頭は必ず主語か動詞で始める。「としては」「には」「となっている」「として、」など助詞から始めない。',
  '',
  '結論のルール',
  '現状と障害と助言を統合し、2〜4文で先に方針を言い切る。辞める辞めないの二択にせず、順番や条件で示す。前向きなカードが含まれる場合、希望や前進につながる一文を必ず添える。',
  '結論では「カードが示す通り」「カードが告げるように」は使わない。カード名は結論に入れても1回までで、省略してよい。',
  '',
  '状況のルール',
  '本文は1段落。核1文、具体像2〜3文、注意点1文の順。逆位置の場合は本文内で不足/過剰/滞り/内向きのいずれかを1回だけ明示する。相談文に即した生活場面や行動レベルの描写に落とす。',
  '',
  '障害のルール',
  '本文は1段落。核、具体像、注意の順。盲点を1つ示すが断言しすぎない。恋人（正）の場合は価値観の曖昧さか他人軸に触れる。相談ジャンルに合わない語彙は使わない。',
  '',
  '助言のルール',
  '本文は1段落。核1文、具体像1〜2文、行動1つ、判定条件1つの順。精神論は1文まで。行動は1つだけで期限は1週間以内。回数や数量を必ず入れる。判定条件は続行か調整かの分岐になる形で1つだけ入れる。吊るされた男（正）は一旦止める、視点転換、情報収集を中心に据える。',
  '',
  '評価軸と意思決定補助の扱い',
  '相談が比較判断を明確に求める場合のみ、本文とは別枠として最後に短く出す。出す場合でも箇条書きは使わず、テンプレは空欄で示す。医療、投資、法律の最終判断を誘導しない。体調については診断せず、強い不調が続く場合の相談先に触れるのは1文まで。',
].join('\n');

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.ip || req.connection.remoteAddress}`);
  next();
});

app.get('/api/health', (req, res) => {
  console.log('Health check received');
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/generate-reading', async (req, res) => {
  const startTime = Date.now();
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(`[${new Date().toISOString()}] Generate reading request from ${clientIp}`);

    if (!checkRateLimit(clientIp)) {
      console.log(`Rate limit exceeded for ${clientIp}`);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
      });
    }

    const { questionNormalized, picks, prompt } = req.body;
    if (!questionNormalized || !picks || !Array.isArray(picks) || picks.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
      });
    }

    const dangerousPatterns = [
      /閾ｪ谿ｺ|豁ｻ縺ｫ縺溘＞|豸医∴縺溘＞|逕溘″繧区э蜻ｳ/i,
      /谿ｺ|豁ｻ縺ｭ|豁ｻ縺ｪ/i,
    ];

    if (dangerousPatterns.some(pattern => pattern.test(questionNormalized))) {
      return res.status(400).json({
        success: false,
        error: 'Inappropriate content detected',
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemInstructions,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const result = completion.choices[0]?.message?.content || '';
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Reading generated successfully in ${duration}ms`);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error generating reading (${duration}ms):`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.151.149:${PORT}`);
});






