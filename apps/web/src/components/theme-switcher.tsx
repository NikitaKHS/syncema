'use client';
import { Laptop, Moon, Sun } from 'lucide-react';
import { ThemeMode, useTheme } from './providers';
const choices: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [{ mode: 'system', label: 'Как в системе', Icon: Laptop }, { mode: 'light', label: 'Светлая', Icon: Sun }, { mode: 'dark', label: 'Тёмная', Icon: Moon }];
export function ThemeSwitcher() { const { mode, setMode } = useTheme(); return <div className="theme-switcher" aria-label="Тема">{choices.map(({ mode: value, label, Icon }) => <button key={value} className={mode === value ? 'active' : ''} onClick={() => setMode(value)} aria-label={label} title={label}><Icon size={16}/></button>)}</div>; }
