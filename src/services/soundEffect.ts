import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

export type SoundEffectType = 'shuffle' | 'cardSelect' | 'cardFlip';

const SOUND_SOURCES: Partial<Record<SoundEffectType, number>> = {
  cardSelect: require('../../assets/sounds/card-select.mp3'),
  cardFlip: require('../../assets/sounds/card-flip.mp3'),
};

const VOLUME_LEVEL = 0.35;
const PLAYBACK_RELEASE_DELAY_MS = 2000;

let currentPlayer: AudioPlayer | null = null;
let isPlaying = false;

function releasePlayer(player: AudioPlayer) {
  try {
    player.remove();
  } catch {
    // already removed
  }
  if (currentPlayer === player) {
    currentPlayer = null;
    isPlaying = false;
  }
}

export async function playSoundEffect(type: SoundEffectType): Promise<boolean> {
  try {
    const source = SOUND_SOURCES[type];
    if (!source) {
      return false;
    }
    if (isPlaying && currentPlayer) {
      return false;
    }

    const player = createAudioPlayer(source);
    player.volume = VOLUME_LEVEL;
    currentPlayer = player;
    isPlaying = true;
    player.play();

    setTimeout(() => {
      releasePlayer(player);
    }, PLAYBACK_RELEASE_DELAY_MS);

    return true;
  } catch (error) {
    console.log(`SE playback failed (silent fallback): ${type}`, error);
    isPlaying = false;
    currentPlayer = null;
    return false;
  }
}

export async function cleanupSounds(): Promise<void> {
  if (currentPlayer) {
    releasePlayer(currentPlayer);
  }
}
