"use client";

import { Bell, CircleUserRound, Home, UsersRound } from 'lucide-react';
import Button from './Button';
import { Photo } from './AppPrimitives';

type BottomNavigationProps = { pathname: string; memberId: string; go: (path: string) => void };

export default function BottomNavigation({ pathname, memberId, go }: BottomNavigationProps) {
  const sections = [
    { title: 'Home', href: '/', Icon: Home, active: pathname === '/' || pathname === '/search' },
    { title: 'Directory', href: '/directory', Icon: UsersRound, active: pathname === '/directory' || pathname === '/family-groups' || pathname.startsWith('/directory/') || pathname.startsWith('/families/') || pathname.startsWith('/members/') },
    { title: 'Notifications', href: '/notifications', Icon: Bell, active: ['/notifications', '/birthdays', '/announcements'].includes(pathname) || pathname.startsWith('/announcements/') },
    { title: 'Profile', href: '/profile', Icon: CircleUserRound, active: pathname === '/profile' || pathname === '/my-family' },
  ];
  return <nav aria-label="Main navigation" className="absolute inset-x-0 bottom-0 z-20 flex h-[88px] items-center border-t border-border-soft bg-paper px-3 sm:inset-x-2 sm:bottom-[6px] sm:h-[92px] sm:rounded-[30px] sm:border-0 sm:bg-paper/95" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
    {sections.map(({ title, href, Icon, active }) => <Button key={title} onClick={() => go(href)} aria-current={active ? 'page' : undefined} className={`flex min-h-[68px] flex-1 flex-col items-center justify-center gap-1 text-[12px] ${active ? 'font-semibold text-brand' : 'font-normal text-text-subtle'}`}>
      {title === 'Profile' ? <Photo id={memberId} className={`size-[26px] rounded-full ${active ? 'ring-2 ring-brand ring-offset-2 ring-offset-paper' : ''}`}/> : <Icon size={24} strokeWidth={active ? 2.2 : 1.8}/>}<span>{title}</span>
    </Button>)}
  </nav>;
}
