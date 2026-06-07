# ストア公開向けデプロイ手順

このドキュメントはアプリをストアに出すために必要な準備をまとめたもの。順番に実行していく。

---

## 全体像

```
ユーザーのスマホ
    ↓ HTTPS
[Render にデプロイした Express サーバー]   ← OpenAI API キーを保管
    ↓
OpenAI API
```

ローカル開発機ではなく、インターネットからアクセスできる場所にサーバーを置く必要がある。OpenAI API キーをアプリに埋め込むことは絶対にしない（アプリは解析されて API キーが盗まれる）。

---

## 1. OpenAI API キーの確認

`server/.env` に有効な `OPENAI_API_KEY` が入っていることを確認。

---

## 2. Render に Express サーバーをデプロイ

### 2.1 GitHub にリポジトリをプッシュ

Render は GitHub からビルドする仕組み。`tarot-reading-app` リポジトリを GitHub にプッシュしておく。

```bash
# まだ GitHub にリポジトリがなければ作成してプッシュ
git remote add origin https://github.com/<your-name>/tarot-reading-app.git
git push -u origin main
```

注意: `.gitignore` で `.env` と `node_modules/` は除外済み。`server/.env` も除外済み（API キーは絶対にコミットしない）。

### 2.2 Render アカウント作成・サービス作成

1. https://render.com にアクセスして GitHub アカウントでサインアップ
2. ダッシュボードで **New +** → **Web Service** を選択
3. GitHub の `tarot-reading-app` リポジトリを連携
4. 以下を設定:

   | 項目 | 値 |
   |---|---|
   | Name | tarot-reading-server （任意） |
   | Region | Singapore（日本から近い） |
   | Branch | main |
   | Root Directory | `server` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

5. **Environment Variables** セクションで:
   - `OPENAI_API_KEY` = （`server/.env` と同じ値）
   - `PORT` は Render が自動で設定するので追加不要

6. **Create Web Service** ボタンを押下

### 2.3 デプロイ完了の確認

数分でデプロイが完了し、URL が表示される（例: `https://tarot-reading-server.onrender.com`）。

ブラウザでヘルスチェック:
```
https://<your-render-url>.onrender.com/api/health
```

`{"status":"ok","message":"Server is running"}` が返れば OK。

### 2.4 Free プランの注意点

Render の Free プランは 15 分間アクセスが無い場合にスリープする。次回アクセス時に起動まで数十秒かかる。本格運用時には Starter プラン（月 $7）へのアップグレードを検討。

---

## 3. アプリ側に本番サーバー URL を設定

`eas.json` の `production` と `preview` プロファイルにある `EXPO_PUBLIC_SERVER_ENDPOINT` を、Render で取得した URL に置き換える。

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_SERVER_ENDPOINT": "https://tarot-reading-server.onrender.com/api/generate-reading"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SERVER_ENDPOINT": "https://tarot-reading-server.onrender.com/api/generate-reading"
      }
    }
  }
}
```

`development` プロファイルにも書く欄があるが、開発時はローカル LAN サーバーを使う場合は `http://<your-LAN-IP>:3000/api/generate-reading` に置き換える（同じ Wi-Fi にいる端末でのみ動く）。

---

## 4. EAS Build でビルド

### 4.1 EAS CLI のインストール（初回のみ）

```bash
npm install -g eas-cli
eas login
```

### 4.2 ビルド設定の初期化（初回のみ）

```bash
cd C:\Users\kanza\tarot-reading-app
eas build:configure
```

### 4.3 プレビュービルド（テスト用 APK／IPA）

```bash
# Android (APK で内部配布)
eas build --profile preview --platform android

# iOS (シミュレータ or 内部配布)
eas build --profile preview --platform ios
```

ビルド完了後、Expo のダッシュボードからインストール用リンクが取得できる。実機にインストールして全フローを確認する。

確認項目:
- [ ] 鑑定が最後まで動作する（サーバーにリーチできる）
- [ ] 無料 3 回でカウンターが減る
- [ ] 4 回目に「広告を見て鑑定する」ボタンに切り替わる
- [ ] リワード広告が表示される（Android／iOS 両方）
- [ ] 履歴が保存・表示される

### 4.4 本番ビルド（ストア提出用）

```bash
# Android (AAB - Google Play 用)
eas build --profile production --platform android

# iOS (App Store 用)
eas build --profile production --platform ios
```

---

## 5. ストア提出

```bash
# Google Play
eas submit --profile production --platform android

# App Store
eas submit --profile production --platform ios
```

事前に必要な準備:
- Google Play Console アカウント（$25 一回）でアプリ登録
- App Store Connect アカウント（Apple Developer Program 年 $99）でアプリ登録
- ストア掲載情報（スクリーンショット、説明、プライバシーポリシー URL など）
- プライバシーポリシー Web ページ（OpenAI に送るテキストデータの扱いを記載）

---

## 6. リリース後

- Render のログでサーバーのエラーを監視
- AdMob の管理画面で広告収益を確認
- OpenAI ダッシュボードで API 利用料金を監視（gpt-4o-mini は安いが、ユーザー増 = 費用増）

---

## トラブルシュート

### アプリ側で「サーバーに接続できません」が出る

1. `eas.json` の `EXPO_PUBLIC_SERVER_ENDPOINT` が正しい URL か確認
2. Render のサービスが起動しているか確認（Free プランはスリープ中の可能性）
3. `https://<url>/api/health` がブラウザから到達可能か確認

### 「サーバーが設定されていません」エラー

`EXPO_PUBLIC_SERVER_ENDPOINT` が空のままビルドされている。`eas.json` を確認して `eas build` を再実行。

### Render のデプロイが失敗する

- Build Command が `npm install`、Start Command が `npm start`、Root Directory が `server` になっているか確認
- ログで Node バージョンや依存解決のエラーを確認

### Android Rewarded 広告が表示されない

- AdMob のアプリ ID と広告ユニット ID が `app.json` および `app/read.tsx` で正しいか確認
- AdMob 側で本番広告ユニットの審査が完了しているか確認
