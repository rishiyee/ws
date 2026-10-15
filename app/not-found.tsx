import Link from 'next/link';
import { ArrowRight, Compass, Home, UsersRound } from 'lucide-react';
import PhoneFrame from '../components/PhoneFrame';
import { StatusBar } from '../components/AppPrimitives';

export default function NotFound() {
  return <PhoneFrame screenClassName="bg-paper">
    <StatusBar/>
    <main className="flex min-h-0 flex-1 flex-col px-7 pb-8 pt-5">
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative mb-8 grid size-28 place-items-center self-center rounded-[36px] bg-brand-soft text-brand">
          <span className="absolute -right-3 -top-3 rounded-full bg-card px-3 py-1.5 text-[12px] font-semibold tracking-[1.5px] text-brand">404</span>
          <Compass size={54} strokeWidth={1.4}/>
        </div>
        <p className="text-center text-[12px] font-semibold tracking-[1.8px] text-brand">PAGE NOT FOUND</p>
        <h1 className="mt-3 text-center text-[34px] font-normal leading-[1.12] tracking-[-1.2px]">We couldn’t find<br/>this page</h1>
        <p className="mx-auto mt-4 max-w-[290px] text-center text-[14px] leading-6 text-text-muted">The page may have moved, or the link may be out of date.</p>
      </div>
      <nav aria-label="Helpful links" className="space-y-3">
        <Link href="/" className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-brand px-5 text-[14px] font-medium text-white transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          <Home size={18}/> Back to home <ArrowRight size={17}/>
        </Link>
        <Link href="/directory" className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-surface px-5 text-[14px] font-medium text-ink transition hover:bg-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          <UsersRound size={18}/> Browse the directory
        </Link>
      </nav>
    </main>
  </PhoneFrame>;
}
