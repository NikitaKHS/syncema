import { describe, expect, it } from 'vitest';
import { correctionForDrift, extractYouTubeVideoId, projectedPosition } from './index.js';

describe('synchronization utilities', () => {
  it('projects playing snapshots using server time', () => expect(projectedPosition({ videoId: 'M7lc1UVf-VE', state: 'playing', positionMs: 1000, playbackRate: 1, serverTimeMs: 5000, sequence: 1 }, 5500)).toBe(1500));
  it('selects bounded drift corrections', () => { expect(correctionForDrift(200)).toBe('none'); expect(correctionForDrift(700)).toBe('rate'); expect(correctionForDrift(1700)).toBe('seek'); });
  it('accepts canonical YouTube URLs only', () => { expect(extractYouTubeVideoId('https://youtu.be/M7lc1UVf-VE')).toBe('M7lc1UVf-VE'); expect(extractYouTubeVideoId('https://example.com/watch?v=M7lc1UVf-VE')).toBeNull(); });
});
