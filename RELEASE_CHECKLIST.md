# Android 公開チェックリスト

「タロット占い - 悩みを文章で鑑定」を Google Play に公開するための残作業一覧。
✅=完了 / ⬜=未着手 / 👤=あなたの操作が必要（コードでは対応不可）

---

## A. コード側（このリポジトリで対応済み / 対応可能）

- ✅ 起動クラッシュ修正（SoLoader マージマッピング）
- ✅ リワード広告のイベント種別バグ修正
- ✅ テスト用サンプル入力文の削除
- ✅ Manifest の不要な機微権限を除去（`SYSTEM_ALERT_WINDOW` / `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` を `tools:node="remove"`）
- ✅ `app.json` の version を 1.0.3 に統一
- ✅ サーバーに任意の共有トークン認証を追加（`APP_SHARED_TOKEN` 設定時のみ有効）
- ✅ プライバシーポリシー作成（`PRIVACY.md` / `docs/privacy.html`）
- ⬜ 通知アイコン（白＋透過の 96x96 PNG）を用意して `app.json` の expo-notifications プラグインに設定。未設定だと通知が白い四角で表示される
- ⬜ iOS バナー広告ユニットID作成後、`src/components/AdBanner.tsx` の `IOS_BANNER_UNIT_ID` に設定（Android公開だけなら不要）

---

## B. 本番サーバー（👤 あなたの操作が必要）

本番では LAN サーバーは使えません。公開HTTPSのサーバーが必須です。
リポジトリ直下に `render.yaml`（Blueprint）を用意済みなので、ほぼ自動で作成できます。

1. 👤 最新コードを GitHub（`kanzakitamon/AI_tarot`）に push
   ```bash
   git add -A && git commit -m "release prep" && git push
   ```
2. 👤 Render Dashboard → **New → Blueprint** → このリポジトリを選択 → Apply
   - `render.yaml` により `tarot-reading-server`（root=`server`, free, Singapore, health=`/api/health`）が自動作成される
   - 作成時に環境変数を入力:
     - `OPENAI_API_KEY` = （`server/.env` と同じ有効なキー）
     - `APP_SHARED_TOKEN` = `445370e6af4646373d4596348db9d5dc83cf8622de17ec08`
       （※ `eas.json` の `EXPO_PUBLIC_APP_TOKEN` と一致済み。変えるなら両方を同じ値に）
3. 👤 デプロイ後のURL（例 `https://tarot-reading-server.onrender.com`）で `…/api/health` が `{"status":"ok"}` を返すか確認
4. ✅ `eas.json` は想定URL `https://tarot-reading-server.onrender.com/api/generate-reading` ＋トークンで配線済み
   - ⬜ **もしRenderが付けた実URLが想定と違う場合**（名前重複で `-xxxx` が付く等）だけ、`eas.json` の `EXPO_PUBLIC_SERVER_ENDPOINT` を実URLに直す
5. 👤 （無料プラン運用）スリープ回避: UptimeRobot 等で `…/api/health` を **5〜14分おき**にHTTP監視。無料枠750時間/月のためサービスは1つだけに保つ。伸びたら Starter（月$7）でping不要に
6. 👤 OpenAI の利用料金アラートを設定（ユーザー増＝費用増）

---

## C. プライバシーポリシーの公開（👤）

- 👤 `docs/privacy.html` を公開URLに配置（例: GitHub Pages の `/docs` 公開、または任意のホスティング）
- ⬜ 公開URLを Play Console の「ストアの設定 > プライバシーポリシー」に登録
- ⬜ 連絡先メール（kanzaki.csc@gmail.com）が有効か確認

---

## D. Google Play Console（👤 すべて手作業）

- 👤 アプリを作成（パッケージ名 `com.tarotreading.app`）
- 👤 **データセーフティ フォーム**（回答例は末尾を参照）
- 👤 コンテンツのレーティング アンケート（占い/エンタメ）
- 👤 ターゲットユーザーと子ども向け設定: 13歳未満を対象としない
- 👤 広告の有無: 「はい、広告を含む」
- 👤 ストア掲載情報: アプリ名・短い説明・詳しい説明・スクリーンショット（携帯6.x型 最低2枚）・フィーチャーグラフィック（1024x500）・アイコン（512x512）
- 👤 国/地域、価格（無料）

---

## E. AdMob（👤）

- 👤 AdMob で本アプリを Play のアプリと紐づけ
- 👤 本番広告は審査後に配信開始（公開直後はテスト/空配信のことあり）
- ✅ Android バナー: `ca-app-pub-4764153276310493/6781288504`
- ✅ Android リワード: `ca-app-pub-4764153276310493/7104722138`
- ✅ AdMob アプリID は Manifest に設定済み

---

## F. ビルド & 提出（👤、A〜Eが揃ってから）

```bash
# 本番ビルド（AAB）
eas build --profile production --platform android
# 提出
eas submit --profile production --platform android
```

提出前の実機確認:
- ⬜ 鑑定が最後まで動く（本番サーバーに到達）
- ⬜ 無料1回→以降リワード広告で結果表示
- ⬜ バナー広告が表示される
- ⬜ 「今日の1枚」表示・毎朝通知（実機）
- ⬜ 履歴の保存・表示
- ⬜ 鑑定結果の画像シェア

---

## 付録: データセーフティ フォーム 回答例

- データの収集・共有: **あり**
- 収集するデータ種別:
  - **アプリのアクティビティ / その他のユーザー生成コンテンツ**: 利用者が入力する相談文。
    - 目的: アプリの機能（鑑定生成）。第三者（OpenAI）と**共有**。端末外へ送信するが当社サーバーには保存しない。
  - **デバイスまたはその他の ID（広告ID）**: 広告配信のため。Google AdMob と共有。
- データはすべて**送信時に暗号化**: はい（HTTPS）
- データ削除のリクエスト方法: アンインストールで端末内データは削除。サーバーに保存していない。
- ユーザーはデータ収集を選択できるか: 鑑定機能の利用に相談文の送信が必要。

> 注: 最終的な回答内容は、公開時点のアプリ挙動とOpenAI/AdMobの規約に合わせて確認のうえ申告してください。
