import type { HTMLAttributes } from 'react';

export default function SurfaceCard({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`rounded-[24px] bg-[#efece7] p-4 ${className}`.trim()} {...props} />;
}
