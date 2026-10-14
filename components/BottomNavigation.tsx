"use client";

import { Home, UsersRound } from 'lucide-react';
import Button from './Button';
import { Photo } from './AppPrimitives';

type BottomNavigationProps = {
  pathname: string;
  memberId: string;
  go: (path: string) => void;
};

export default function BottomNavigation({ pathname, memberId, go }: BottomNavigationProps) {
  const sections = [
    { title: 'Home', href: '/', Icon: Home, active: pathname === '/' || ['/notifications', '/birthdays', '/search', '/announcements'].includes(pathname) || pathname.startsWith('/announcements/') },
    { title: 'Directory', href: '/directory', Icon: UsersRound, active: pathname === '/directory' || pathname === '/family-groups' || pathname.startsWith('/directory/') },
    { title: 'Profile', href: '/profile', Icon: null, active: pathname === '/profile' || pathname === '/my-family' },
  ];
  return (
    <nav aria-label="Main navigation" className="liquid-glass absolute isolate inset-x-[14px] bottom-[calc(env(safe-area-inset-bottom)+8px)] z-20 flex h-[70px] rounded-full p-1.5 min-[451px]:bottom-[21px]">
      {sections.map(({ title, href, Icon, active }) => (
        <Button
          key={title}
          onClick={() => go(href)}
          aria-current={active ? 'page' : undefined}
          className={`relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] transition-colors duration-150 ${active ? 'bg-white/65 font-semibold text-[#e64d08] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_2px_8px_rgba(80,54,38,.08)]' : 'font-medium text-[#6f6963] hover:text-[#25211e]'}`}
        >
          {title === 'Profile' ? <Photo id={memberId} className={`size-[22px] rounded-full border border-white/80 ${active ? 'ring-1 ring-[#e64d08]/50' : ''}`}/> : Icon && <Icon size={21} strokeWidth={active ? 2.2 : 1.8}/>}
          <span>{title}</span>
        </Button>
      ))}
    </nav>
  );
}
