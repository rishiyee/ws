"use client";

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import Button from './Button';

type ShareButtonProps = {
  title: string;
  text: string;
  path: string;
  className?: string;
};

export default function ShareButton({ title, text, path, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    setError('');

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not share this link.');
    }
  }

  return <div className={className}>
    <Button onClick={share} aria-label={`Share ${title}`} className="flex min-h-12 w-full items-center gap-3 rounded-[20px] bg-[#efece7] p-2.5 pr-4 text-left transition hover:bg-[#e8e1d9] active:scale-[.99]">
      <span className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors ${copied ? 'bg-[#e4efe2] text-[#3f7a3a]' : 'bg-white text-[#e64d08]'}`}>{copied ? <Check size={16}/> : <Share2 size={16}/>}</span>
      <span className="min-w-0 flex-1" aria-live="polite"><strong className="block text-[13px] font-medium">{copied ? 'Link copied' : 'Share'}</strong><span className="block truncate text-[12px] text-[#8b837b]">{copied ? 'Paste it anywhere to share' : title}</span></span>
    </Button>
    {error && <p role="status" className="mt-2 text-center text-[12px] text-[#97614a]">{error}</p>}
  </div>;
}
