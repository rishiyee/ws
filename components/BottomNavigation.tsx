"use client";

import { CalendarDays, Home, UserRound, UsersRound } from 'lucide-react';
import Button from './Button';

type BottomNavigationProps = {
  pathname: string;
  go: (path: string) => void;
};

export default function BottomNavigation({ pathname, go }: BottomNavigationProps) {
  const sections = [
    { title: 'Home', href: '/', Icon: Home, active: pathname === '/' || ['/notifications', '/birthdays', '/search', '/announcements'].includes(pathname) || pathname.startsWith('/announcements/') },
    { title: 'Directory', href: '/directory', Icon: UsersRound, active: pathname === '/directory' || pathname.startsWith('/directory/') },
    { title: 'Events', href: '/events', Icon: CalendarDays, active: pathname === '/events' || pathname.startsWith('/events/') },
    { title: 'Profile', href: '/profile', Icon: UserRound, active: pathname === '/profile' || pathname === '/my-family' },
  ];
  return (
    <nav aria-label="Main navigation" className="liquid-glass absolute isolate inset-x-[14px] bottom-[21px] z-20 flex h-[70px] rounded-full p-1.5 max-[450px]:bottom-[max(12px,env(safe-area-inset-bottom))]">
      {sections.map(({ title, href, Icon, active }) => (
        <Button
          key={title}
          onClick={() => go(href)}
          aria-current={active ? 'page' : undefined}
          className={`relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] transition-colors duration-150 ${active ? 'bg-white/65 font-semibold text-[#e64d08] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_2px_8px_rgba(80,54,38,.08)]' : 'font-medium text-[#6f6963] hover:text-[#25211e]'}`}
        >
          <Icon size={21} strokeWidth={active ? 2.2 : 1.8}/>
          <span>{title}</span>
        </Button>
      ))}
    </nav>
  );
}
