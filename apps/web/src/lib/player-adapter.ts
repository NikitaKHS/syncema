export type PlayerState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued' | 'error';
export interface PlayerEvent { state: PlayerState; positionMs: number; durationMs: number; errorCode?: number; }
export interface PlayerAdapter { load(videoId: string, startPositionMs: number): void; play(): void; pause(): void; seekTo(positionMs: number): void; getCurrentPositionMs(): number; getDurationMs(): number; getState(): PlayerState; setPlaybackRate(rate: number): void; subscribe(listener: (event: PlayerEvent) => void): () => void; destroy(): void; }

declare global { interface Window { YT?: { Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer; PlayerState: Record<string, number> }; onYouTubeIframeAPIReady?: () => void; } }
interface YouTubePlayer { loadVideoById(options: { videoId: string; startSeconds: number }): void; playVideo(): void; pauseVideo(): void; seekTo(seconds: number, allowSeekAhead: boolean): void; getCurrentTime(): number; getDuration(): number; getPlayerState(): number; setPlaybackRate(rate: number): void; destroy(): void; }

const stateName = (value: number): PlayerState => ({ [-1]: 'unstarted', 0: 'ended', 1: 'playing', 2: 'paused', 3: 'buffering', 5: 'cued' })[value] as PlayerState ?? 'unstarted';
export class YouTubePlayerAdapter implements PlayerAdapter {
  private player: YouTubePlayer | null = null; private listeners = new Set<(event: PlayerEvent) => void>(); private lastState: PlayerState = 'unstarted';
  constructor(private readonly element: HTMLElement, videoId: string, origin = window.location.origin) { void this.initialize(videoId, origin); }
  private async initialize(videoId: string, origin: string) { await loadApi(); this.player = new window.YT!.Player(this.element, { videoId, playerVars: { playsinline: 1, controls: 1, rel: 0, origin }, events: { onStateChange: (event: { data: number }) => { this.lastState = stateName(event.data); this.emit(); }, onError: (event: { data: number }) => { this.lastState = 'error'; this.emit(event.data); }, onAutoplayBlocked: () => { this.lastState = 'paused'; this.emit(); } } }); }
  load(videoId: string, startPositionMs: number) { this.player?.loadVideoById({ videoId, startSeconds: startPositionMs / 1000 }); }
  play() { this.player?.playVideo(); } pause() { this.player?.pauseVideo(); } seekTo(positionMs: number) { this.player?.seekTo(positionMs / 1000, true); }
  getCurrentPositionMs() { return Math.round((this.player?.getCurrentTime() ?? 0) * 1000); } getDurationMs() { return Math.round((this.player?.getDuration() ?? 0) * 1000); } getState() { return this.lastState; }
  setPlaybackRate(rate: number) { this.player?.setPlaybackRate(rate); } subscribe(listener: (event: PlayerEvent) => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; } destroy() { this.player?.destroy(); this.listeners.clear(); }
  private emit(errorCode?: number) { const event = { state: this.lastState, positionMs: this.getCurrentPositionMs(), durationMs: this.getDurationMs(), errorCode }; this.listeners.forEach((listener) => listener(event)); }
}
let apiPromise: Promise<void> | null = null;
function loadApi() { if (window.YT?.Player) return Promise.resolve(); if (apiPromise) return apiPromise; apiPromise = new Promise((resolve) => { const previous = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); }; const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true; document.head.appendChild(script); }); return apiPromise; }
