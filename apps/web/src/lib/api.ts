const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
export interface User { id: string; displayName: string; avatarUrl: string | null; }
export interface Session { accessToken: string; refreshToken: string; expiresIn: number; user: User; }

export function getSession(): Session | null { if (typeof window === 'undefined') return null; try { return JSON.parse(localStorage.getItem('vt-session') ?? 'null') as Session | null; } catch { return null; } }
export function saveSession(session: Session) { localStorage.setItem('vt-session', JSON.stringify(session)); }

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getSession()?.accessToken;
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers } });
  if (!response.ok) { const payload = await response.json().catch(() => null) as { message?: string } | null; throw new Error(Array.isArray(payload?.message) ? payload.message.join(', ') : payload?.message ?? `HTTP ${response.status}`); }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}
export async function ensureGuest(displayName = 'Гость') { const existing = getSession(); if (existing) return existing; const session = await api<Session>('/auth/guest', { method: 'POST', body: JSON.stringify({ displayName }) }); saveSession(session); return session; }
export const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';
