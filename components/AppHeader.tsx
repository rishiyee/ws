"use client";

import { ArrowLeft, Bell, Search } from 'lucide-react';
import Button from './Button';

type AppHeaderProps = {
  title: string;
  go: (path: string) => void;
  back: () => void;
  canBack: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
};

export default function AppHeader({ title, go, back, canBack, showSearch = true, showNotifications = true }: AppHeaderProps) {
  return (
    <header className="z-10 flex h-[70px] shrink-0 items-center justify-between gap-3 bg-paper px-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        {canBack && <Button onClick={back} variant="icon" aria-label="Go back"><ArrowLeft size={21}/></Button>}
        <h1 className="truncate text-[27px] font-normal tracking-[-1px]">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {showSearch && <Button variant="icon" aria-label="Search" onClick={() => go('/search')}><Search size={20}/></Button>}
        {!showSearch && showNotifications && <span aria-hidden="true" className="size-12 shrink-0"/>}
        {showNotifications && <Button variant="icon" className="relative" aria-label="Notifications" onClick={() => go('/notifications')}><Bell size={20}/><span className="absolute right-[10px] top-[9px] size-1.5 rounded-full bg-brand"/></Button>}
      </div>
    </header>
  );
}
