# Android Studioで実行する方法

## 方法1: Expo CLIを使用（推奨）

Expoプロジェクトの場合、Android StudioのRunボタンではなく、Expo CLIを使用します：

```bash
# 開発サーバーを起動
npm start

# Androidエミュレーターで実行
npm run android
# または
npx expo run:android
```

## 方法2: Android Studioで実行する場合

Android Studioで直接実行するには、ネイティブプロジェクトを生成する必要があります：

### 1. ネイティブプロジェクトの生成

```bash
# expo-sqliteのプラグイン設定を一時的にコメントアウト
# app.jsonのpluginsセクションからexpo-sqliteを削除

# ネイティブプロジェクトを生成
npx expo prebuild --platform android

# expo-sqliteを再インストール
npm install expo-sqlite@~14.0.0
```

### 2. Android Studioで開く

1. Android Studioを開く
2. "Open an Existing Project"を選択
3. `C:\Users\kanza\tarot-reading-app\android`フォルダを選択
4. Gradleの同期が完了するまで待つ
5. Runボタンが有効になります

### 3. 注意事項

- `npx expo prebuild`を実行すると、`android`フォルダと`ios`フォルダが生成されます
- これらのフォルダは`.gitignore`に追加することを推奨します
- ネイティブコードを変更した場合は、`npx expo prebuild --clean`で再生成できます

## トラブルシューティング

### expo-sqliteのエラーが出る場合

`expo-sqlite`のビルドファイルに問題がある可能性があります：

```bash
# node_modulesを削除して再インストール
Remove-Item -Recurse -Force node_modules
npm install

# または、expo-sqliteを再インストール
npm uninstall expo-sqlite
npm install expo-sqlite@~14.0.0
```

### prebuildが失敗する場合

1. `app.json`のプラグイン設定を確認
2. Expo SDKのバージョンとプラグインの互換性を確認
3. `npx expo prebuild --clean`でクリーンビルドを試す

## 推奨される開発フロー

Expoプロジェクトの場合、以下の方法が推奨されます：

1. **開発中**: `npm start`でExpo Goアプリを使用
2. **カスタムネイティブコードが必要な場合**: `npx expo prebuild`でネイティブプロジェクトを生成
3. **ビルド**: `eas build`でビルド（推奨）

