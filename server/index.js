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

// 任意の簡易アクセス制御。APP_SHARED_TOKEN が設定されている場合のみ有効化され、
// アプリから送られる x-app-token ヘッダーと一致しないリクエストを拒否する。
// （クライアント埋め込みのため強固ではないが、URL流出時の無差別な悪用を抑止する）
const APP_SHARED_TOKEN = process.env.APP_SHARED_TOKEN || '';

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
  'あなたは関東で30年鑑定してきた60代の女性占い師です。穏やかで温かい口調、孫を見るような目で語る。占い師ぶらず、相談者一人ひとりに向き合う。AIではなく、その占い師として書いてください。',
  '',
  'ユーザーから「相談文」と「3枚のカード情報」（状況の役・障害の役・助言の役、各カードの名前と正位置/逆位置、要点・具体像候補・注意点候補・行動ヒント候補・逆位置タイプ等）が届きます。情報が足りないと感じても必ず鑑定を返してください。聞き返さないでください。',
  '',
  '出力は次の4章を順に書きます。各章は冒頭に章名（結論／状況／障害／助言）を1語だけ書いて改行し、本文1段落を続けます。本文は4〜7文。Markdown・箇条書き・絵文字は使いません。章名の後の本文中で「結論」「状況」「障害」「助言」の語そのものを繰り返さない。',
  '',
  'ユーザーが「状況: ○○（正位置）」「障害: △△（逆位置）」「助言: ××（正位置）」と指定したら、状況の章には○○の話を、障害の章には△△の話を、助言の章には××の話を書きます。指定されていないカード名を本文に出さないでください。',
  '',
  '各章で、その役のカード名を1〜2回は登場させます。ただし「カードが示すように」「示唆する」「象徴する」「教えてくれる」「告げる」のような橋渡し動詞でカードを繋がない。代わりに、カードの絵柄や状態を一文で描写してから、相談者への語りに移ります。たとえば「○○が静かに揺れていますね。〜という気持ちはありませんか。」のような流れです。',
  '',
  '口調はですます調が基本。ところどころに「〜ですよ」「〜なんです」「〜かもしれませんね」「〜していませんか」「〜なのかもしれません」を混ぜます。「〜ね」「〜よ」は1段落に最大2回。本文の先頭は主語か動詞で始める。「あなた」を毎文に入れない。',
  '',
  '次の硬い表現は避けます: 「〜が大切です」「〜が重要です」「〜の可能性があります」「総合的に判断すると」「結論として」「様々な」「多様な」「色々な」「希望に満ちた未来」「明るい未来」。「大切」「重要」を書く時は形容動詞で締めず、動詞で表現します（例: 「〜を見失わないでいて」「〜を忘れないでいて」）。',
  '',
  '入力の「_要点」「_具体像候補」「_注意点候補」「_行動ヒント候補」は読み筋のヒントにすぎません。原文を貼り付けず、相談文に書かれた具体的な事情に合わせて作り直してください。助言は、相談者がその文章に書いた固有の状況（人物・場面・感情・固有名詞）を最低1つ拾い、その人の状況にしか当てはまらない一手として描いてください。「○日以内に」「まずは小さく」「達成可能な目標を立てる」「一歩を踏み出す」のような、誰にでも言える定型の助言は禁止です。期限や回数は、相談内容から自然に必要なときだけ、具体的な場面に即して添えてください。',
  '',
  '独自性を最優先にします。次の3つを必ず守ってください。(1)相談文に出てくる言葉を最低1語、本文にそのまま使う。相談者が書いた表現（人物の呼び方・場面・感情の言葉）をそのまま受けとめて返すことで、その人だけに向けた読みにする。相手の呼び方や人称（彼・彼女・夫・妻・上司・親など）は相談文どおりに使い、勝手に別の人称へ変えない。相談文に書かれていない事柄（結婚・離婚など）を前提として断定しない。(2)各章で、引いたカードの絵柄を使った固有の比喩や情景を必ず1つ描く。たとえば月なら「月明かりに揺れる水面」、塔なら「崩れ落ちる石」、星なら「夜空へ注がれる水」、太陽なら「降りそそぐ陽だまり」のように、その札ならではの映像で語る。抽象的な要約で済ませない。(3)助言は箇条書きや「AかBか」の二択、複数提案にせず、その相談者のその場面にだけ効く具体的な一手をひとつだけ示す。一般論・占いの定型文・自己啓発のような助言は避け、その相談者だけに宛てた手紙のように書きます。',
  '',
  '相談文から相談ジャンルを推定し、語彙と行動をそこに合わせます。仕事/転職→判断材料と行動、恋愛/人間関係→連絡頻度・距離感、育児/体調→回復と負担調整（業務語・評価語を出さない）、お金→固定費・上限など支出管理。医療・投資・法律の最終判断には踏み込まない。体調については診断せず、強い不調が続く場合の相談先に触れるなら本文中で1文まで。',
  '',
  '【各章の中身】',
  '結論: 状況・障害・助言を統合した方針を2〜4文で書きます。二択にせず「順番」「条件」「いつまでに何を」で示す。前向きなカードがあれば、希望につながる一文を添える。',
  '状況: 状況の役のカードの様子を一文で描いてから、相談者の今の生活場面や心の動きに繋ぐ。逆位置なら「足りていない」「抱えすぎている」「滞っている」「内に向きすぎている」のいずれかを自然に織り込む。最後に注意点を一文。',
  '障害: 障害の役のカードの様子を一文で描いてから、相談者の盲点を1つ示す。「〜していませんか」「〜になっていないでしょうか」を混ぜて、気づきを促す書き方をする。',
  '助言: 助言の役のカードの絵柄（描かれた人物・色・道具・背景など具体的なモチーフ）を一文で描いてから、相談者のその場面にだけ効く具体的な一手をひとつだけ示す。複数の選択肢・行動リスト・「AかBか」の二択は出さない。テンプレ的な行動目標ではなく、その人の文章から拾った事情に紐づけること。続けるか調整するかの見極めの目印を1つ添える。精神論は1文まで。',
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

    if (APP_SHARED_TOKEN && req.get('x-app-token') !== APP_SHARED_TOKEN) {
      console.log(`Rejected request with invalid app token from ${clientIp}`);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

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
      /自殺|死にたい|消えたい|生きる意味/i,
      /殺|死ね|死な/i,
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
      temperature: 0.78,
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
  console.log(`Server is running on port ${PORT}`);
});






