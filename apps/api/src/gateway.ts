import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth.js';
import type { User } from './domain.js';
import { StoreService } from './store.service.js';

type AuthedSocket = Socket & { data: { user?: User; roomIds?: Set<string> } };

@WebSocketGateway({ namespace: '/rooms', cors: { origin: (process.env.WEB_ORIGIN ?? 'http://localhost:3000,http://127.0.0.1:3000').split(','), credentials: true }, transports: ['websocket', 'polling'] })
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  constructor(private readonly auth: AuthService, private readonly store: StoreService) {}

  handleConnection(client: AuthedSocket) {
    try { const token = String(client.handshake.auth.token ?? '').replace(/^Bearer /, ''); client.data.user = this.auth.verifyAccess(token); client.data.roomIds = new Set(); }
    catch { client.disconnect(true); }
  }
  handleDisconnect(client: AuthedSocket) { for (const roomId of client.data.roomIds ?? []) { if (client.data.user) this.store.setOnline(roomId, client.data.user.id, false); this.server.to(roomId).emit('presence:changed', this.store.roomMembers(roomId)); } }

  @SubscribeMessage('room:join') join(@ConnectedSocket() client: AuthedSocket, @MessageBody() payload: { roomId: string; lastSequence?: number }) {
    const user = this.user(client); this.store.requireMember(payload.roomId, user.id); client.join(payload.roomId); client.data.roomIds?.add(payload.roomId); this.store.setOnline(payload.roomId, user.id, true);
    const snapshot = this.store.snapshot(payload.roomId); client.emit('room:snapshot', snapshot); this.server.to(payload.roomId).emit('presence:changed', snapshot.participants); return { ok: true, sequence: snapshot.playback?.sequence ?? 0 };
  }

  @SubscribeMessage('room:leave') leave(@ConnectedSocket() client: AuthedSocket, @MessageBody() payload: { roomId: string }) { const user = this.user(client); client.leave(payload.roomId); client.data.roomIds?.delete(payload.roomId); this.store.setOnline(payload.roomId, user.id, false); this.server.to(payload.roomId).emit('presence:changed', this.store.roomMembers(payload.roomId)); }

  @SubscribeMessage('playback:intent') playback(@ConnectedSocket() client: AuthedSocket, @MessageBody() payload: { roomId: string; action: 'play' | 'pause' | 'seek' | 'load'; positionMs: number; videoId?: string }) {
    try { const next = this.store.changePlayback(payload.roomId, this.user(client).id, payload); this.server.to(payload.roomId).emit('playback:state', next); return { ok: true, sequence: next.sequence, serverTimeMs: next.serverTimeMs }; }
    catch (error) { throw new WsException(error instanceof Error ? error.message : 'Playback rejected'); }
  }

  @SubscribeMessage('chat:send') chat(@ConnectedSocket() client: AuthedSocket, @MessageBody() payload: { roomId: string; body: string }) { if (!payload.body?.trim()) throw new WsException('Message is empty'); const message = this.store.addMessage(payload.roomId, this.user(client).id, payload.body); this.server.to(payload.roomId).emit('chat:message', message); return { ok: true, id: message.id }; }
  @SubscribeMessage('sync:ping') ping(@MessageBody() payload: { clientTimeMs: number }) { return { clientTimeMs: payload.clientTimeMs, serverTimeMs: Date.now() }; }
  private user(client: AuthedSocket): User { if (!client.data.user) throw new WsException('Unauthorized'); return client.data.user; }
}
