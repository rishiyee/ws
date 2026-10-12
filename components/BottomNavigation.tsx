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
  const activeIndex = sections.findIndex(section => section.active);

  return (
    <nav aria-label="Main navigation" className="liquid-glass absolute isolate inset-x-[14px] bottom-[21px] z-20 flex h-[70px] rounded-full p-1.5 max-[450px]:bottom-[max(12px,env(safe-area-inset-bottom))]">
      {activeIndex >= 0 && (
        <span
          aria-hidden="true"
          className="liquid-glass-pill absolute bottom-1.5 left-1.5 top-1.5 z-0 w-[calc((100%-12px)/4)] rounded-full"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      )}
      {sections.map(({ title, href, Icon, active }) => (
        <Button
          key={title}
          onClick={() => go(href)}
          aria-current={active ? 'page' : undefined}
          className={`relative z-10 flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] transition-colors duration-200 ${active ? 'font-semibold text-[#e64d08]' : 'font-medium text-[#6f6963] hover:text-[#25211e]'}`}
        >
          <Icon size={21} strokeWidth={active ? 2.2 : 1.8}/>
          <span>{title}</span>
        </Button>
      ))}
    </nav>
  );
}
