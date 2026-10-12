"use client";

import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'icon' | 'destructive' | 'custom';
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  className?: string;
  variant?: ButtonVariant;
};

const variants: Record<Exclude<ButtonVariant, 'custom'>, string> = {
  primary: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff5500] px-4 font-medium text-white transition hover:bg-[#e64d08] active:scale-[.98]',
  secondary: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#efece7] px-4 font-medium text-[#25211e] transition hover:bg-[#e8e1d9] active:scale-[.98]',
  quiet: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 font-medium text-[#e64d08] transition hover:bg-[#fff0e8] active:scale-[.98]',
  icon: 'grid size-12 shrink-0 place-items-center rounded-full bg-[#f0ece7] text-[#25211e] transition hover:bg-[#e8e1d9] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5500]',
  destructive: 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff0e8] px-4 font-medium text-[#97614a] transition hover:bg-[#f9e1d4] active:scale-[.98]',
};

export default function Button({ type = 'button', variant = 'custom', className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'custom' ? '' : variants[variant];
  return <button type={type} className={`${variantClass} ${className}`.trim()} {...props} />;
}
