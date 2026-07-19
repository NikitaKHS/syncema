# YouTube integration and compliance

- Playback uses the official YouTube IFrame Player API. Native Android embeds the same official player in a compact, isolated AndroidX WebKit view.
- YouTube controls, branding, links, thumbnails, titles, and channel attribution are not hidden, altered, covered, or distorted.
- The web adapter supplies the full `origin`; Android supplies an app-owned HTTPS origin and Referer-equivalent identity to avoid player error 153.
- The minimum player viewport is respected, autoplay failure is handled, and errors 2, 5, 100, 101, 150, and 153 are surfaced.
- API keys remain on the backend. Search is `type=video`, paginated, limited, cached briefly, deduplicated, and falls back to direct video-ID entry.
- No YouTube audiovisual content is downloaded, proxied, rehosted, or modified.
- API data retention and deletion must follow the current YouTube API Services policies; cache TTLs are intentionally short and configurable.

Review the official IFrame reference and YouTube API Services Terms before production release because policies and player behavior can change.
