"use client";

import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'icon' | 'destructive' | 'custom';
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  className?: string;
  variant?: ButtonVariant;
};

const variants: Record<Exclude<ButtonVariant, 'custom'>, string> = {
  primary: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-4 font-medium text-white transition hover:bg-brand-hover active:scale-[.98]',
  secondary: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-surface px-4 font-medium text-ink transition hover:bg-action active:scale-[.98]',
  quiet: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-medium text-brand-hover transition hover:bg-brand-soft active:scale-[.98]',
  icon: 'grid size-12 shrink-0 place-items-center rounded-full bg-action text-ink transition hover:bg-action active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
  destructive: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-soft px-4 font-medium text-status-danger transition hover:bg-status-danger-soft active:scale-[.98]',
};

export default function Button({ type = 'button', variant = 'custom', className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'custom' ? '' : variants[variant];
  return <button type={type} className={`${variantClass} ${className}`.trim()} {...props} />;
}
