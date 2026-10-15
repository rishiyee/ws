"use client";

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import Button from './Button';

type ShareButtonProps = {
  title: string;
  text: string;
  path: string;
  label?: string;
  className?: string;
};

export default function ShareButton({ title, text, path, label = 'Share', className = '' }: ShareButtonProps) {
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
    <Button onClick={share} variant="secondary" aria-label={`${label}: ${title}`} className="w-full text-[13px]">
      {copied ? <Check size={17}/> : <Share2 size={17}/>}<span aria-live="polite">{copied ? 'Link copied' : label}</span>
    </Button>
    {error && <p role="status" className="mt-2 text-[12px] text-status-danger">{error}</p>}
  </div>;
}
