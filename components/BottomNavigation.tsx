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
    <nav aria-label="Main navigation" className="absolute inset-x-[14px] bottom-[21px] z-20 flex h-[70px] rounded-full border border-[#e8e1d9] bg-white/95 p-1.5 shadow-[0_8px_28px_rgba(54,42,31,.12),0_2px_6px_rgba(54,42,31,.05)] backdrop-blur-xl max-[450px]:bottom-[max(12px,env(safe-area-inset-bottom))]">
      {sections.map(({ title, href, Icon, active }) => (
        <Button
          key={title}
          onClick={() => go(href)}
          aria-current={active ? 'page' : undefined}
          className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] transition-all duration-200 active:scale-95 ${active ? 'bg-[#fff0e8] font-semibold text-[#e64d08]' : 'font-medium text-[#817c76] hover:bg-[#f8f5f1]'}`}
        >
          <Icon size={21} strokeWidth={active ? 2.2 : 1.8}/>
          <span>{title}</span>
        </Button>
      ))}
    </nav>
  );
}
