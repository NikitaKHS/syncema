import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';
import type { RoomRole, User } from './domain.js';
import { AuthGuard, CurrentUser } from './auth.js';
import { StoreService } from './store.service.js';

export class CreateRoomDto { @IsString() @Length(2, 80) name!: string; @IsOptional() @Matches(/^[A-Za-z0-9_-]{11}$/) videoId?: string; }
export class UpdateRoomDto { @IsOptional() @IsString() @Length(2, 80) name?: string; @IsOptional() @Matches(/^[A-Za-z0-9_-]{11}$/) videoId?: string; }
export class JoinRoomDto { @IsOptional() @IsString() inviteCode?: string; }
export class UpdateMemberDto { @IsIn(['moderator', 'viewer']) role!: RoomRole; }

@UseGuards(AuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly store: StoreService) {}
  @Post() create(@CurrentUser() user: User, @Body() dto: CreateRoomDto) { return this.store.createRoom(user, dto.name, dto.videoId ?? null); }
  @Get() list(@CurrentUser() user: User) { return this.store.listForUser(user.id); }
  @Get(':roomId') get(@CurrentUser() user: User, @Param('roomId') roomId: string) { this.store.requireMember(roomId, user.id); return this.store.snapshot(roomId); }
  @Patch(':roomId') update(@CurrentUser() user: User, @Param('roomId') roomId: string, @Body() dto: UpdateRoomDto) { const room = this.store.getRoom(roomId); if (room.ownerId !== user.id) throw new Error('Owner only'); if (dto.name) room.name = dto.name; if (dto.videoId) room.videoId = dto.videoId; return room; }
  @Delete(':roomId') @HttpCode(204) remove(@CurrentUser() user: User, @Param('roomId') roomId: string) { const room = this.store.getRoom(roomId); if (room.ownerId !== user.id) throw new Error('Owner only'); this.store.rooms.delete(roomId); }
  @Post(':roomId/join') join(@CurrentUser() user: User, @Param('roomId') roomId: string, @Body() _dto: JoinRoomDto) { return this.store.join(roomId, user.id); }
  @Post('join-by-invite/:code') joinInvite(@CurrentUser() user: User, @Param('code') code: string) { const room = this.store.findByInvite(code); if (!room) throw new Error('Invite not found'); this.store.join(room.id, user.id); return room; }
  @Post(':roomId/leave') @HttpCode(204) leave(@CurrentUser() user: User, @Param('roomId') roomId: string) { if (this.store.getRoom(roomId).ownerId === user.id) throw new Error('Owner cannot leave'); this.store.removeMember(roomId, user.id); }
  @Post(':roomId/invites') invite(@CurrentUser() user: User, @Param('roomId') roomId: string) { this.store.requireMember(roomId, user.id); const room = this.store.getRoom(roomId); return { code: room.inviteCode, url: `${process.env.WEB_ORIGIN ?? 'http://localhost:3000'}/invite/${room.inviteCode}` }; }
  @Post(':roomId/regenerate-invite') regenerate(@CurrentUser() user: User, @Param('roomId') roomId: string) { if (this.store.getRoom(roomId).ownerId !== user.id) throw new Error('Owner only'); const code = this.store.regenerateInvite(roomId); return { code, url: `${process.env.WEB_ORIGIN ?? 'http://localhost:3000'}/invite/${code}` }; }
  @Patch(':roomId/members/:userId') role(@CurrentUser() user: User, @Param('roomId') roomId: string, @Param('userId') userId: string, @Body() dto: UpdateMemberDto) { if (this.store.getRoom(roomId).ownerId !== user.id) throw new Error('Owner only'); return this.store.updateRole(roomId, userId, dto.role); }
  @Delete(':roomId/members/:userId') @HttpCode(204) kick(@CurrentUser() user: User, @Param('roomId') roomId: string, @Param('userId') userId: string) { if (this.store.getRoom(roomId).ownerId !== user.id || userId === user.id) throw new Error('Owner only'); this.store.removeMember(roomId, userId); }
}

@UseGuards(AuthGuard)
@Controller('rooms/:roomId/messages')
export class MessagesController {
  constructor(private readonly store: StoreService) {}
  @Get() list(@CurrentUser() user: User, @Param('roomId') roomId: string) { this.store.requireMember(roomId, user.id); return this.store.messages.get(roomId) ?? []; }
  @Delete(':messageId') @HttpCode(204) delete(@CurrentUser() user: User, @Param('roomId') roomId: string, @Param('messageId') messageId: string) { const member = this.store.requireMember(roomId, user.id); const messages = this.store.messages.get(roomId) ?? []; const index = messages.findIndex((m) => m.id === messageId && (m.userId === user.id || member.role !== 'viewer')); if (index >= 0) messages.splice(index, 1); }
}
