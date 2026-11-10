import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

/** Compact machine-ish date: 2024.11.16 */
export function stampDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '----.--.--';
  return date.toISOString().slice(0, 10).replace(/-/g, '.');
}
