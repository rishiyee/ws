"use client";

import Image from 'next/image';
import { Check, Copy, Mail, Phone, Wifi, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { admin, memberById } from '../lib/data';

export function Photo({ id, className = 'size-14' }: { id: string; className?: string }) {
  const member = memberById(id);
  if (!member) return null;
  return <Image src={`/photos/${member.photo}.jpg`} alt={`Photo of ${member.name}`} width={112} height={112} className={`${className} shrink-0 object-cover`} />;
}

export function StatusBar() {
  return <div className="phone-status-bar relative flex h-[54px] shrink-0 items-center justify-between px-7 text-[14px] font-semibold"><span>9:41</span><span className="phone-dynamic-island absolute left-1/2 top-[10px] h-[31px] w-[112px] -translate-x-1/2 rounded-full bg-black"/><span className="flex items-center gap-1.5"><Wifi size={16}/><span className="flex h-[11px] w-[21px] items-center rounded-[3px] border border-current p-[2px]"><span className="h-full w-3/4 rounded-[1px] bg-current"/></span></span></div>;
}

export function ContactActions({ memberId, demo = false }: { memberId: string; demo?: boolean }) {
  const member = memberById(memberId);
  const phone = member?.phone ?? (memberId === 'admin' ? admin.phone : undefined);
  const email = member?.email ?? (memberId === 'admin' ? admin.email : undefined);
  return <div className="flex w-full gap-3">{phone && <a className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 text-[13px] font-medium text-white transition hover:bg-brand-hover active:scale-[.98]" href={`tel:${phone.replace(/[^+\d]/g, '')}`}><Phone size={17}/><span>{memberId === 'admin' ? 'Call admin' : 'Call'}</span></a>}{email && <a className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white/80 px-4 text-[13px] font-medium text-ink transition hover:bg-white active:scale-[.98]" href={`mailto:${email}`}><Mail size={17}/><span>{memberId === 'admin' ? 'Email admin' : 'Email'}</span></a>}{demo && !phone && !email && <span className="text-[12px] text-text-muted">Contact details unavailable</span>}</div>;
}

export function Blood({ id }: { id: string }) {
  const member = memberById(id);
  if (!member) return null;
  return <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">Blood group <strong className="font-medium text-text-secondary">{member.bloodGroup}</strong></span>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-[16px] font-medium tracking-[-.3px]">{children}</h2>{action}</div>;
}

export function BottomSheet({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const [closing, setClosing] = useState(false);
  const closed = useRef(false);
  const finish = useCallback(() => { if (!closed.current) { closed.current = true; close(); } }, [close]);
  const requestClose = useCallback(() => setClosing(true), []);
  const anchor = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const screen = anchor.current?.closest<HTMLElement>('.phone-screen') ?? null;
    const scroller = screen?.querySelector<HTMLElement>('main');
    setHost(screen);
    if (!scroller) return;
    const previous = scroller.style.overflowY;
    scroller.style.overflowY = 'hidden';
    return () => { scroller.style.overflowY = previous; };
  }, []);
  useEffect(() => { if (!closing) return; const fallback = window.setTimeout(finish, 260); return () => window.clearTimeout(fallback); }, [closing, finish]);
  useEffect(() => { const key = (event: KeyboardEvent) => event.key === 'Escape' && requestClose(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, [requestClose]);
  const sheet = <div data-closing={closing || undefined} className="sheet-backdrop absolute inset-0 z-40 flex items-end overscroll-contain bg-black/35" onMouseDown={e => { if (e.target === e.currentTarget) requestClose(); }} onAnimationEnd={e => { if (closing && e.target === e.currentTarget) finish(); }}><section role="dialog" aria-modal="true" aria-label={title} className="sheet-panel flex max-h-[90%] w-full flex-col overflow-hidden rounded-t-[28px] bg-card px-5 pb-6 pt-3 shadow-2xl"><div className="mx-auto mb-3 h-1 w-9 shrink-0 rounded-full bg-border"/><header className="mb-4 flex shrink-0 items-center justify-between border-b border-border-soft pb-3"><h2 className="text-[20px] font-medium">{title}</h2><Button onClick={requestClose} variant="icon" aria-label="Close"><X size={19}/></Button></header><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</div></section></div>;
  return <><span ref={anchor} hidden/>{host && createPortal(sheet, host)}</>;
}

export function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-[12px] text-text-soft">{label}</dt><dd className="mt-1 break-words text-[12px] font-medium leading-5">{value}</dd></div>;
}

export function ContactRow({ icon, label, value, href, copy, copied = false }: { icon: ReactNode; label: string; value: string; href: string; copy: () => void; copied?: boolean }) {
  return <div className="flex min-h-[66px] items-center gap-3 border-b border-border-soft last:border-0"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-action">{icon}</span><a className="min-w-0 flex-1" href={href}><span className="block text-[12px] text-text-subtle">{label}</span><strong className="mt-1 block break-all text-[12px] font-medium">{value}</strong></a><Button onClick={copy} className="inline-flex min-h-12 items-center gap-1.5 rounded-xl px-2 text-[12px] text-text-muted" aria-label={copied ? `${label} copied` : `Copy ${label}`}><span aria-live="polite" className="inline-flex items-center gap-1.5">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}</span></Button></div>;
}

export { default as Empty } from './EmptyState';
