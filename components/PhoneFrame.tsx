"use client";

import type { ReactNode } from 'react';

type PhoneFrameProps = {
  children: ReactNode;
  screenClassName?: string;
};

export default function PhoneFrame({ children, screenClassName = '' }: PhoneFrameProps) {
  return (
    <main className="phone-stage flex min-h-svh items-center justify-center overflow-hidden bg-paper p-4 max-[450px]:p-0">
      <div className="phone-frame relative h-[min(890px,calc(100dvh-32px))] w-[min(418px,calc(100vw-32px))] rounded-[58px] border border-frame bg-frame-dark p-2 shadow-[0_32px_65px_rgba(50,43,37,.18)] max-[450px]:h-dvh max-[450px]:w-screen max-[450px]:rounded-none max-[450px]:border-0 max-[450px]:p-0 max-[450px]:shadow-none">
        <div className={`phone-screen relative flex h-full w-full flex-col overflow-hidden rounded-[50px] max-[450px]:rounded-none ${screenClassName}`}>
          {children}
          <div aria-hidden="true" className="phone-home-indicator pointer-events-none absolute bottom-[6px] left-1/2 z-30 h-1 w-[131px] -translate-x-1/2 rounded-full bg-black"/>
        </div>
      </div>
    </main>
  );
}
