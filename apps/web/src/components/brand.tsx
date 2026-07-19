import { Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="Video Together — на главную"><span className="brand-mark"><Play size={18} fill="currentColor"/><Sparkles className="spark" size={11}/></span>{!compact && <span>Video Together</span>}</Link>;
}
