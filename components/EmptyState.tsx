import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  text: string;
  icon?: ReactNode;
  variant?: 'surface' | 'plain';
};

export default function EmptyState({ title, text, icon = <Search size={19} />, variant = 'surface' }: EmptyStateProps) {
  return <div className={`${variant === 'surface' ? 'rounded-[24px] bg-surface' : ''} px-5 py-9 text-center`}>
    <span className={`mx-auto grid size-12 place-items-center rounded-full ${variant === 'surface' ? 'bg-white/80' : 'bg-surface text-text-subtle'}`}>{icon}</span>
    <h2 className="mt-3 text-[15px] font-medium">{title}</h2>
    <p className="mx-auto mt-2 max-w-[360px] text-[12px] leading-5 text-text-muted">{text}</p>
  </div>;
}
