# カード選択画面のスクロール位置管理仕様

## 現在の実装状況

### 1. 初期スクロール位置の設定
- **目的**: 画面表示時に中央カード（index 11）を画面中央に表示
- **実装方法**: 
  - `initialScrollIndex`を`useState`で管理
  - `cardData.length > 0`かつ`initialScrollIndex === undefined`かつ`didInitScrollRef.current === false`の時、`Math.floor(cardData.length / 2)`を設定
  - 設定後、すぐに`didInitScrollRef.current = true`と`setInitialScrollIndex(undefined)`を実行して再適用を防ぐ
- **問題点**: 
  - `initialScrollIndex`が設定されてから`undefined`になるまでの間に、`extraData`が変更されると再適用される可能性がある

### 2. 選択時のスクロール位置維持
- **目的**: カード選択後もスクロール位置を維持する
- **現在の実装**: 
  - `handleCardPress`内で`offsetXRef.current`と`scrollPositionRef.current`を更新
  - コメントで「補正処理は既にuseEffectで実装済み」とあるが、**実際にはuseEffectが存在しない**
  - `requestAnimationFrame`内でログ出力のみで、実際のスクロール補正処理がない
- **問題点**: 
  - 選択後にスクロール位置を維持する処理が実装されていない
  - `extraData`が変更されるとFlatListが再レンダリングされ、スクロール位置がリセットされる可能性がある

### 3. 画面フォーカス時のスクロール位置復元
- **目的**: 画面復帰時に保存されたスクロール位置を復元
- **実装方法**: 
  - `useFocusEffect`内で`restoreScrollPosition`を呼び出す
  - 条件: `flowState.state === 'picking'`かつ`cardDataLenRef.current > 0`かつ`didInitScrollRef.current === true`かつ`flowState.pickedCardIds.length === 0`
- **問題点**: 
  - 選択中（`pickedCardIds.length > 0`）は実行されないが、選択後に`useFocusEffect`が発火する可能性がある

### 4. スクロール位置の保存
- **目的**: スクロール位置をAsyncStorageに保存
- **実装方法**: 
  - `onMomentumScrollEnd`で`saveScrollPosition`を呼び出す
  - `offsetXRef.current`と`scrollPositionRef.current`を更新
- **問題点**: 
  - 選択時にスクロール位置が保存されるが、復元処理が選択後に実行される可能性がある

## 問題の根本原因

1. **選択後にスクロール位置を維持する処理が存在しない**
   - `handleCardPress`内で`requestAnimationFrame`を使っているが、実際のスクロール補正処理がない
   - `extraData`が変更されるとFlatListが再レンダリングされ、スクロール位置がリセットされる

2. **`initialScrollIndex`の再適用**
   - `initialScrollIndex`が`undefined`になる前に`extraData`が変更されると、再適用される可能性がある
   - `didInitScrollRef.current`が`true`でも、`initialScrollIndex`が`undefined`になるまでの間に再適用される

3. **`useFocusEffect`のタイミング**
   - 選択後に`useFocusEffect`が発火し、`restoreScrollPosition`が呼ばれる可能性がある
   - `pickedCardIds.length === 0`の条件があるが、選択直後は`length > 0`なので実行されないはず

## 修正が必要な箇所

1. **選択後にスクロール位置を維持するuseEffectを追加**
   - `flowState.pickedCardIds.length`が変更された時、`offsetXRef.current`を使って`scrollToOffset`を実行

2. **`initialScrollIndex`の設定タイミングを改善**
   - `initialScrollIndex`を設定したら、すぐに`undefined`に設定する（現在の実装でOK）
   - ただし、`extraData`が変更される前に`undefined`になる必要がある

3. **`useFocusEffect`の条件を改善**
   - 選択中は絶対に`restoreScrollPosition`を呼ばないようにする

