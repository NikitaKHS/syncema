export type RoomRole = 'owner' | 'moderator' | 'viewer';
export type PlaybackStatus = 'playing' | 'paused' | 'buffering' | 'ended';

export interface User { id: string; displayName: string; avatarUrl: string | null; }
export interface Room { id: string; name: string; ownerId: string; inviteCode: string; videoId: string | null; createdAt: string; }
export interface Member { roomId: string; userId: string; role: RoomRole; joinedAt: string; user: User; online: boolean; latencyMs: number | null; }
export interface ChatMessage { id: string; roomId: string; userId: string; displayName: string; body: string; sentAt: string; }
export interface PlaybackState { videoId: string; state: PlaybackStatus; positionMs: number; playbackRate: number; serverTimeMs: number; sequence: number; controllerUserId: string | null; }
