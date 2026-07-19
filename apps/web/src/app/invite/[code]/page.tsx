'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Brand } from '@/components/brand';
import { api, ensureGuest } from '@/lib/api';
export default function InvitePage() { const { code } = useParams<{ code: string }>(); const router = useRouter(); const [error, setError] = useState(''); useEffect(() => { void (async () => { try { await ensureGuest('Гость'); const room = await api<{ id: string }>(`/rooms/join-by-invite/${code}`, { method: 'POST' }); router.replace(`/room/${room.id}`); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Приглашение недействительно'); } })(); }, [code, router]); return <main className="center-state"><Brand/><span className="spinner large"/><h1>{error || 'Присоединяем к просмотру…'}</h1>{error && <a href="/">Вернуться на главную</a>}</main>; }
