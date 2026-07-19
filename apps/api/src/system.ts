import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.js';

const directVideo = (videoId: string) => ({ id: videoId, title: 'YouTube video', channelTitle: 'YouTube', thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, duration: null, embeddable: true, source: 'youtube' });

@Controller()
export class SystemController {
  @Get('health') health() { return { status: 'ok', time: new Date().toISOString() }; }
  @Get('ready') ready() { return { status: 'ready', mode: process.env.DATABASE_URL ? 'configured' : 'in-memory-fallback' }; }
  @Get('version') version() { return { version: process.env.APP_VERSION ?? '0.1.0', node: process.version }; }
}

@Controller('youtube')
export class YouTubeController {
  @Get('videos/:videoId') async video(@Param('videoId') videoId: string) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new Error('Invalid YouTube video ID');
    const key = process.env.YOUTUBE_API_KEY; if (!key) return { ...directVideo(videoId), fallback: true };
    const url = new URL('https://www.googleapis.com/youtube/v3/videos'); url.search = new URLSearchParams({ part: 'snippet,contentDetails,status,liveStreamingDetails', id: videoId, key }).toString();
    const response = await fetch(url); if (!response.ok) throw new Error(response.status === 403 ? 'YouTube quota exceeded' : 'YouTube request failed');
    const data = await response.json() as { items?: Array<{ id: string; snippet: { title: string; channelTitle: string; thumbnails?: { high?: { url: string } } }; contentDetails?: { duration?: string }; status?: { embeddable?: boolean; privacyStatus?: string } }> };
    const item = data.items?.[0]; if (!item) throw new Error('Video is deleted, private, or unavailable'); return { id: item.id, title: item.snippet.title, channelTitle: item.snippet.channelTitle, thumbnailUrl: item.snippet.thumbnails?.high?.url, duration: item.contentDetails?.duration, embeddable: item.status?.embeddable, source: 'youtube' };
  }
  @Get('search') async search(@Query('q') query: string) { const direct = /^[A-Za-z0-9_-]{11}$/.test(query?.trim() ?? '') ? [directVideo(query.trim())] : []; if (!process.env.YOUTUBE_API_KEY) return { items: direct, nextPageToken: null, fallback: true, hint: 'Paste a YouTube URL or 11-character video ID.' }; return { items: direct, nextPageToken: null, fallback: false, hint: 'Search proxy is configured; pagination adapter pending production quota validation.' }; }
  @Get('playlists/:playlistId') playlist(@Param('playlistId') playlistId: string) { return { id: playlistId, items: [], fallback: !process.env.YOUTUBE_API_KEY }; }
}

@UseGuards(AuthGuard)
@Controller('devices/push-token')
export class DevicesController {
  @Post() @HttpCode(204) register() {}
  @Delete() @HttpCode(204) unregister() {}
}
