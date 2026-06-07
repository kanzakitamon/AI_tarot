# カード選択画面のスクロール位置管理仕様

## 現在の実装

[app/read.tsx](app/read.tsx) のカード選択（picking）状態における 22 枚横スクロールの挙動。

### 1. 初期スクロール位置

- 目的: 画面表示時に中央カード（index 11）を画面中央に表示
- 実装:
  - `flowState.state === 'picking'` かつ FlatList の幅が確定（`isListReady`）かつ初回未実行（`didInitScrollRef.current === false`）の条件で `requestAnimationFrame` 内に `scrollToOffset({ offset: centerIndex * ITEM_WIDTH, animated: false })` を実行
  - `didInitScrollRef` で 1 回限りの実行を保証
  - FlatList の `initialScrollIndex` も中央を指す（マウント時のフォールバック）

### 2. 選択状態の即時反映

- 目的: カードをタップした瞬間に「選択済み」のオーバーレイを表示
- 実装:
  - FlatList に `extraData={flowState.pickedCardIds.length}` を渡し、選択数が変わったタイミングでセル再レンダーを強制
  - `selectedSet` を `useMemo` で構築し、`pickedCardIds.join(',')` を依存に置く

### 3. スクロール位置の維持

- 目的: 選択操作・親再レンダー時にスクロール位置を維持
- 実装:
  - FlatList の内部スクロール状態に委ねる（外側から `scrollToOffset` を呼ばない）
  - `extraData` はセル再レンダーのみを引き起こし、スクロール位置はリセットされない
  - `initialScrollIndex` は FlatList の初回マウント時にのみ適用される仕様で、再レンダー時には影響しない

### 4. 状態遷移時のリセット

- 目的: picking 以外の状態に遷移した時、次回 picking 復帰時に再度中央へスクロールできるようにする
- 実装:
  - 別 useEffect で `flowState.state !== 'picking'` を検知し、`didInitScrollRef.current = false`、`setListContentWidth(0)`、`setDidInitialScroll(false)` を実行

## 修正履歴

- 2026-05-13: `extraData` 追加でセル再レンダー保証、useEffect を「初回スクロール」「離脱時リセット」に分割し責務を明確化。
