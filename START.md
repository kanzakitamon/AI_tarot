# Expo Goで起動する手順

## 前提条件
- Node.jsがインストールされていること
- Expo Goアプリがスマホにインストールされていること（iOS/Android）
- PCとスマホが**同じWi-Fiネットワーク**に接続されていること

## 1. 依存関係のインストール

```bash
cd C:\Users\kanza\tarot-reading-app
npm install --legacy-peer-deps
```

## 2. AIサーバーの起動（別のターミナル）

```bash
cd C:\Users\kanza\tarot-reading-app\server
npm install
npm start
```

サーバーが起動すると、以下のメッセージが表示されます：
```
Server is running on http://0.0.0.0:3000
Local: http://localhost:3000
Network: http://192.168.151.149:3000
```

**重要**: サーバーは起動したままにしておいてください。

## 3. Windowsファイアウォールの設定（初回のみ）

### 方法A: PowerShellを管理者として実行
1. Windowsキーを押して「PowerShell」を検索
2. 「Windows PowerShell」を右クリック → 「管理者として実行」
3. 以下のコマンドを実行：
```powershell
netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000
```

### 方法B: 手動設定
1. Windowsの設定 → プライベートネットワーク → ファイアウォールとネットワーク保護
2. 「詳細設定」をクリック
3. 「受信の規則」→「新しい規則」
4. 「ポート」を選択 → 次へ
5. 「TCP」を選択 → 「特定のローカルポート」に「3000」を入力 → 次へ
6. 「接続を許可する」を選択 → 次へ
7. すべてのプロファイルにチェック → 次へ
8. 名前を「Node.js Server Port 3000」などに設定 → 完了

## 4. Expo開発サーバーの起動

```bash
cd C:\Users\kanza\tarot-reading-app
npm start
```

または

```bash
npx expo start
```

## 5. スマホでアプリを開く

### QRコードをスキャン
1. ターミナルにQRコードが表示されます
2. **iOS**: カメラアプリでQRコードをスキャン → Expo Goで開く
3. **Android**: Expo Goアプリを開いて「Scan QR code」をタップ

### 手動で接続
1. Expo Goアプリを開く
2. 「Enter URL manually」をタップ
3. ターミナルに表示されているURL（例: `exp://192.168.151.149:8081`）を入力

## 6. 接続確認

アプリが起動したら、ホーム画面が表示されます。

## トラブルシューティング

### 「サーバーに接続できません」エラーが出る場合

1. **サーバーが起動しているか確認**
   - サーバーのターミナルでエラーが出ていないか確認
   - `http://192.168.151.149:3000/api/health` にブラウザでアクセスして確認

2. **同じWi-Fiに接続されているか確認**
   - PCとスマホが同じWi-Fiネットワークに接続されているか確認

3. **ファイアウォールの設定を確認**
   - Windowsファイアウォールがポート3000を許可しているか確認

4. **IPアドレスが正しいか確認**
   - PCのIPアドレスを確認：
     ```bash
     ipconfig
     ```
   - 「IPv4 アドレス」を確認（例: `192.168.151.149`）
   - `src/services/aiService.ts` の `SERVER_ENDPOINT` が正しいIPアドレスになっているか確認

### Expo Goで「SDK 54」エラーが出る場合

プロジェクトはSDK 54を使用しています。Expo Goアプリが最新版であることを確認してください。

### その他のエラー

- `npm start` を実行する前に `npm install --legacy-peer-deps` を実行してください
- サーバーとExpo開発サーバーの両方が起動していることを確認してください

