"use client";

import Image from 'next/image';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { memberById } from '../lib/data';
import Button from './Button';

type AppHeaderProps = {
  title: string;
  memberId: string;
  go: (path: string) => void;
  back: () => void;
  canBack: boolean;
  showSearch?: boolean;
};

export default function AppHeader({ title, memberId, go, back, canBack, showSearch = true }: AppHeaderProps) {
  const member = memberById(memberId);
  if (!member) return null;

  return (
    <header className="z-10 flex h-[70px] shrink-0 items-center justify-between gap-3 bg-[#f6f2ef] px-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        {canBack && <Button onClick={back} variant="icon" aria-label="Go back"><ArrowLeft size={21}/></Button>}
        <h1 className="truncate text-[27px] font-normal tracking-[-1px]">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {showSearch && <Button variant="icon" aria-label="Search" onClick={() => go('/search')}><Search size={20}/></Button>}
        {!showSearch && <span aria-hidden="true" className="size-12 shrink-0"/>}
        <Button variant="icon" className="relative" aria-label="Notifications" onClick={() => go('/notifications')}><Bell size={20}/><span className="absolute right-[10px] top-[9px] size-1.5 rounded-full bg-[#ff5500]"/></Button>
        <Button onClick={() => go('/profile')} aria-label="My profile" className="size-12 overflow-hidden rounded-full bg-[#e8e1d9] ring-2 ring-[#f6f2ef]"><Image src={`/photos/${member.photo}.jpg`} alt={`Photo of ${member.name}`} width={96} height={96} className="size-12 rounded-full object-cover"/></Button>
      </div>
    </header>
  );
}
