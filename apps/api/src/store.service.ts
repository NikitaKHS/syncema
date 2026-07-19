import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import type { ChatMessage, Member, PlaybackState, Room, RoomRole, User } from './domain.js';

@Injectable()
export class StoreService {
  readonly users = new Map<string, User>();
  readonly rooms = new Map<string, Room>();
  readonly members = new Map<string, Map<string, Member>>();
  readonly messages = new Map<string, ChatMessage[]>();
  readonly playback = new Map<string, PlaybackState>();
  readonly refreshHashes = new Map<string, { userId: string; expiresAt: number }>();

  createUser(displayName: string): User {
    const user = { id: randomUUID(), displayName: displayName.trim(), avatarUrl: null };
    this.users.set(user.id, user);
    return user;
  }

  createRoom(owner: User, name: string, videoId: string | null): Room {
    const room: Room = { id: randomUUID(), name: name.trim(), ownerId: owner.id, inviteCode: this.inviteCode(), videoId, createdAt: new Date().toISOString() };
    this.rooms.set(room.id, room);
    this.members.set(room.id, new Map());
    this.messages.set(room.id, []);
    this.playback.set(room.id, { videoId: videoId ?? process.env.YOUTUBE_FALLBACK_VIDEO_ID ?? 'M7lc1UVf-VE', state: 'paused', positionMs: 0, playbackRate: 1, serverTimeMs: Date.now(), sequence: 0, controllerUserId: owner.id });
    this.join(room.id, owner.id, 'owner');
    return room;
  }

  getRoom(roomId: string): Room { const room = this.rooms.get(roomId); if (!room) throw new NotFoundException('Room not found'); return room; }
  findByInvite(code: string): Room | undefined { return [...this.rooms.values()].find((room) => room.inviteCode === code); }
  listForUser(userId: string): Room[] { return [...this.rooms.values()].filter((room) => this.members.get(room.id)?.has(userId)); }

  join(roomId: string, userId: string, role: RoomRole = 'viewer'): Member {
    this.getRoom(roomId);
    const user = this.users.get(userId); if (!user) throw new NotFoundException('User not found');
    const roomMembers = this.members.get(roomId)!;
    const member = roomMembers.get(userId) ?? { roomId, userId, role, joinedAt: new Date().toISOString(), user, online: false, latencyMs: null };
    roomMembers.set(userId, member);
    return member;
  }

  requireMember(roomId: string, userId: string): Member {
    const member = this.members.get(roomId)?.get(userId); if (!member) throw new NotFoundException('Room membership not found'); return member;
  }

  removeMember(roomId: string, userId: string): void { this.members.get(roomId)?.delete(userId); }
  updateRole(roomId: string, userId: string, role: RoomRole): Member { const member = this.requireMember(roomId, userId); member.role = role; return member; }
  setOnline(roomId: string, userId: string, online: boolean): void { const member = this.members.get(roomId)?.get(userId); if (member) member.online = online; }
  roomMembers(roomId: string): Member[] { return [...(this.members.get(roomId)?.values() ?? [])]; }

  addMessage(roomId: string, userId: string, body: string): ChatMessage {
    const user = this.requireMember(roomId, userId).user;
    const message = { id: randomUUID(), roomId, userId, displayName: user.displayName, body: body.trim().slice(0, 1000), sentAt: new Date().toISOString() };
    const messages = this.messages.get(roomId)!; messages.push(message); if (messages.length > 100) messages.shift();
    return message;
  }

  changePlayback(roomId: string, userId: string, intent: { action: 'play' | 'pause' | 'seek' | 'load'; positionMs: number; videoId?: string }): PlaybackState {
    const member = this.requireMember(roomId, userId);
    if (member.role === 'viewer') throw new Error('Only room controllers may control playback');
    const current = this.playback.get(roomId)!;
    const next: PlaybackState = { ...current, positionMs: Math.max(0, Math.round(intent.positionMs)), state: intent.action === 'play' ? 'playing' : intent.action === 'pause' ? 'paused' : current.state, videoId: intent.videoId ?? current.videoId, serverTimeMs: Date.now(), sequence: current.sequence + 1, controllerUserId: userId };
    this.playback.set(roomId, next);
    return next;
  }

  snapshot(roomId: string) { return { roomId, room: this.getRoom(roomId), playback: this.playback.get(roomId), participants: this.roomMembers(roomId), messages: this.messages.get(roomId) ?? [] }; }
  regenerateInvite(roomId: string): string { const room = this.getRoom(roomId); room.inviteCode = this.inviteCode(); return room.inviteCode; }
  private inviteCode(): string { return randomBytes(5).toString('base64url'); }
}
