"use client";

import { CircleUserRound, Home, Plane, Plus, UsersRound } from 'lucide-react';
import Button from './Button';
import { Photo } from './AppPrimitives';

type BottomNavigationProps = { pathname: string; memberId: string; go: (path: string) => void };

export default function BottomNavigation({ pathname, memberId, go }: BottomNavigationProps) {
  const sections = [
    { title: 'Home', href: '/', Icon: Home, active: pathname === '/' || ['/notifications', '/birthdays', '/search', '/announcements'].includes(pathname) || pathname.startsWith('/announcements/') },
    { title: 'My Plans', href: '/events', Icon: Plane, active: pathname === '/events' || pathname.startsWith('/events/') },
    { title: 'My People', href: '/directory', Icon: UsersRound, active: pathname === '/directory' || pathname === '/family-groups' || pathname.startsWith('/directory/') },
    { title: 'Profile', href: '/profile', Icon: CircleUserRound, active: pathname === '/profile' || pathname === '/my-family' },
  ];
  return <nav aria-label="Main navigation" className="absolute inset-x-0 bottom-[22px] z-20 flex h-[92px] items-center border-t border-[#eae6e2] bg-[#f6f2ef] px-3 pb-2 sm:inset-x-2 sm:rounded-[30px] sm:border-0 sm:bg-[#f6f2ef]/95">
    {sections.slice(0, 2).map(({ title, href, Icon, active }) => <Button key={title} onClick={() => go(href)} aria-current={active ? 'page' : undefined} className={`flex min-h-[68px] flex-1 flex-col items-center justify-center gap-1 text-[12px] ${active ? 'font-medium text-black' : 'text-[#898785]'}`}>
      <Icon size={25} strokeWidth={active ? 2.3 : 1.8} fill={title === 'Home' && active ? 'currentColor' : 'none'}/><span>{title}</span>
    </Button>)}
    <Button onClick={() => go('/events')} aria-label="Create a plan" className="mx-1 grid size-[68px] shrink-0 place-items-center rounded-full bg-black text-white"><Plus size={34} strokeWidth={1.8}/></Button>
    {sections.slice(2).map(({ title, href, Icon, active }) => <Button key={title} onClick={() => go(href)} aria-current={active ? 'page' : undefined} className={`flex min-h-[68px] flex-1 flex-col items-center justify-center gap-1 text-[12px] ${active ? 'font-medium text-black' : 'text-[#898785]'}`}>
      {title === 'Profile' ? <Photo id={memberId} className="size-[26px] rounded-full"/> : <Icon size={25} strokeWidth={active ? 2.3 : 1.8}/>}<span>{title}</span>
    </Button>)}
  </nav>;
}
