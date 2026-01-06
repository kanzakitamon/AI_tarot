import { Audio } from 'expo-av';

// SEの種類
export type SoundEffectType = 'shuffle' | 'cardSelect' | 'cardFlip';

// SEファイルのパス（音源ファイルを配置する必要があります）
// 注意: React Nativeのrequire()はコンパイル時に評価されるため、
// 音源ファイルが存在しない場合はビルドエラーになります。
// 
// 現在配置されているファイル：
// - card-select.mp3 ✓
// - card-flip.mp3 ✓
// - shuffle.mp3 (未配置)

const SOUND_PATHS: Record<SoundEffectType, any> | null = {
  // shuffle.mp3が配置されたら、以下のコメントを解除してください：
  // shuffle: require('../../assets/sounds/shuffle.mp3'),
  cardSelect: require('../../assets/sounds/card-select.mp3'),
  cardFlip: require('../../assets/sounds/card-flip.mp3'),
} as any;

// 音量設定（UI効果音の30-40%）
const VOLUME_LEVEL = 0.35;

// 現在再生中のSoundオブジェクト（同時再生防止用）
let currentSound: Audio.Sound | null = null;
let isPlaying = false;

/**
 * SEを再生する
 * @param type SEの種類
 * @returns 再生成功したかどうか
 */
export async function playSoundEffect(type: SoundEffectType): Promise<boolean> {
  try {
    // 音源ファイルが存在しない場合は無音フォールバック
    if (!SOUND_PATHS || !SOUND_PATHS[type]) {
      return false;
    }

    // 同時再生防止：前のSEが再生中ならスキップ
    if (isPlaying && currentSound) {
      return false;
    }

    // マナーモードチェック（iOS/Androidで自動的に無音になるが、明示的にチェック）
    // エラーが発生した場合は無音フォールバックとして扱う

    // 音源ファイルをロード
    const { sound } = await Audio.Sound.createAsync(
      SOUND_PATHS[type],
      {
        volume: VOLUME_LEVEL,
        shouldPlay: true,
      },
      (status) => {
        // 再生完了時にクリーンアップ
        if (status.isLoaded && status.didJustFinish) {
          isPlaying = false;
          currentSound?.unloadAsync().catch(() => {});
          currentSound = null;
        }
      }
    );

    // 前のSEがあれば停止してアンロード
    if (currentSound) {
      try {
        await currentSound.unloadAsync();
      } catch (e) {
        // エラーは無視
      }
    }

    currentSound = sound;
    isPlaying = true;

    // 再生完了を待つ（最大2秒でタイムアウト）
    setTimeout(() => {
      if (isPlaying) {
        isPlaying = false;
        currentSound?.unloadAsync().catch(() => {});
        currentSound = null;
      }
    }, 2000);

    return true;
  } catch (error) {
    // エラー時は無音フォールバック（マナーモードなど）
    console.log(`SE playback failed (silent fallback): ${type}`, error);
    isPlaying = false;
    currentSound = null;
    return false;
  }
}

/**
 * 全てのSEを停止してクリーンアップ
 */
export async function cleanupSounds(): Promise<void> {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }
    isPlaying = false;
  } catch (error) {
    // エラーは無視
  }
}

