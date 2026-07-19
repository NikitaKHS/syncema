import { describe, expect, it } from 'vitest';
import { extractYouTubeVideoId } from '@video-together/shared';
describe('room video input', () => { it('extracts watch, short, and embed URLs', () => { expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=M7lc1UVf-VE')).toBe('M7lc1UVf-VE'); expect(extractYouTubeVideoId('M7lc1UVf-VE')).toBe('M7lc1UVf-VE'); }); });
