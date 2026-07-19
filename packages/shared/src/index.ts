export type PlaybackStatus = 'playing' | 'paused' | 'buffering' | 'ended';

export interface PlaybackSnapshot {
  videoId: string;
  state: PlaybackStatus;
  positionMs: number;
  playbackRate: number;
  serverTimeMs: number;
  sequence: number;
}

export function projectedPosition(snapshot: PlaybackSnapshot, estimatedServerNowMs: number): number {
  if (snapshot.state !== 'playing') return snapshot.positionMs;
  return Math.max(0, snapshot.positionMs + (estimatedServerNowMs - snapshot.serverTimeMs) * snapshot.playbackRate);
}

export function correctionForDrift(driftMs: number): 'none' | 'rate' | 'seek' {
  const absolute = Math.abs(driftMs);
  if (absolute < 350) return 'none';
  if (absolute <= 1500) return 'rate';
  return 'seek';
}

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'youtu.be') return /^[A-Za-z0-9_-]{11}$/.test(url.pathname.slice(1)) ? url.pathname.slice(1) : null;
    if (url.hostname.endsWith('youtube.com')) {
      const id = url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v');
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
  } catch { return null; }
  return null;
}
