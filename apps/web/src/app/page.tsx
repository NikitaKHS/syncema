'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Clapperboard, Link2, MessageCircle, Play, Users, Wifi } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { api, ensureGuest } from '@/lib/api';
import { extractYouTubeVideoId } from '@video-together/shared';

interface Room { id: string; }
export default function HomePage() {
  const router = useRouter(); const [name, setName] = useState(''); const [roomName, setRoomName] = useState('Вечерний просмотр'); const [video, setVideo] = useState('https://youtu.be/M7lc1UVf-VE'); const [invite, setInvite] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function createRoom(event: FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { await ensureGuest(name || 'Гость'); const videoId = extractYouTubeVideoId(video); const room = await api<Room>('/rooms', { method: 'POST', body: JSON.stringify({ name: roomName, ...(videoId ? { videoId } : {}) }) }); router.push(`/room/${room.id}`); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Не удалось создать комнату'); } finally { setBusy(false); } }
  async function joinRoom(event: FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { await ensureGuest(name || 'Гость'); const code = invite.trim().split('/').filter(Boolean).pop(); if (!code) throw new Error('Введите ссылку или код'); const room = await api<Room>(`/rooms/join-by-invite/${encodeURIComponent(code)}`, { method: 'POST' }); router.push(`/room/${room.id}`); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Не удалось войти'); } finally { setBusy(false); } }
  return <main className="landing">
    <header className="topbar"><Brand/><nav><a href="#how">Как это работает</a><a href="#features">Возможности</a></nav><ThemeSwitcher/></header>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> Синхронно. На любом устройстве.</div><h1>Фильм начинается,<br/><span>когда вы вместе.</span></h1><p>Создайте приватную комнату, включите YouTube и переживайте каждый момент одновременно — без отсчётов и «нажми сейчас».</p><div className="trust-row"><span><Check size={16}/> Без регистрации</span><span><Check size={16}/> Бесплатно</span><span><Check size={16}/> Web + Android</span></div></div>
      <div className="join-card" aria-label="Создать комнату"><div className="card-head"><span className="icon-tile"><Clapperboard/></span><div><h2>Начать просмотр</h2><p>Комната будет готова за пару секунд</p></div></div><form onSubmit={createRoom}>
        <label>Как вас называть?<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" minLength={2} maxLength={40}/></label>
        <label>Название комнаты<input value={roomName} onChange={(e) => setRoomName(e.target.value)} minLength={2} maxLength={80}/></label>
        <label>Ссылка на YouTube<input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="youtube.com/watch?v=…"/></label>
        {error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? <span className="spinner"/> : <Play size={18} fill="currentColor"/>}{busy ? 'Создаём…' : 'Создать комнату'}<ArrowRight size={18}/></button>
      </form><div className="divider"><span>или войдите по приглашению</span></div><form className="invite-form" onSubmit={joinRoom}><input value={invite} onChange={(e) => setInvite(e.target.value)} aria-label="Код приглашения" placeholder="Код или ссылка"/><button disabled={busy}>Войти</button></form></div>
    </section>
    <section id="features" className="feature-strip">{[[Wifi, 'Точная синхронизация', 'Пауза и перемотка у всех одновременно'], [MessageCircle, 'Живой чат', 'Обсуждайте, не отрываясь от просмотра'], [Users, 'До 20 друзей', 'Приглашайте одной приватной ссылкой']].map(([Icon, title, copy]) => { const C = Icon as typeof Wifi; return <article key={String(title)}><C/><div><h3>{String(title)}</h3><p>{String(copy)}</p></div></article>; })}</section>
    <section id="how" className="how"><span>Три простых шага</span><h2>От ссылки до общего вечера</h2><div>{[['01', 'Создайте комнату'], ['02', 'Поделитесь ссылкой'], ['03', 'Смотрите вместе']].map(([n, text]) => <article key={n}><b>{n}</b><p>{text}</p></article>)}</div></section>
    <footer><Brand/><p>Сделано для вечеров, которые хочется разделить.</p><span>© 2026 Video Together</span></footer>
  </main>;
}
