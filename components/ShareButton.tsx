"use client";

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
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
    <Button onClick={share} variant="secondary" className="w-full" aria-live="polite">
      {copied ? <Check size={17}/> : <Share2 size={17}/>}
      {copied ? 'Link copied' : 'Share'}
      {!copied && <Copy size={14} className="opacity-60"/>}
    </Button>
    {error && <p role="status" className="mt-2 text-center text-[11px] text-[#97614a]">{error}</p>}
  </div>;
}
