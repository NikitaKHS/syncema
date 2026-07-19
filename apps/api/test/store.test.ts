import { describe, expect, it } from 'vitest';
import { StoreService } from '../src/store.service.js';

describe('StoreService vertical room flow', () => {
  it('creates an owner room and advances authoritative sequence', () => {
    const store = new StoreService(); const user = store.createUser('Nikita'); const room = store.createRoom(user, 'Friday cinema', 'M7lc1UVf-VE');
    expect(store.requireMember(room.id, user.id).role).toBe('owner');
    expect(store.changePlayback(room.id, user.id, { action: 'play', positionMs: 1200 }).sequence).toBe(1);
    expect(store.snapshot(room.id).participants).toHaveLength(1);
  });
  it('keeps viewers from taking playback authority', () => {
    const store = new StoreService(); const owner = store.createUser('Owner'); const viewer = store.createUser('Viewer'); const room = store.createRoom(owner, 'Room', null); store.join(room.id, viewer.id);
    expect(() => store.changePlayback(room.id, viewer.id, { action: 'seek', positionMs: 5000 })).toThrow(/controllers/);
  });
});
