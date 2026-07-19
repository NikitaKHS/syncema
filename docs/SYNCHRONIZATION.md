# Playback synchronization

Each room snapshot contains `videoId`, `state`, `positionMs`, `playbackRate`, `serverTimeMs`, and monotonic `sequence`.

When playing, a client estimates the authoritative position as:

`snapshot.positionMs + (estimatedServerNowMs - snapshot.serverTimeMs) * playbackRate`

The client estimates clock offset from ping/pong samples and uses half the round-trip time as one-way latency. Events with a sequence at or below the last applied sequence are ignored.

Drift policy:

- under 350 ms: no correction;
- 350–1,500 ms: temporary playback-rate correction where supported;
- above 1,500 ms, after reconnect, or after video changes: hard seek;
- buffering clients report status but never become the authority;
- host actions are optimistic locally, then reconciled with the server event.

The reconnect handshake includes the last acknowledged sequence. The server responds with a full snapshot, participant list, and recent messages so reconnect never depends on replaying an unbounded event log.
